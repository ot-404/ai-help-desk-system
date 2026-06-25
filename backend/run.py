"""Entry point for Lumo — the AI to-do app."""
from app import create_app, db
from app.utils.seed import seed_demo_data

app = create_app()


@app.cli.command("seed")
def seed():
    """Create the demo account with starter lists and tasks."""
    with app.app_context():
        seed_demo_data()
    print("Seeded demo data (demo@lumo.app / demo123).")


# Auto-seed the demo account on first boot (no-op if it already exists).
with app.app_context():
    seed_demo_data()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
