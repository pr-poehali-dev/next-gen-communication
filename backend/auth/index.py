import json
import os
import secrets
import hashlib
import psycopg2
from datetime import datetime

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id',
}

def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def get_session_user(conn, session_id: str):
    cur = conn.cursor()
    cur.execute(
        "SELECT u.id, u.username, u.email, u.balance, u.avatar_color, u.rating, u.reviews_count, u.deals_count "
        "FROM sessions s JOIN users u ON u.id = s.user_id "
        "WHERE s.id = %s AND s.expires_at > NOW()",
        (session_id,)
    )
    row = cur.fetchone()
    if not row:
        return None
    return {
        'id': row[0], 'username': row[1], 'email': row[2],
        'balance': float(row[3]), 'avatar_color': row[4],
        'rating': float(row[5]), 'reviews_count': row[6], 'deals_count': row[7]
    }

def handler(event: dict, context) -> dict:
    """Авторизация: register, login, logout, me"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    path = event.get('path', '/')
    method = event.get('httpMethod', 'GET')
    session_id = event.get('headers', {}).get('X-Session-Id', '')

    conn = get_db()
    try:
        # GET /auth/me
        if method == 'GET' and path.endswith('/me'):
            if not session_id:
                return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Не авторизован'})}
            user = get_session_user(conn, session_id)
            if not user:
                return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Сессия истекла'})}
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'user': user})}

        body = json.loads(event.get('body') or '{}')

        # POST /auth/register
        if method == 'POST' and path.endswith('/register'):
            username = (body.get('username') or '').strip()
            email = (body.get('email') or '').strip().lower()
            password = body.get('password') or ''

            if not username or not email or not password:
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Заполните все поля'})}
            if len(username) < 3:
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Имя минимум 3 символа'})}
            if len(password) < 6:
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Пароль минимум 6 символов'})}

            colors = ['#7c3aed', '#db2777', '#059669', '#d97706', '#dc2626', '#2563eb']
            import random
            color = random.choice(colors)

            cur = conn.cursor()
            try:
                cur.execute(
                    "INSERT INTO users (username, email, password_hash, avatar_color) VALUES (%s, %s, %s, %s) RETURNING id",
                    (username, email, hash_password(password), color)
                )
                user_id = cur.fetchone()[0]
                conn.commit()
            except psycopg2.errors.UniqueViolation:
                conn.rollback()
                return {'statusCode': 409, 'headers': CORS, 'body': json.dumps({'error': 'Логин или email уже занят'})}

            session_id = secrets.token_hex(32)
            cur.execute("INSERT INTO sessions (id, user_id) VALUES (%s, %s)", (session_id, user_id))
            conn.commit()

            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({
                'session_id': session_id,
                'user': {'id': user_id, 'username': username, 'email': email, 'balance': 0, 'avatar_color': color, 'rating': 0, 'reviews_count': 0, 'deals_count': 0}
            })}

        # POST /auth/login
        if method == 'POST' and path.endswith('/login'):
            email = (body.get('email') or '').strip().lower()
            password = body.get('password') or ''

            cur = conn.cursor()
            cur.execute(
                "SELECT id, username, email, balance, avatar_color, rating, reviews_count, deals_count FROM users WHERE email = %s AND password_hash = %s",
                (email, hash_password(password))
            )
            row = cur.fetchone()
            if not row:
                return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Неверный email или пароль'})}

            user = {'id': row[0], 'username': row[1], 'email': row[2], 'balance': float(row[3]), 'avatar_color': row[4], 'rating': float(row[5]), 'reviews_count': row[6], 'deals_count': row[7]}

            new_session = secrets.token_hex(32)
            cur.execute("INSERT INTO sessions (id, user_id) VALUES (%s, %s)", (new_session, user['id']))
            cur.execute("UPDATE users SET is_online = true, last_seen_at = NOW() WHERE id = %s", (user['id'],))
            conn.commit()

            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'session_id': new_session, 'user': user})}

        # POST /auth/logout
        if method == 'POST' and path.endswith('/logout'):
            if session_id:
                cur = conn.cursor()
                cur.execute("UPDATE users SET is_online = false WHERE id = (SELECT user_id FROM sessions WHERE id = %s)", (session_id,))
                cur.execute("DELETE FROM sessions WHERE id = %s", (session_id,))
                conn.commit()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

        return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Not found'})}
    finally:
        conn.close()
