import json
import os
import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id',
}

def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def get_session_user(conn, session_id: str):
    cur = conn.cursor()
    cur.execute(
        "SELECT u.id, u.username, u.balance, u.frozen_balance FROM sessions s JOIN users u ON u.id = s.user_id "
        "WHERE s.id = %s AND s.expires_at > NOW()",
        (session_id,)
    )
    row = cur.fetchone()
    if not row:
        return None
    return {'id': row[0], 'username': row[1], 'balance': float(row[2]), 'frozen_balance': float(row[3])}

def handler(event: dict, context) -> dict:
    """Баланс: пополнение (тест), история"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    session_id = event.get('headers', {}).get('X-Session-Id', '')

    conn = get_db()
    try:
        user = get_session_user(conn, session_id)
        if not user:
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Не авторизован'})}

        cur = conn.cursor()

        if method == 'GET':
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({
                'balance': user['balance'],
                'frozen_balance': user['frozen_balance']
            })}

        if method == 'POST':
            body = json.loads(event.get('body') or '{}')
            amount = float(body.get('amount') or 0)

            if amount <= 0 or amount > 100000:
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Сумма от 1 до 100 000 ₽'})}

            # Тестовый режим — просто зачисляем
            cur.execute("UPDATE users SET balance = balance + %s WHERE id = %s RETURNING balance", (amount, user['id']))
            new_balance = float(cur.fetchone()[0])
            conn.commit()

            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({
                'ok': True,
                'balance': new_balance,
                'message': f'Тестовое пополнение на {amount} ₽ выполнено'
            })}

        return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Not found'})}
    finally:
        conn.close()
