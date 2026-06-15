"""Seed demo data from seed_data.json (or built-in defaults)."""
import json, os
from app import db
from app.models.user_model import User
from app.models.ticket_model import Ticket
from app.models.message_model import Message
from app.models.kb_model import KnowledgeBase

# Look for seed_data.json one level above the backend folder
_HERE = os.path.dirname(__file__)
_SEED_FILE = os.path.join(_HERE, "..", "..", "..", "seed_data.json")


def _load_config():
    path = os.path.abspath(_SEED_FILE)
    if os.path.isfile(path):
        with open(path) as f:
            return json.load(f)
    return None


def seed_demo_data():
    if User.query.first():
        return  # already seeded

    cfg = _load_config() or {}

    # ── Users ──────────────────────────────────────────────────────────────
    user_map = {}
    for u in cfg.get("users", [
        {"name": "Admin",       "email": "admin@example.com", "password": "admin123", "role": "admin"},
        {"name": "Agent Smith", "email": "agent@example.com", "password": "agent123", "role": "agent"},
        {"name": "Jane Doe",    "email": "jane@example.com",  "password": "user123",  "role": "user"},
    ]):
        obj = User(name=u["name"], email=u["email"], role=u.get("role", "user"))
        obj.set_password(u["password"])
        db.session.add(obj)
        db.session.flush()
        user_map[u["email"]] = obj

    # ── Knowledge Base ─────────────────────────────────────────────────────
    for art in cfg.get("knowledge_base", []):
        db.session.add(KnowledgeBase(
            title=art["title"],
            content=art["content"],
            category=art.get("category", ""),
            tags=art.get("tags", ""),
        ))

    # ── Sample Tickets ─────────────────────────────────────────────────────
    admin_user = next((u for u in user_map.values() if u.role == "user"), None)
    for td in cfg.get("sample_tickets", []):
        owner = user_map.get(td.get("user_email", ""), admin_user)
        if not owner:
            continue
        t = Ticket(
            user_id=owner.id,
            subject=td["subject"],
            description=td["description"],
            priority=td.get("priority", "medium"),
            status=td.get("status", "open"),
        )
        db.session.add(t)
        db.session.flush()
        if td.get("message"):
            db.session.add(Message(ticket_id=t.id, sender_id=owner.id, message=td["message"]))

    db.session.commit()
    print("Seeded from", "seed_data.json" if _load_config() else "built-in defaults")
