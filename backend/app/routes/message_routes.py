"""Message endpoints: add ticket message, get conversation thread."""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app import db
from app.models.message_model import Message
from app.models.ticket_model import Ticket

message_bp = Blueprint("messages", __name__)


def _serialize_message(msg, viewer_role, viewer_id):
    """Serialize a message, hiding sender identity from non-admin/agent viewers."""
    is_ai = msg.ai_generated
    is_own = msg.sender_id == viewer_id

    if viewer_role in ("admin", "agent"):
        # Full info: real email + real role label
        sender_display = msg.sender.email if msg.sender else None
        sender_label = "ai" if is_ai else (msg.sender.role if msg.sender else "unknown")
    else:
        # Users see their own email, but agents/admins appear as "Support Team"
        if is_ai:
            sender_display = None
            sender_label = "ai"
        elif is_own:
            sender_display = msg.sender.email if msg.sender else None
            sender_label = "user"
        else:
            sender_display = None
            sender_label = "support"

    return {
        "id": msg.id,
        "ticket_id": msg.ticket_id,
        "sender_id": msg.sender_id,
        "sender_email": sender_display,
        "sender_role": sender_label,
        "message": msg.message,
        "ai_generated": is_ai,
        "created_at": msg.created_at.isoformat() if msg.created_at else None,
    }


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
    return jsonify(_serialize_message(msg, claims.get("role"), uid)), 201


@message_bp.get("/ticket/<int:ticket_id>")
@jwt_required()
def get_thread(ticket_id):
    claims = get_jwt()
    uid = int(get_jwt_identity())
    role = claims.get("role")
    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return jsonify(error="ticket not found"), 404
    if role == "user" and ticket.user_id != uid:
        return jsonify(error="forbidden"), 403
    msgs = (
        Message.query.filter_by(ticket_id=ticket_id)
        .order_by(Message.created_at.asc())
        .all()
    )
    return jsonify([_serialize_message(m, role, uid) for m in msgs])
