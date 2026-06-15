"""AI Assistant endpoints: answer, summarize, suggest resolution."""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.models.ticket_model import Ticket
from app.models.message_model import Message
from app.models.user_model import User
from app.services import ai_service

ai_bp = Blueprint("ai", __name__)


@ai_bp.post("/answer")
@jwt_required()
def answer():
    data = request.get_json() or {}
    question = data.get("question")
    if not question:
        return jsonify(error="question is required"), 400
    return jsonify(ai_service.generate_response(question, data.get("ticket_id")))


@ai_bp.post("/summarize/<int:ticket_id>")
@jwt_required()
def summarize(ticket_id):
    if not Ticket.query.get(ticket_id):
        return jsonify(error="ticket not found"), 404
    msgs = Message.query.filter_by(ticket_id=ticket_id).order_by(Message.created_at).all()
    payload = []
    for m in msgs:
        sender = "AI" if m.ai_generated else "User"
        if m.sender_id:
            u = User.query.get(m.sender_id)
            sender = u.name if u else sender
        payload.append({"sender": sender, "message": m.message})
    return jsonify(ai_service.summarize_conversation(payload))


@ai_bp.post("/suggest/<int:ticket_id>")
@jwt_required()
def suggest(ticket_id):
    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return jsonify(error="ticket not found"), 404
    return jsonify(ai_service.suggest_resolution(ticket.subject, ticket.description))
