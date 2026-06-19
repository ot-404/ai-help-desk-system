"""Ticket business logic: routing, auto-answer, auto-tagging, originality check."""
import re
import threading
from flask import current_app
from app import db
from app.models.ticket_model import Ticket
from app.models.message_model import Message
from app.services.ai_service import generate_response, extract_post_tags, check_originality

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


def _words(text):
    return set(re.findall(r"[a-z0-9]+", (text or "").lower()))


def _gather_candidates(ticket, limit=5, min_overlap=4):
    """Most word-similar existing posts + KB articles, for the originality check."""
    from app.models.kb_model import KnowledgeBase
    new_words = _words(f"{ticket.subject} {ticket.description}")
    if not new_words:
        return []
    scored = []
    for t in Ticket.query.filter(Ticket.id != ticket.id).order_by(Ticket.created_at.desc()).limit(200).all():
        text = f"{t.subject} {t.description or ''}"
        overlap = len(new_words & _words(text))
        if overlap >= min_overlap:
            scored.append((overlap, f"post #{t.id}: {t.subject}", text))
    for a in KnowledgeBase.query.limit(200).all():
        text = f"{a.title} {a.content or ''}"
        overlap = len(new_words & _words(text))
        if overlap >= min_overlap:
            scored.append((overlap, f"KB: {a.title}", text))
    scored.sort(key=lambda x: x[0], reverse=True)
    return [{"ref": ref, "text": text} for _, ref, text in scored[:limit]]


def _review_worker(app, ticket_id):
    """Background: tag the post, then run the AI originality / credit check.

    The two steps are committed independently so a transient AI failure on one
    (e.g. a rate limit) never discards the other.
    """
    with app.app_context():
        ticket = Ticket.query.get(ticket_id)
        if not ticket:
            return

        # 1. Auto-tag (main focus).
        try:
            tags = extract_post_tags(ticket.subject, ticket.description, collect_existing_tags())
            if tags:
                ticket.tags = ",".join(tags)
                db.session.commit()
        except Exception:
            db.session.rollback()

        # 2. Originality + suggested credits.
        try:
            result = check_originality(ticket.subject, ticket.description, _gather_candidates(ticket))
            if result:
                ticket.flagged = bool(result.get("flagged"))
                ticket.flag_reason = (result.get("reason") or None) if result.get("flagged") else None
                creds = result.get("credits") or []
                ticket.credits = "\n".join(creds) if creds else None
                db.session.commit()
        except Exception:
            db.session.rollback()


def schedule_auto_tag(ticket):
    """Fire-and-forget AI tagging + originality check so post creation isn't blocked."""
    app = current_app._get_current_object()
    threading.Thread(
        target=_review_worker, args=(app, ticket.id), daemon=True
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
