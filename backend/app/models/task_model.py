"""Task model — supports priority, due dates, lists and nested subtasks."""
from datetime import datetime
from app import db

PRIORITIES = ("none", "low", "medium", "high")


class Task(db.Model):
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    list_id = db.Column(db.Integer, db.ForeignKey("lists.id"), nullable=True, index=True)
    parent_id = db.Column(db.Integer, db.ForeignKey("tasks.id"), nullable=True, index=True)

    title = db.Column(db.String(400), nullable=False)
    notes = db.Column(db.Text, default="")
    priority = db.Column(db.String(10), default="none")
    completed = db.Column(db.Boolean, default=False, nullable=False)
    due_date = db.Column(db.Date, nullable=True)
    position = db.Column(db.Integer, default=0)
    ai_created = db.Column(db.Boolean, default=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)

    subtasks = db.relationship(
        "Task",
        backref=db.backref("parent", remote_side=[id]),
        lazy=True,
        cascade="all, delete-orphan",
        single_parent=True,
    )

    def to_dict(self, with_subtasks=True):
        data = {
            "id": self.id,
            "list_id": self.list_id,
            "parent_id": self.parent_id,
            "title": self.title,
            "notes": self.notes or "",
            "priority": self.priority or "none",
            "completed": self.completed,
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "position": self.position,
            "ai_created": self.ai_created,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
        }
        if with_subtasks:
            subs = sorted(self.subtasks, key=lambda s: (s.position, s.id))
            data["subtasks"] = [s.to_dict(with_subtasks=False) for s in subs]
        return data
