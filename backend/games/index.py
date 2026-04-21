import json
import os
import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    """Список игр и категорий для биржи ASTREX"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    conn = get_db()
    try:
        cur = conn.cursor()
        cur.execute(
            "SELECT id, slug, name, emoji, color_from, color_to, description, offers_count FROM games WHERE is_active = true ORDER BY offers_count DESC"
        )
        rows = cur.fetchall()
        games = [
            {'id': r[0], 'slug': r[1], 'name': r[2], 'emoji': r[3],
             'color_from': r[4], 'color_to': r[5], 'description': r[6], 'offers_count': r[7]}
            for r in rows
        ]

        cur.execute("SELECT id, name, slug FROM offer_categories ORDER BY id")
        cats = cur.fetchall()
        categories = [{'id': r[0], 'name': r[1], 'slug': r[2]} for r in cats]

        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'games': games, 'categories': categories})}
    finally:
        conn.close()
