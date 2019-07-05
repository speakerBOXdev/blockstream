
from blockstream.db import get_db

def get_by_id(user_id):
    return get_db().execute("SELECT * FROM user WHERE id = ?", (user_id,)).fetchone()

def get_by_username(username):
    return get_db().execute("SELECT * FROM user WHERE username = ?", (username,)).fetchone()

def add_user(username, password):
    get_db().execute(
                "INSERT INTO user (username, password) VALUES (?, ?)",
                (username, password),
            )
    get_db().commit()