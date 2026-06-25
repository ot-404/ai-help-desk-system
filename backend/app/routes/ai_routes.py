"""AI endpoints: natural-language quick-add, subtask breakdown, plan-my-day, chat."""
from datetime import date
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.task_model import Task, PRIORITIES
from app.models.list_model import TaskList
from app.models.ai_logs_model import AILog
from app.services import ai_service

ai_bp = Blueprint("ai", __name__)


def _log(uid, action, prompt, response, model):
    try:
        db.session.add(AILog(user_id=uid, action=action, prompt=str(prompt)[:4000],
                             response=str(response)[:4000], model_used=model))
    except Exception:  # noqa: BLE001
        pass


def _to_date(value):
    try:
        return date.fromisoformat(str(value)[:10]) if value else None
    except ValueError:
        return None


@ai_bp.post("/quick-add")
@jwt_required()
def quick_add():
    uid = int(get_jwt_identity())
    data = request.get_json() or {}
    text = (data.get("text") or "").strip()
    if not text:
        return jsonify(error="Type what you need to do."), 400

    parsed, model = ai_service.parse_task(text)
    _log(uid, "parse", text, parsed, model)

    list_id = data.get("list_id")
    if list_id and not TaskList.query.filter_by(id=list_id, user_id=uid).first():
        list_id = None

    priority = parsed.get("priority")
    if priority not in PRIORITIES:
        priority = "none"

    count = Task.query.filter_by(user_id=uid, parent_id=None).count()
    task = Task(
        user_id=uid,
        title=parsed["title"][:400],
        notes=parsed.get("notes") or "",
        priority=priority,
        due_date=_to_date(parsed.get("due_date")),
        list_id=list_id,
        position=count,
        ai_created=True,
    )
    db.session.add(task)
    db.session.flush()

    for i, sub in enumerate(parsed.get("subtasks") or []):
        db.session.add(Task(user_id=uid, parent_id=task.id, title=str(sub)[:400],
                            position=i, ai_created=True))

    db.session.commit()
    return jsonify(task=task.to_dict(), model=model), 201


@ai_bp.post("/breakdown")
@jwt_required()
def breakdown():
    uid = int(get_jwt_identity())
    data = request.get_json() or {}
    task_id = data.get("task_id")
    task = Task.query.filter_by(id=task_id, user_id=uid).first()
    if not task:
        return jsonify(error="Task not found."), 404

    result, model = ai_service.breakdown_task(task.title, task.notes or "")
    _log(uid, "breakdown", task.title, result, model)

    start = Task.query.filter_by(user_id=uid, parent_id=task.id).count()
    created = []
    for i, sub in enumerate(result.get("subtasks") or []):
        st = Task(user_id=uid, parent_id=task.id, title=str(sub)[:400],
                  position=start + i, ai_created=True)
        db.session.add(st)
        created.append(st)
    db.session.commit()
    return jsonify(task=task.to_dict(), added=len(created), model=model)


@ai_bp.post("/plan")
@jwt_required()
def plan():
    uid = int(get_jwt_identity())
    today = date.today()
    tasks = (
        Task.query.filter(
            Task.user_id == uid, Task.parent_id == None,  # noqa: E711
            Task.completed == False,                       # noqa: E712
            Task.due_date != None, Task.due_date <= today,  # noqa: E711
        ).all()
    )
    payload = [t.to_dict(with_subtasks=False) for t in tasks]
    result, model = ai_service.plan_day(payload)
    _log(uid, "plan", f"{len(payload)} tasks", result.get("message"), model)

    by_id = {t["id"]: t for t in payload}
    ordered = [by_id[i] for i in result.get("order", []) if i in by_id]
    for t in payload:  # append anything the model skipped
        if t not in ordered:
            ordered.append(t)
    return jsonify(message=result["message"], items=ordered, model=model)


@ai_bp.post("/chat")
@jwt_required()
def chat():
    uid = int(get_jwt_identity())
    data = request.get_json() or {}
    messages = data.get("messages") or []
    clean = [
        {"role": "assistant" if m.get("role") == "assistant" else "user",
         "content": str(m.get("content", ""))[:2000]}
        for m in messages if m.get("content")
    ][-12:]
    if not clean:
        return jsonify(error="Say something to the assistant."), 400

    tasks = [t.to_dict(with_subtasks=False)
             for t in Task.query.filter_by(user_id=uid, parent_id=None).all()]
    result, model = ai_service.chat(clean, tasks)
    _log(uid, "chat", clean[-1]["content"], result.get("reply"), model)
    return jsonify(reply=result["reply"], model=model)
