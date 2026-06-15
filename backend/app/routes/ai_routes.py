"""AI Assistant endpoints: answer, summarize, suggest resolution, ask-and-publish."""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app import db
from app.models.ticket_model import Ticket
from app.models.message_model import Message
from app.models.user_model import User
from app.models.kb_model import KnowledgeBase
from app.services import ai_service
from app.utils.auth_helpers import role_required

ai_bp = Blueprint("ai", __name__)


@ai_bp.post("/answer")
@jwt_required()
def answer():
    data = request.get_json() or {}
    question = data.get("question")
    if not question:
        return jsonify(error="question is required"), 400
    return jsonify(ai_service.generate_response(question, data.get("ticket_id")))


@ai_bp.post("/ask")
@jwt_required()
def ask_and_publish():
    """Ask a question → AI answers → saves KB article + blog post → returns all three."""
    data = request.get_json() or {}
    question = (data.get("question") or "").strip()
    if not question:
        return jsonify(error="question is required"), 400

    # 1. Generate AI answer (with RAG context from KB)
    result = ai_service.generate_response(question)
    answer = result["answer"]
    model = result["model"]

    # 2. Generate structured KB article from Q&A
    kb_data = ai_service.generate_kb_article(question, answer)
    kb_article = KnowledgeBase(
        title=kb_data["title"],
        content=kb_data["content"],
        category=kb_data.get("category", "FAQ"),
        tags=kb_data.get("tags", "ai-generated"),
    )
    db.session.add(kb_article)

    # 3. Generate blog post from Q&A
    blog_data = ai_service.generate_blog_post(question, answer)
    existing_tags = kb_data.get("tags", "")
    blog_tags = f"blog,ai-generated,{existing_tags}".strip(",")
    blog_article = KnowledgeBase(
        title=blog_data["title"],
        content=blog_data["content"],
        category="Blog",
        tags=blog_tags,
    )
    db.session.add(blog_article)
    db.session.flush()  # get IDs before commit

    db.session.commit()

    return jsonify(
        answer=answer,
        model=model,
        kb_article=kb_article.to_dict(),
        blog_post=blog_article.to_dict(),
    ), 201


@ai_bp.post("/summarize/<int:ticket_id>")
@role_required("agent", "admin")
def summarize(ticket_id):
    if not Ticket.query.get(ticket_id):
        return jsonify(error="ticket not found"), 404
    msgs = Message.query.filter_by(ticket_id=ticket_id).order_by(Message.created_at).all()
    payload = []
    for m in msgs:
        sender = "AI" if m.ai_generated else "Support"
        if m.sender_id and not m.ai_generated:
            u = User.query.get(m.sender_id)
            sender = u.name if u else sender
        payload.append({"sender": sender, "message": m.message})
    return jsonify(ai_service.summarize_conversation(payload))


@ai_bp.post("/suggest/<int:ticket_id>")
@role_required("agent", "admin")
def suggest(ticket_id):
    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return jsonify(error="ticket not found"), 404
    return jsonify(ai_service.suggest_resolution(ticket.subject, ticket.description))
