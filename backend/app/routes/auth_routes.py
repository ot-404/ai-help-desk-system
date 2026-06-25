"""Auth endpoints: register, login, current user."""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required
from app import db
from app.models.user_model import User
from app.utils.auth_helpers import current_user

auth_bp = Blueprint("auth", __name__)


def _issue(user):
    token = create_access_token(identity=str(user.id))
    return jsonify(access_token=token, user=user.to_dict())


@auth_bp.post("/register")
def register():
    data = request.get_json() or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    if not name or not email or not password:
        return jsonify(error="Name, email and password are required."), 400
    if len(password) < 6:
        return jsonify(error="Password must be at least 6 characters."), 400
    if User.query.filter(db.func.lower(User.email) == email).first():
        return jsonify(error="That email is already registered."), 409

    user = User(name=name, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.flush()  # need user.id for the starter list

    from app.utils.seed import create_starter_content
    create_starter_content(user)

    db.session.commit()
    return _issue(user), 201


@auth_bp.post("/login")
def login():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    user = User.query.filter(db.func.lower(User.email) == email).first()
    if not user or not user.check_password(data.get("password", "")):
        return jsonify(error="Invalid email or password."), 401
    return _issue(user)


@auth_bp.get("/me")
@jwt_required()
def me():
    user = current_user()
    if not user:
        return jsonify(error="Not found"), 404
    return jsonify(user.to_dict())
