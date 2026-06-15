"""User endpoints: list (admin), profile, update."""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user_model import User
from app.utils.auth_helpers import role_required

user_bp = Blueprint("users", __name__)


@user_bp.get("/")
@role_required("admin")
def list_users():
    return jsonify([u.to_dict() for u in User.query.all()])


@user_bp.get("/me")
@jwt_required()
def get_profile():
    user = User.query.get(int(get_jwt_identity()))
    if not user:
        return jsonify(error="not found"), 404
    return jsonify(user.to_dict())


@user_bp.put("/me")
@jwt_required()
def update_profile():
    user = User.query.get(int(get_jwt_identity()))
    if not user:
        return jsonify(error="not found"), 404
    data = request.get_json() or {}
    if "name" in data:
        user.name = data["name"]
    if data.get("password"):
        user.set_password(data["password"])
    db.session.commit()
    return jsonify(user.to_dict())
