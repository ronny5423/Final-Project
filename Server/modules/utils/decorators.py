from functools import wraps

from flask import session
from flask.wrappers import Response


def admin_required(f):
    @wraps(f)
    def requires_admin(*args, **kwargs):
        if session['admin']:
            return f(*args, **kwargs)
        else:
            return Response(status=401, mimetype='application/json')

    return requires_admin
