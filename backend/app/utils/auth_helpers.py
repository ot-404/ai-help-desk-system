"""Auth helpers shared across routes."""
from flask_jwt_extended import get_jwt_identity
from app.models.user_model import User


def current_user():
    """Return the User for the JWT identity, or None."""
    uid = get_jwt_identity()
    if uid is None:
        return None
    return User.query.get(int(uid))
