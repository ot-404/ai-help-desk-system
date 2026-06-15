"""Smoke test: exercises the full ticket -> AI -> dashboard flow."""
from app import create_app, db
from app.utils.seed import seed_demo_data


def run():
    app = create_app()
    client = app.test_client()
    with app.app_context():
        db.drop_all(); db.create_all(); seed_demo_data()

    # login
    r = client.post("/api/auth/login", json={"email": "jane@example.com", "password": "user123"})
    assert r.status_code == 200, r.data
    token = r.get_json()["access_token"]
    h = {"Authorization": f"Bearer {token}"}

    # create ticket (auto-answers via AI/RAG)
    r = client.post("/api/tickets/", headers=h,
                    json={"subject": "How do I get a refund?",
                          "description": "I want my money back for last order."})
    assert r.status_code == 201, r.data
    body = r.get_json()
    assert body["ai"] is not None
    print("AI answer:", body["ai"]["answer"][:80])

    # KB search
    r = client.get("/api/kb/search?q=refund")
    assert r.status_code == 200 and r.get_json()["results"], r.data

    # dashboard stats
    r = client.get("/api/dashboard/stats")
    assert r.status_code == 200, r.data
    print("stats:", r.get_json())

    print("ALL SMOKE TESTS PASSED")


if __name__ == "__main__":
    run()
