"""List (project) CRUD — scoped to the current user."""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.list_model import TaskList
from app.models.task_model import Task

list_bp = Blueprint("lists", __name__)


@list_bp.get("/")
@jwt_required()
def index():
    uid = int(get_jwt_identity())
    lists = (
        TaskList.query.filter_by(user_id=uid)
        .order_by(TaskList.position, TaskList.id)
        .all()
    )
    return jsonify([l.to_dict(with_counts=True) for l in lists])


@list_bp.post("/")
@jwt_required()
def create():
    uid = int(get_jwt_identity())
    data = request.get_json() or {}
    name = (data.get("name") or "").strip()
    if not name:
        return jsonify(error="A list name is required."), 400
    count = TaskList.query.filter_by(user_id=uid).count()
    lst = TaskList(
        user_id=uid,
        name=name,
        color=data.get("color") or "#2DD4BF",
        icon=data.get("icon") or "list",
        position=count,
    )
    db.session.add(lst)
    db.session.commit()
    return jsonify(lst.to_dict(with_counts=True)), 201


@list_bp.patch("/<int:list_id>")
@jwt_required()
def update(list_id):
    uid = int(get_jwt_identity())
    lst = TaskList.query.filter_by(id=list_id, user_id=uid).first()
    if not lst:
        return jsonify(error="List not found."), 404
    data = request.get_json() or {}
    if "name" in data and data["name"].strip():
        lst.name = data["name"].strip()
    if "color" in data:
        lst.color = data["color"]
    if "icon" in data:
        lst.icon = data["icon"]
    db.session.commit()
    return jsonify(lst.to_dict(with_counts=True))


@list_bp.delete("/<int:list_id>")
@jwt_required()
def delete(list_id):
    uid = int(get_jwt_identity())
    lst = TaskList.query.filter_by(id=list_id, user_id=uid).first()
    if not lst:
        return jsonify(error="List not found."), 404
    # Detach tasks (keep them, move to Inbox) then drop the list.
    Task.query.filter_by(list_id=list_id, user_id=uid).update({"list_id": None})
    db.session.delete(lst)
    db.session.commit()
    return jsonify(message="List deleted.")
