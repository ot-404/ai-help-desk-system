"""Seed demo data so the app is useful immediately."""
from app import db
from app.models.user_model import User
from app.models.ticket_model import Ticket
from app.models.message_model import Message
from app.models.kb_model import KnowledgeBase


def seed_demo_data():
    if User.query.first():
        return  # already seeded

    admin = User(name="Admin", email="admin@example.com", role="admin")
    admin.set_password("admin123")
    agent = User(name="Agent Smith", email="agent@example.com", role="agent")
    agent.set_password("agent123")
    user = User(name="Jane Doe", email="jane@example.com", role="user")
    user.set_password("user123")
    db.session.add_all([admin, agent, user])
    db.session.commit()

    kb_articles = [
        ("Reset your password",
         "To reset your password, go to Settings > Security and click 'Reset password'. "
         "You will receive an email with a reset link valid for 30 minutes.",
         "password,login,account"),
        ("Request a refund",
         "Refunds can be requested within 30 days of purchase from Billing > Orders. "
         "Refunds are processed to the original payment method within 5-7 business days.",
         "billing,refund,payments"),
        ("Update billing information",
         "Update your card or billing address under Billing > Payment Methods. "
         "Changes apply to your next invoice.",
         "billing,card,invoice"),
        ("Two-factor authentication",
         "Enable 2FA in Settings > Security. We support authenticator apps and SMS codes.",
         "security,2fa,login"),
    ]
    for title, content, tags in kb_articles:
        db.session.add(KnowledgeBase(title=title, content=content, tags=tags))

    t = Ticket(
        user_id=user.id,
        subject="Can't log in after password reset",
        description="I reset my password but the new one is not accepted.",
        priority="high",
        status="open",
    )
    db.session.add(t)
    db.session.commit()
    db.session.add(
        Message(ticket_id=t.id, sender_id=user.id, message="Please help, I'm locked out.")
    )
    db.session.commit()
