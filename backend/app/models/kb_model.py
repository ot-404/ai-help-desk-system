"""Knowledge Base table."""
from datetime import datetime
from app import db


class KnowledgeBase(db.Model):
    __tablename__ = "knowledge_base"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(100), default="")
    tags = db.Column(db.Text, default="")  # comma-separated
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "category": self.category or "",
            "tags": [t.strip() for t in (self.tags or "").split(",") if t.strip()],
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
