import functools
import json

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

from blockstream.dataaccess import gamedataaccess
from blockstream.auth import login_required

bp = Blueprint("game", __name__, url_prefix="/game")

@bp.route("/play")
@login_required
def play():
    """Let the games begin"""
    
    return render_template("game/play.html")

@bp.route("/scores", methods=("GET","POST"))
def scores():

    error = None

    if request.method == "POST":
        user_id = session["user_id"]
        data = json.loads(request.data)
        val = data.get('val')
        #error = "Post has not been implemented yet."
        gamedataaccess.add_score(user_id, val)

        flash(error)
    
    score_list = gamedataaccess.get()
    #score_list = [ { "username" : "jrose", "val" : 100, "created" : "1/1/2020" },{ "username" : "jrose", "val" : 150, "created" : "1/5/2020" },]

    return render_template("game/scores.html", scores=score_list)