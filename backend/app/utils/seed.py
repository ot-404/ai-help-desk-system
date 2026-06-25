"""Seed helpers: a demo account and starter content for new users."""
from datetime import date, timedelta
from app import db
from app.models.user_model import User
from app.models.list_model import TaskList
from app.models.task_model import Task

DEMO_EMAIL = "demo@lumo.app"
DEMO_PASSWORD = "demo123"


def create_starter_content(user):
    """Give a brand-new user a couple of lists and example tasks.

    Caller is responsible for committing the session.
    """
    today = date.today()
    work = TaskList(user_id=user.id, name="Work", color="#2DD4BF", icon="briefcase", position=0)
    personal = TaskList(user_id=user.id, name="Personal", color="#A78BFA", icon="user", position=1)
    db.session.add_all([work, personal])
    db.session.flush()

    samples = [
        ("Welcome to Lumo — click the circle to complete me", None, "high", today, False),
        ("Try the AI quick-add: type \"email Sam tomorrow 9am\"", None, "medium", today, False),
        ("Plan the Q3 launch", work.id, "high", today + timedelta(days=2), True),
        ("Review design mockups", work.id, "medium", today + timedelta(days=1), False),
        ("Book dentist appointment", personal.id, "low", None, False),
        ("Buy groceries for the week", personal.id, "none", today, False),
    ]
    parent_for_subtasks = None
    for i, (title, list_id, prio, due, mk_subs) in enumerate(samples):
        t = Task(user_id=user.id, title=title, list_id=list_id, priority=prio,
                 due_date=due, position=i)
        db.session.add(t)
        if mk_subs:
            db.session.flush()
            parent_for_subtasks = t

    if parent_for_subtasks:
        for j, s in enumerate(["Define scope", "Draft timeline", "Brief the team"]):
            db.session.add(Task(user_id=user.id, parent_id=parent_for_subtasks.id,
                                title=s, position=j))


def seed_demo_data():
    """Idempotent: create the demo user with starter content if absent."""
    if User.query.filter_by(email=DEMO_EMAIL).first():
        return
    user = User(name="Demo User", email=DEMO_EMAIL)
    user.set_password(DEMO_PASSWORD)
    db.session.add(user)
    db.session.flush()
    create_starter_content(user)
    db.session.commit()
