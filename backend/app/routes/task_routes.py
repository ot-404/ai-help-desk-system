"""Task CRUD, completion, subtasks, reordering and view filters."""
from datetime import date, datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.task_model import Task, PRIORITIES
from app.models.list_model import TaskList

task_bp = Blueprint("tasks", __name__)

_PRIORITY_RANK = {"high": 0, "medium": 1, "low": 2, "none": 3}


def _parse_date(value):
    """Accept 'YYYY-MM-DD' (or ISO datetime) and return a date, or None."""
    if not value:
        return None
    try:
        return date.fromisoformat(str(value)[:10])
    except ValueError:
        return None


def _owned(task_id, uid):
    return Task.query.filter_by(id=task_id, user_id=uid).first()


def _sort_key(t):
    return (
        t.due_date or date.max,
        _PRIORITY_RANK.get(t.priority, 3),
        t.position,
        t.id,
    )


def _apply_payload(task, data):
    if "title" in data and data["title"].strip():
        task.title = data["title"].strip()
    if "notes" in data:
        task.notes = data["notes"] or ""
    if "priority" in data and data["priority"] in PRIORITIES:
        task.priority = data["priority"]
    if "due_date" in data:
        task.due_date = _parse_date(data["due_date"])
    if "list_id" in data:
        lid = data["list_id"]
        if lid:
            owns = TaskList.query.filter_by(id=lid, user_id=task.user_id).first()
            task.list_id = lid if owns else None
        else:
            task.list_id = None


@task_bp.get("/")
@jwt_required()
def index():
    uid = int(get_jwt_identity())
    view = request.args.get("view", "all")
    list_id = request.args.get("list_id", type=int)
    today = date.today()

    q = Task.query.filter_by(user_id=uid, parent_id=None)

    if list_id is not None:
        q = q.filter_by(list_id=list_id)

    if view == "completed":
        q = q.filter_by(completed=True)
    else:
        q = q.filter_by(completed=False)
        if view == "today":
            q = q.filter(Task.due_date != None, Task.due_date <= today)  # noqa: E711
        elif view == "upcoming":
            q = q.filter(Task.due_date != None, Task.due_date > today)  # noqa: E711
        elif view == "inbox":
            q = q.filter(Task.list_id == None)  # noqa: E711

    tasks = sorted(q.all(), key=_sort_key)
    if view == "completed":
        tasks = sorted(q.all(), key=lambda t: t.completed_at or datetime.min, reverse=True)
    return jsonify([t.to_dict() for t in tasks])


@task_bp.get("/counts")
@jwt_required()
def counts():
    uid = int(get_jwt_identity())
    today = date.today()
    base = Task.query.filter_by(user_id=uid, parent_id=None, completed=False)
    return jsonify(
        today=base.filter(Task.due_date != None, Task.due_date <= today).count(),  # noqa: E711
        upcoming=base.filter(Task.due_date != None, Task.due_date > today).count(),  # noqa: E711
        all=base.count(),
        inbox=base.filter(Task.list_id == None).count(),  # noqa: E711
    )


@task_bp.post("/")
@jwt_required()
def create():
    uid = int(get_jwt_identity())
    data = request.get_json() or {}
    title = (data.get("title") or "").strip()
    if not title:
        return jsonify(error="A task title is required."), 400

    parent_id = data.get("parent_id")
    if parent_id and not _owned(parent_id, uid):
        return jsonify(error="Parent task not found."), 404

    count = Task.query.filter_by(user_id=uid, parent_id=parent_id).count()
    task = Task(
        user_id=uid,
        title=title,
        parent_id=parent_id,
        position=count,
        ai_created=bool(data.get("ai_created")),
    )
    _apply_payload(task, data)
    db.session.add(task)
    db.session.commit()
    return jsonify(task.to_dict()), 201


@task_bp.get("/<int:task_id>")
@jwt_required()
def show(task_id):
    uid = int(get_jwt_identity())
    task = _owned(task_id, uid)
    if not task:
        return jsonify(error="Task not found."), 404
    return jsonify(task.to_dict())


@task_bp.patch("/<int:task_id>")
@jwt_required()
def update(task_id):
    uid = int(get_jwt_identity())
    task = _owned(task_id, uid)
    if not task:
        return jsonify(error="Task not found."), 404
    _apply_payload(task, request.get_json() or {})
    db.session.commit()
    return jsonify(task.to_dict())


@task_bp.post("/<int:task_id>/toggle")
@jwt_required()
def toggle(task_id):
    uid = int(get_jwt_identity())
    task = _owned(task_id, uid)
    if not task:
        return jsonify(error="Task not found."), 404
    task.completed = not task.completed
    task.completed_at = datetime.utcnow() if task.completed else None
    # Completing a parent completes its subtasks too.
    if task.parent_id is None:
        for sub in task.subtasks:
            sub.completed = task.completed
            sub.completed_at = task.completed_at
    db.session.commit()
    return jsonify(task.to_dict())


@task_bp.delete("/<int:task_id>")
@jwt_required()
def delete(task_id):
    uid = int(get_jwt_identity())
    task = _owned(task_id, uid)
    if not task:
        return jsonify(error="Task not found."), 404
    db.session.delete(task)
    db.session.commit()
    return jsonify(message="Task deleted.")


@task_bp.post("/reorder")
@jwt_required()
def reorder():
    uid = int(get_jwt_identity())
    data = request.get_json() or {}
    ids = data.get("ids") or []
    for pos, tid in enumerate(ids):
        Task.query.filter_by(id=tid, user_id=uid).update({"position": pos})
    db.session.commit()
    return jsonify(message="Reordered.")
