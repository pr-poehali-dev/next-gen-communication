import json
import os
import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id',
}

COMMISSION_RATE = 0.05  # 5% комиссия биржи

def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def get_session_user(conn, session_id: str):
    cur = conn.cursor()
    cur.execute(
        "SELECT u.id, u.username, u.balance FROM sessions s JOIN users u ON u.id = s.user_id "
        "WHERE s.id = %s AND s.expires_at > NOW()",
        (session_id,)
    )
    row = cur.fetchone()
    if not row:
        return None
    return {'id': row[0], 'username': row[1], 'balance': float(row[2])}

def handler(event: dict, context) -> dict:
    """Сделки: создание, подтверждение, список, статус"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    path = event.get('path', '/')
    method = event.get('httpMethod', 'GET')
    session_id = event.get('headers', {}).get('X-Session-Id', '')

    conn = get_db()
    try:
        user = get_session_user(conn, session_id)
        if not user:
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Не авторизован'})}

        cur = conn.cursor()
        path_parts = [p for p in path.split('/') if p]

        # GET /deals — список сделок пользователя
        if method == 'GET' and len(path_parts) <= 1:
            cur.execute(
                "SELECT d.id, d.status, d.total_amount, d.quantity, d.created_at, d.paid_at, d.completed_at, "
                "o.title, g.name, g.emoji, "
                "buyer.username, seller.username, "
                "d.buyer_id, d.seller_id "
                "FROM deals d "
                "JOIN offers o ON o.id = d.offer_id "
                "JOIN games g ON g.id = o.game_id "
                "JOIN users buyer ON buyer.id = d.buyer_id "
                "JOIN users seller ON seller.id = d.seller_id "
                "WHERE d.buyer_id = %s OR d.seller_id = %s "
                "ORDER BY d.created_at DESC LIMIT 20",
                (user['id'], user['id'])
            )
            rows = cur.fetchall()
            deals = [{
                'id': r[0], 'status': r[1], 'total_amount': float(r[2]), 'quantity': r[3],
                'created_at': str(r[4]), 'paid_at': str(r[5]) if r[5] else None,
                'completed_at': str(r[6]) if r[6] else None,
                'offer_title': r[7], 'game_name': r[8], 'game_emoji': r[9],
                'buyer_username': r[10], 'seller_username': r[11],
                'is_buyer': r[12] == user['id'], 'is_seller': r[13] == user['id']
            } for r in rows]
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'deals': deals})}

        # GET /deals/{id}
        if method == 'GET' and path_parts[-1].isdigit():
            deal_id = int(path_parts[-1])
            cur.execute(
                "SELECT d.id, d.status, d.total_amount, d.seller_amount, d.commission, d.quantity, "
                "d.price_per_unit, d.created_at, d.paid_at, d.completed_at, d.buyer_confirmed, "
                "o.title, o.instructions, g.name, g.emoji, "
                "buyer.username, buyer.avatar_color, seller.username, seller.avatar_color, "
                "d.buyer_id, d.seller_id "
                "FROM deals d "
                "JOIN offers o ON o.id = d.offer_id "
                "JOIN games g ON g.id = o.game_id "
                "JOIN users buyer ON buyer.id = d.buyer_id "
                "JOIN users seller ON seller.id = d.seller_id "
                "WHERE d.id = %s AND (d.buyer_id = %s OR d.seller_id = %s)",
                (deal_id, user['id'], user['id'])
            )
            row = cur.fetchone()
            if not row:
                return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Сделка не найдена'})}
            deal = {
                'id': row[0], 'status': row[1], 'total_amount': float(row[2]),
                'seller_amount': float(row[3]), 'commission': float(row[4]),
                'quantity': row[5], 'price_per_unit': float(row[6]),
                'created_at': str(row[7]), 'paid_at': str(row[8]) if row[8] else None,
                'completed_at': str(row[9]) if row[9] else None,
                'buyer_confirmed': row[10],
                'offer_title': row[11], 'instructions': row[12],
                'game_name': row[13], 'game_emoji': row[14],
                'buyer': {'username': row[15], 'avatar_color': row[16]},
                'seller': {'username': row[17], 'avatar_color': row[18]},
                'is_buyer': row[19] == user['id'], 'is_seller': row[20] == user['id']
            }
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'deal': deal})}

        body = json.loads(event.get('body') or '{}')

        # POST /deals/create — создать сделку (тест: сразу paid)
        if method == 'POST' and path.endswith('/create'):
            offer_id = body.get('offer_id')
            quantity = int(body.get('quantity') or 1)

            cur.execute(
                "SELECT o.id, o.seller_id, o.price, o.max_quantity, o.is_active, o.title "
                "FROM offers o WHERE o.id = %s",
                (offer_id,)
            )
            offer = cur.fetchone()
            if not offer:
                return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Объявление не найдено'})}
            if not offer[4]:
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Объявление неактивно'})}
            if offer[1] == user['id']:
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Нельзя купить у себя'})}
            if quantity > offer[3]:
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': f'Максимум {offer[3]} шт.'})}

            price = float(offer[2])
            total = round(price * quantity, 2)
            commission = round(total * COMMISSION_RATE, 2)
            seller_amount = round(total - commission, 2)

            # В тест режиме: сразу создаём сделку со статусом "paid" и списываем с баланса
            if user['balance'] < total:
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': f'Недостаточно средств. Нужно {total} ₽, у вас {user["balance"]} ₽'})}

            cur.execute(
                "INSERT INTO deals (offer_id, buyer_id, seller_id, quantity, price_per_unit, total_amount, commission, seller_amount, status, paid_at) "
                "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'paid', NOW()) RETURNING id",
                (offer_id, user['id'], offer[1], quantity, price, total, commission, seller_amount)
            )
            deal_id = cur.fetchone()[0]

            # Списываем с баланса покупателя, замораживаем у продавца
            cur.execute("UPDATE users SET balance = balance - %s WHERE id = %s", (total, user['id']))
            cur.execute("UPDATE users SET frozen_balance = frozen_balance + %s WHERE id = %s", (seller_amount, offer[1]))
            cur.execute("INSERT INTO payments (deal_id, user_id, amount, status, test_mode) VALUES (%s, %s, %s, 'success', true)", (deal_id, user['id'], total))
            conn.commit()

            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'deal_id': deal_id, 'status': 'paid'})}

        # POST /deals/{id}/confirm — покупатель подтверждает получение
        if method == 'POST' and 'confirm' in path:
            path_parts2 = [p for p in path.split('/') if p]
            deal_id = int(path_parts2[-2]) if len(path_parts2) >= 2 else None
            if not deal_id:
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Нет id сделки'})}

            cur.execute("SELECT buyer_id, seller_id, seller_amount, status FROM deals WHERE id = %s", (deal_id,))
            deal = cur.fetchone()
            if not deal:
                return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Сделка не найдена'})}
            if deal[0] != user['id']:
                return {'statusCode': 403, 'headers': CORS, 'body': json.dumps({'error': 'Только покупатель может подтвердить'})}
            if deal[3] != 'paid':
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Сделка не в статусе paid'})}

            seller_amount = float(deal[2])
            cur.execute(
                "UPDATE deals SET status = 'completed', buyer_confirmed = true, completed_at = NOW() WHERE id = %s",
                (deal_id,)
            )
            # Размораживаем деньги продавцу
            cur.execute(
                "UPDATE users SET balance = balance + %s, frozen_balance = frozen_balance - %s, deals_count = deals_count + 1 WHERE id = %s",
                (seller_amount, seller_amount, deal[1])
            )
            cur.execute("UPDATE users SET deals_count = deals_count + 1 WHERE id = %s", (deal[0],))
            cur.execute("UPDATE offers SET deals_count = deals_count + 1 WHERE id = (SELECT offer_id FROM deals WHERE id = %s)", (deal_id,))
            conn.commit()

            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True, 'status': 'completed'})}

        # POST /deals/{id}/dispute — открыть спор
        if method == 'POST' and 'dispute' in path:
            path_parts2 = [p for p in path.split('/') if p]
            deal_id = int(path_parts2[-2]) if len(path_parts2) >= 2 else None
            reason = body.get('reason', '')

            cur.execute("SELECT buyer_id, status FROM deals WHERE id = %s", (deal_id,))
            deal = cur.fetchone()
            if not deal or deal[0] != user['id']:
                return {'statusCode': 403, 'headers': CORS, 'body': json.dumps({'error': 'Нет доступа'})}
            if deal[1] != 'paid':
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Нельзя открыть спор'})}

            cur.execute("UPDATE deals SET status = 'disputed', dispute_reason = %s WHERE id = %s", (reason, deal_id))
            conn.commit()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

        # POST /deals/{id}/review — оставить отзыв
        if method == 'POST' and 'review' in path:
            path_parts2 = [p for p in path.split('/') if p]
            deal_id = int(path_parts2[-2]) if len(path_parts2) >= 2 else None
            rating = int(body.get('rating') or 0)
            comment = (body.get('comment') or '').strip()

            if not deal_id or not (1 <= rating <= 5):
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Укажите оценку 1-5'})}

            cur.execute("SELECT buyer_id, seller_id, status FROM deals WHERE id = %s", (deal_id,))
            deal = cur.fetchone()
            if not deal or deal[0] != user['id']:
                return {'statusCode': 403, 'headers': CORS, 'body': json.dumps({'error': 'Нет доступа'})}
            if deal[2] != 'completed':
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Сделка ещё не завершена'})}

            cur.execute("SELECT id FROM reviews WHERE deal_id = %s AND reviewer_id = %s", (deal_id, user['id']))
            if cur.fetchone():
                return {'statusCode': 409, 'headers': CORS, 'body': json.dumps({'error': 'Отзыв уже оставлен'})}

            seller_id = deal[1]
            cur.execute(
                "INSERT INTO reviews (deal_id, reviewer_id, seller_id, rating, comment) VALUES (%s, %s, %s, %s, %s)",
                (deal_id, user['id'], seller_id, rating, comment or None)
            )
            cur.execute(
                "UPDATE users SET rating = (SELECT AVG(rating) FROM reviews WHERE seller_id = %s), "
                "reviews_count = reviews_count + 1 WHERE id = %s",
                (seller_id, seller_id)
            )
            conn.commit()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

        return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Not found'})}
    finally:
        conn.close()