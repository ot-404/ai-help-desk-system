"""Entry point for the AI Help Desk System."""
from app import create_app, db
from app.utils.seed import seed_demo_data
from app.utils.seed_kb import run_seed as seed_kb_articles

app = create_app()


@app.cli.command("seed")
def seed():
    """Populate the database with demo users, tickets and KB articles."""
    with app.app_context():
        seed_demo_data()
    print("Seeded demo data.")


@app.cli.command("seed-kb")
def seed_kb():
    """Populate the Knowledge Base with help articles (safe to re-run — skips duplicates)."""
    from app.models.kb_model import KnowledgeBase
    with app.app_context():
        added = seed_kb_articles(db, KnowledgeBase)
    print(f"KB seed complete — {added} new article(s) added.")


@app.cli.command("set-admin-email")
def set_admin_email():
    """Update the primary admin account email."""
    from app.models.user_model import User
    target = "ripp3r41@gmail.com"
    with app.app_context():
        admin = User.query.filter_by(role="admin").first()
        if admin and admin.email != target:
            admin.email = target
            db.session.commit()
            print(f"Admin email updated to {target}")
        else:
            print("Admin email already set or no admin found.")


# Auto-seed on first boot (safe — no-ops if data already exists)
with app.app_context():
    seed_demo_data()
    from app.models.kb_model import KnowledgeBase
    seed_kb_articles(db, KnowledgeBase)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
