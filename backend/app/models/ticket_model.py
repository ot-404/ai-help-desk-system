"""Tickets table."""
from datetime import datetime
from app import db

PRIORITIES = ("low", "medium", "high", "urgent")
STATUSES = ("open", "pending", "resolved", "closed")


class Ticket(db.Model):
    __tablename__ = "tickets"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    subject = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    priority = db.Column(db.String(20), default="medium")
    status = db.Column(db.String(20), default="open")
    assigned_to = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    csat_rating = db.Column(db.Integer, nullable=True)  # 1-5 star rating by user
    resolved_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    messages = db.relationship(
        "Message", backref="ticket", lazy=True, cascade="all, delete-orphan"
    )

    def to_dict(self):
        from app.models.user_model import User
        owner = User.query.get(self.user_id)
        return {
            "id": self.id,
            "user_id": self.user_id,
            "user_name": owner.name if owner else None,
            "user_email": owner.email if owner else None,
            "subject": self.subject,
            "description": self.description,
            "priority": self.priority,
            "status": self.status,
            "assigned_to": self.assigned_to,
            "csat_rating": self.csat_rating,
            "message_count": len(self.messages),
            "answer_count": len(self.messages),
            "resolved_at": self.resolved_at.isoformat() if self.resolved_at else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
