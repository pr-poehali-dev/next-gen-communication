import json
import os
import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id',
}

def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def get_session_user(conn, session_id: str):
    cur = conn.cursor()
    cur.execute(
        "SELECT u.id, u.username, u.avatar_color, u.rating, u.reviews_count, u.deals_count "
        "FROM sessions s JOIN users u ON u.id = s.user_id "
        "WHERE s.id = %s AND s.expires_at > NOW()",
        (session_id,)
    )
    row = cur.fetchone()
    if not row:
        return None
    return {'id': row[0], 'username': row[1], 'avatar_color': row[2], 'rating': float(row[3]), 'reviews_count': row[4], 'deals_count': row[5]}

def handler(event: dict, context) -> dict:
    """Объявления: список, создание, получение по id"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    path = event.get('path', '/')
    method = event.get('httpMethod', 'GET')
    session_id = event.get('headers', {}).get('X-Session-Id', '')
    params = event.get('queryStringParameters') or {}

    conn = get_db()
    try:
        cur = conn.cursor()

        # GET /offers или /offers?game=roblox&category=currency&sort=price
        if method == 'GET':
            path_parts = [p for p in path.split('/') if p]

            # GET /offers/{id}
            if len(path_parts) >= 2 and path_parts[-1].isdigit():
                offer_id = int(path_parts[-1])
                cur.execute(
                    "SELECT o.id, o.title, o.description, o.price, o.min_quantity, o.max_quantity, "
                    "o.instructions, o.deals_count, o.views_count, o.created_at, "
                    "u.id, u.username, u.avatar_color, u.rating, u.reviews_count, u.deals_count, u.is_online, "
                    "g.slug, g.name, g.emoji, oc.name "
                    "FROM offers o "
                    "JOIN users u ON u.id = o.seller_id "
                    "JOIN games g ON g.id = o.game_id "
                    "LEFT JOIN offer_categories oc ON oc.id = o.category_id "
                    "WHERE o.id = %s AND o.is_active = true",
                    (offer_id,)
                )
                row = cur.fetchone()
                if not row:
                    return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Не найдено'})}

                cur.execute("UPDATE offers SET views_count = views_count + 1 WHERE id = %s", (offer_id,))
                conn.commit()

                cur.execute(
                    "SELECT r.rating, r.comment, r.created_at, u.username, u.avatar_color "
                    "FROM reviews r JOIN users u ON u.id = r.reviewer_id "
                    "WHERE r.seller_id = %s ORDER BY r.created_at DESC LIMIT 5",
                    (row[10],)
                )
                review_rows = cur.fetchall()
                reviews = [{'rating': rr[0], 'comment': rr[1], 'created_at': str(rr[2]), 'username': rr[3], 'avatar_color': rr[4]} for rr in review_rows]

                offer = {
                    'id': row[0], 'title': row[1], 'description': row[2],
                    'price': float(row[3]), 'min_quantity': row[4], 'max_quantity': row[5],
                    'instructions': row[6], 'deals_count': row[7], 'views_count': row[8]+1,
                    'created_at': str(row[9]),
                    'seller': {'id': row[10], 'username': row[11], 'avatar_color': row[12],
                               'rating': float(row[13]), 'reviews_count': row[14], 'deals_count': row[15], 'is_online': row[16]},
                    'game': {'slug': row[17], 'name': row[18], 'emoji': row[19]},
                    'category': row[20],
                    'reviews': reviews
                }
                return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'offer': offer})}

            # GET /offers?game=roblox
            game_slug = params.get('game', '')
            category_slug = params.get('category', '')
            sort = params.get('sort', 'created_at')
            search = params.get('search', '')
            limit = min(int(params.get('limit', 20)), 50)
            offset = int(params.get('offset', 0))

            where = ["o.is_active = true"]
            args = []

            if game_slug:
                where.append("g.slug = %s")
                args.append(game_slug)
            if category_slug:
                where.append("oc.slug = %s")
                args.append(category_slug)
            if search:
                where.append("o.title ILIKE %s")
                args.append(f'%{search}%')

            order = "o.created_at DESC"
            if sort == 'price_asc':
                order = "o.price ASC"
            elif sort == 'price_desc':
                order = "o.price DESC"
            elif sort == 'rating':
                order = "u.rating DESC"
            elif sort == 'deals':
                order = "o.deals_count DESC"

            where_sql = " AND ".join(where)
            args += [limit, offset]

            cur.execute(
                f"SELECT o.id, o.title, o.price, o.min_quantity, o.max_quantity, o.deals_count, "
                f"u.id, u.username, u.avatar_color, u.rating, u.reviews_count, u.is_online, "
                f"g.slug, g.name, g.emoji, oc.name "
                f"FROM offers o "
                f"JOIN users u ON u.id = o.seller_id "
                f"JOIN games g ON g.id = o.game_id "
                f"LEFT JOIN offer_categories oc ON oc.id = o.category_id "
                f"WHERE {where_sql} ORDER BY {order} LIMIT %s OFFSET %s",
                args
            )
            rows = cur.fetchall()

            cur.execute(
                f"SELECT COUNT(*) FROM offers o JOIN users u ON u.id = o.seller_id "
                f"JOIN games g ON g.id = o.game_id LEFT JOIN offer_categories oc ON oc.id = o.category_id "
                f"WHERE {where_sql}",
                args[:-2]
            )
            total = cur.fetchone()[0]

            offers = [{
                'id': r[0], 'title': r[1], 'price': float(r[2]),
                'min_quantity': r[3], 'max_quantity': r[4], 'deals_count': r[5],
                'seller': {'id': r[6], 'username': r[7], 'avatar_color': r[8],
                           'rating': float(r[9]), 'reviews_count': r[10], 'is_online': r[11]},
                'game': {'slug': r[12], 'name': r[13], 'emoji': r[14]},
                'category': r[15]
            } for r in rows]

            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'offers': offers, 'total': total})}

        # POST /offers — создать объявление
        if method == 'POST':
            user = get_session_user(conn, session_id)
            if not user:
                return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Не авторизован'})}

            body = json.loads(event.get('body') or '{}')
            game_slug = body.get('game_slug', '')
            title = (body.get('title') or '').strip()
            description = (body.get('description') or '').strip()
            price = float(body.get('price') or 0)
            max_quantity = int(body.get('max_quantity') or 1)
            instructions = (body.get('instructions') or '').strip()
            category_id = body.get('category_id')

            if not title or not description or not game_slug or price <= 0:
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Заполните все обязательные поля'})}

            cur.execute("SELECT id FROM games WHERE slug = %s", (game_slug,))
            game_row = cur.fetchone()
            if not game_row:
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Игра не найдена'})}
            game_id = game_row[0]

            cur.execute(
                "INSERT INTO offers (seller_id, game_id, category_id, title, description, price, max_quantity, instructions) "
                "VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id",
                (user['id'], game_id, category_id, title, description, price, max_quantity, instructions or None)
            )
            offer_id = cur.fetchone()[0]
            cur.execute("UPDATE games SET offers_count = offers_count + 1 WHERE id = %s", (game_id,))
            conn.commit()

            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'offer_id': offer_id})}

        # PUT /offers/{id}/deactivate
        if method == 'PUT':
            user = get_session_user(conn, session_id)
            if not user:
                return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Не авторизован'})}

            path_parts = [p for p in path.split('/') if p]
            if len(path_parts) >= 2 and path_parts[-2].isdigit():
                offer_id = int(path_parts[-2])
                cur.execute("SELECT seller_id FROM offers WHERE id = %s", (offer_id,))
                row = cur.fetchone()
                if not row or row[0] != user['id']:
                    return {'statusCode': 403, 'headers': CORS, 'body': json.dumps({'error': 'Нет доступа'})}
                cur.execute("UPDATE offers SET is_active = NOT is_active WHERE id = %s", (offer_id,))
                conn.commit()
                return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

        return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Not found'})}
    finally:
        conn.close()
