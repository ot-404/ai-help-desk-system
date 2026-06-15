"""Auth endpoints: register, login, logout."""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db
from app.models.user_model import User

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register():
    data = request.get_json() or {}
    if not all(data.get(k) for k in ("name", "email", "password")):
        return jsonify(error="name, email and password are required"), 400
    if User.query.filter_by(email=data["email"]).first():
        return jsonify(error="email already registered"), 409
    user = User(name=data["name"], email=data["email"], role=data.get("role", "user"))
    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201


@auth_bp.post("/login")
def login():
    data = request.get_json() or {}
    user = User.query.filter_by(email=data.get("email")).first()
    if not user or not user.check_password(data.get("password", "")):
        return jsonify(error="invalid credentials"), 401
    token = create_access_token(
        identity=str(user.id), additional_claims={"role": user.role}
    )
    return jsonify(access_token=token, user=user.to_dict())


@auth_bp.post("/logout")
@jwt_required()
def logout():
    # Stateless JWT: client discards the token. For server-side revocation,
    # add a token blocklist here.
    return jsonify(message="logged out", user_id=get_jwt_identity())
