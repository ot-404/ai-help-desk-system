"""Ticket business logic: routing, auto-answer vs. escalation, auto-tagging."""
import threading
from flask import current_app
from app import db
from app.models.ticket_model import Ticket
from app.models.message_model import Message
from app.services.ai_service import generate_response, extract_post_tags

# If retrieval finds context the bot answers; otherwise escalate to a human.
CONFIDENCE_MIN_CONTEXT = 1

# Seed tags so the matcher has a vocabulary to reuse before the site has data.
SEED_TAGS = [
    "javascript", "python", "typescript", "react", "node", "devops", "docker",
    "kubernetes", "security", "networking", "databases", "sql", "linux", "cloud",
    "aws", "api", "git", "ci-cd", "system-design", "machine-learning", "career",
    "performance", "authentication", "password-reset", "billing", "account",
]


def collect_existing_tags():
    """Union of seed tags and every tag already used on a ticket."""
    tags = set(SEED_TAGS)
    rows = db.session.query(Ticket.tags).filter(Ticket.tags.isnot(None)).all()
    for (raw,) in rows:
        for t in (raw or "").split(","):
            t = t.strip().lower()
            if t:
                tags.add(t)
    return tags


def _auto_tag_worker(app, ticket_id):
    """Background: ask the AI for the post's main focus, save tags on the ticket."""
    with app.app_context():
        try:
            ticket = Ticket.query.get(ticket_id)
            if not ticket:
                return
            tags = extract_post_tags(ticket.subject, ticket.description, collect_existing_tags())
            if tags:
                ticket.tags = ",".join(tags)
                db.session.commit()
        except Exception:
            db.session.rollback()


def schedule_auto_tag(ticket):
    """Fire-and-forget the AI tagging so post creation isn't blocked."""
    app = current_app._get_current_object()
    threading.Thread(
        target=_auto_tag_worker, args=(app, ticket.id), daemon=True
    ).start()


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
