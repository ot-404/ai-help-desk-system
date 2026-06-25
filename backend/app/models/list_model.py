"""Lists (a.k.a. projects) that group tasks together."""
from datetime import datetime
from app import db


class TaskList(db.Model):
    __tablename__ = "lists"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    name = db.Column(db.String(120), nullable=False)
    color = db.Column(db.String(20), default="#2DD4BF")  # teal by default
    icon = db.Column(db.String(40), default="list")       # tabler icon name
    position = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    tasks = db.relationship("Task", backref="list", lazy=True)

    def to_dict(self, with_counts=False):
        data = {
            "id": self.id,
            "name": self.name,
            "color": self.color,
            "icon": self.icon,
            "position": self.position,
        }
        if with_counts:
            active = [t for t in self.tasks if not t.completed and t.parent_id is None]
            data["task_count"] = len(active)
        return data
