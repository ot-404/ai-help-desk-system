"""Ticket endpoints: create, list, get, update, delete, rate."""
from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app import db
from app.models.ticket_model import Ticket, PRIORITIES, STATUSES
from app.services import ticket_service
from app.utils.auth_helpers import role_required

ticket_bp = Blueprint("tickets", __name__)


@ticket_bp.post("/")
@jwt_required()
def create():
    data = request.get_json() or {}
    if not data.get("subject") or not data.get("description"):
        return jsonify(error="subject and description are required"), 400
    priority = data.get("priority", "medium")
    if priority not in PRIORITIES:
        return jsonify(error=f"priority must be one of {PRIORITIES}"), 400
    ticket = ticket_service.create_ticket(
        int(get_jwt_identity()), data["subject"], data["description"], priority
    )
    result = None
    if data.get("auto_answer", True):
        result = ticket_service.auto_handle(ticket)
    return jsonify(ticket=ticket.to_dict(), ai=result), 201


@ticket_bp.get("/")
@jwt_required()
def list_tickets():
    claims = get_jwt()
    uid = int(get_jwt_identity())
    query = Ticket.query
    if claims.get("role") == "user":
        query = query.filter_by(user_id=uid)
    status = request.args.get("status")
    if status:
        query = query.filter_by(status=status)
    return jsonify([t.to_dict() for t in query.order_by(Ticket.created_at.desc()).all()])


@ticket_bp.get("/<int:ticket_id>")
@jwt_required()
def get_ticket(ticket_id):
    claims = get_jwt()
    uid = int(get_jwt_identity())
    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return jsonify(error="not found"), 404
    if claims.get("role") == "user" and ticket.user_id != uid:
        return jsonify(error="forbidden"), 403
    return jsonify(ticket.to_dict())


@ticket_bp.put("/<int:ticket_id>")
@jwt_required()
def update_ticket(ticket_id):
    claims = get_jwt()
    uid = int(get_jwt_identity())
    role = claims.get("role")

    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return jsonify(error="not found"), 404

    if role == "user" and ticket.user_id != uid:
        return jsonify(error="forbidden"), 403

    data = request.get_json() or {}

    if role == "user":
        # Users can only edit their ticket's subject/description, not status or priority
        for field in ("subject", "description"):
            if field in data:
                setattr(ticket, field, data[field])
    else:
        new_status = data.get("status")
        if new_status and new_status not in STATUSES:
            return jsonify(error=f"status must be one of {STATUSES}"), 400
        for field in ("subject", "description", "priority", "status", "assigned_to"):
            if field in data:
                setattr(ticket, field, data[field])
        if new_status in ("resolved", "closed") and not ticket.resolved_at:
            ticket.resolved_at = datetime.utcnow()
        elif new_status in ("open", "pending"):
            ticket.resolved_at = None

    db.session.commit()
    return jsonify(ticket.to_dict())


@ticket_bp.post("/<int:ticket_id>/rate")
@jwt_required()
def rate_ticket(ticket_id):
    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return jsonify(error="not found"), 404
    uid = int(get_jwt_identity())
    if ticket.user_id != uid:
        return jsonify(error="only the ticket owner can rate"), 403
    data = request.get_json() or {}
    rating = data.get("rating")
    if not isinstance(rating, int) or rating < 1 or rating > 5:
        return jsonify(error="rating must be an integer 1-5"), 400
    ticket.csat_rating = rating
    db.session.commit()
    return jsonify(ticket.to_dict())


@ticket_bp.delete("/<int:ticket_id>")
@role_required("agent", "admin")
def delete_ticket(ticket_id):
    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return jsonify(error="not found"), 404
    db.session.delete(ticket)
    db.session.commit()
    return jsonify(message="deleted")
