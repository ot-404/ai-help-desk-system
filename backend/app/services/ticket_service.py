"""Ticket business logic: routing, auto-answer vs. escalation."""
from app import db
from app.models.ticket_model import Ticket
from app.models.message_model import Message
from app.services.ai_service import generate_response

# If retrieval finds context the bot answers; otherwise escalate to a human.
CONFIDENCE_MIN_CONTEXT = 1


def create_ticket(user_id, subject, description, priority="medium", is_anonymous=False):
    ticket = Ticket(
        user_id=user_id, subject=subject, description=description, priority=priority,
        is_anonymous=is_anonymous,
    )
    db.session.add(ticket)
    db.session.commit()
    return ticket


def auto_handle(ticket):
    """Try to answer from the KB; escalate if no confident context."""
    result = generate_response(
        f"{ticket.subject}. {ticket.description}", ticket_id=ticket.id
    )
    has_context = len(result["context_used"]) >= CONFIDENCE_MIN_CONTEXT

    msg = Message(
        ticket_id=ticket.id,
        sender_id=None,
        message=result["answer"],
        ai_generated=True,
    )
    db.session.add(msg)

    if has_context:
        ticket.status = "pending"  # answered, awaiting user confirmation
    else:
        ticket.status = "open"
        ticket.priority = "high"  # escalate
    db.session.commit()
    return {"escalated": not has_context, "answer": result["answer"]}
