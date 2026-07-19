from functools import wraps

from flask_jwt_extended import get_jwt, jwt_required

from app.core.enums import UserRole
from app.core.exceptions import ForbiddenException

def auth_required(fn):
    """
    Ensures the request contains a valid access token.
    """

    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs)

    return wrapper

def roles_required(*roles: UserRole):
    """
    Ensures the authenticated user has one of the required roles.
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            claims = get_jwt()
            user_role = claims.get("role")

            allowed_role = {
                role.value for role in roles
            }

            if user_role not in allowed_role:
                raise ForbiddenException(
                    "You do not have permission to perform this action."
                )
            
            return fn(*args, **kwargs)
        return wrapper
    return decorator

def refresh_required(fn):
    @wraps(fn)
    @jwt_required(refresh=True)
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs)

    return wrapper