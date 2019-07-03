import functools

from flask import Blueprint
from flask import flash
from flask import g
from flask import redirect
from flask import render_template
from flask import request
from flask import session
from flask import url_for
from werkzeug.security import check_password_hash
from werkzeug.security import generate_password_hash

from blockstream.db import get_db

bp = Blueprint("game", __name__, url_prefix="/game")

@bp.route("/play")
def play():
    """Let the games begin"""
    
    return render_template("game/play.html")
