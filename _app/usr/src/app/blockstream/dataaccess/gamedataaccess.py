
from blockstream.db import get_db

def get():
    return get_db().execute(
        "SELECT s.val, s.created, u.username"
        " FROM score s JOIN user u ON s.player_id = u.id"
        " ORDER BY s.created DESC"
    ).fetchall()


def add_score(user_id, val):
    get_db().execute(
                "INSERT INTO score (player_id, val) VALUES (?, ?)",
                (user_id, val),
            )
    get_db().commit()