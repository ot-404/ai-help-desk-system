"""Audit log of AI calls (handy for debugging and analytics)."""
from datetime import datetime
from app import db


class AILog(db.Model):
    __tablename__ = "ai_logs"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True, index=True)
    action = db.Column(db.String(40))          # parse | breakdown | plan | chat
    prompt = db.Column(db.Text)
    response = db.Column(db.Text)
    model_used = db.Column(db.String(80))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
