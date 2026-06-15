"""Message endpoints: add ticket message, get conversation thread."""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app import db
from app.models.message_model import Message
from app.models.ticket_model import Ticket

message_bp = Blueprint("messages", __name__)


@message_bp.post("/ticket/<int:ticket_id>")
@jwt_required()
def add_message(ticket_id):
    claims = get_jwt()
    uid = int(get_jwt_identity())
    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return jsonify(error="ticket not found"), 404
    if claims.get("role") == "user" and ticket.user_id != uid:
        return jsonify(error="forbidden"), 403
    data = request.get_json() or {}
    if not data.get("message"):
        return jsonify(error="message is required"), 400
    msg = Message(
        ticket_id=ticket_id,
        sender_id=uid,
        message=data["message"],
        ai_generated=False,
    )
    db.session.add(msg)
    db.session.commit()
    return jsonify(msg.to_dict()), 201


@message_bp.get("/ticket/<int:ticket_id>")
@jwt_required()
def get_thread(ticket_id):
    claims = get_jwt()
    uid = int(get_jwt_identity())
    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return jsonify(error="ticket not found"), 404
    if claims.get("role") == "user" and ticket.user_id != uid:
        return jsonify(error="forbidden"), 403
    msgs = (
        Message.query.filter_by(ticket_id=ticket_id)
        .order_by(Message.created_at.asc())
        .all()
    )
    return jsonify([m.to_dict() for m in msgs])
