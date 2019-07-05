
from blockstream.db import get_db


def add(title, body, user_id):
    db = get_db()
    db.execute(
        "INSERT INTO post (title, body, author_id) VALUES (?, ?, ?)",
        (title, body, user_id),
    )
    db.commit()

def delete(id):
    """Delete post by id"""
    db = get_db()
    db.execute("DELETE FROM post WHERE id = ?", (id,))
    db.commit()

def get():
    """Get all posts"""
    db = get_db()
    posts = db.execute(
        "SELECT p.id, p.title, p.body, p.created, p.author_id, u.username"
        " FROM post p JOIN user u ON p.author_id = u.id"
        " ORDER BY p.created DESC"
    ).fetchall()
    return posts

def get_by_id(id):
    """Get post by id"""
    post = (
        get_db()
        .execute(
            "SELECT p.id, p.title, p.body, p.created, p.author_id, u.username"
            " FROM post p JOIN user u ON p.author_id = u.id"
            " WHERE p.id = ?",
            (id,),
        )
        .fetchone()
    )
    return post

def update(id, title, body):
    """Update post"""
    db = get_db()
    db.execute(
        "UPDATE post SET title = ?, body = ? WHERE id = ?", (title, body, id)
    )
    db.commit()
