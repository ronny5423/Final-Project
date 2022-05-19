from functools import wraps

from flask import session
from flask.wrappers import Response


def admin_required(f):
    @wraps(f)
    def requires_admin(*args, **kwargs):
        try:
            if session['admin']:
                return f(*args, **kwargs)
            else:
                return Response(status=401, mimetype='application/json')
        except Exception as e:
            return Response(status=409, mimetype='application/json')

    return requires_admin
