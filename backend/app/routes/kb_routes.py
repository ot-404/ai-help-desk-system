"""Knowledge Base endpoints: list/retrieve, add, update."""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models.kb_model import KnowledgeBase
from app.services.rag_service import retrieve_context
from app.utils.auth_helpers import role_required

kb_bp = Blueprint("kb", __name__)


@kb_bp.get("/")
def list_articles():
    return jsonify([a.to_dict() for a in KnowledgeBase.query.all()])


@kb_bp.get("/search")
def search():
    q = request.args.get("q", "")
    return jsonify(results=retrieve_context(q, top_k=int(request.args.get("k", 4))))


@kb_bp.get("/<int:kb_id>")
def get_article(kb_id):
    a = KnowledgeBase.query.get(kb_id)
    if not a:
        return jsonify(error="not found"), 404
    return jsonify(a.to_dict())


@kb_bp.post("/")
@role_required("agent", "admin")
def add_article():
    data = request.get_json() or {}
    if not data.get("title") or not data.get("content"):
        return jsonify(error="title and content are required"), 400
    tags = data.get("tags", "")
    if isinstance(tags, list):
        tags = ",".join(tags)
    article = KnowledgeBase(title=data["title"], content=data["content"], tags=tags)
    db.session.add(article)
    db.session.commit()
    return jsonify(article.to_dict()), 201


@kb_bp.put("/<int:kb_id>")
@role_required("agent", "admin")
def update_article(kb_id):
    a = KnowledgeBase.query.get(kb_id)
    if not a:
        return jsonify(error="not found"), 404
    data = request.get_json() or {}
    if "title" in data:
        a.title = data["title"]
    if "content" in data:
        a.content = data["content"]
    if "tags" in data:
        a.tags = ",".join(data["tags"]) if isinstance(data["tags"], list) else data["tags"]
    db.session.commit()
    return jsonify(a.to_dict())
