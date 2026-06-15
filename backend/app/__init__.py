"""Application factory for the AI Help Desk System."""
import os
from flask import Flask, jsonify, send_from_directory, send_file
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()
jwt = JWTManager()

# Path to the compiled React app (built by Docker into /app/frontend_dist)
FRONTEND_DIST = os.path.join(os.path.dirname(__file__), "..", "frontend_dist")


def create_app(config_object="app.config.Config"):
    app = Flask(
        __name__,
        static_folder=FRONTEND_DIST if os.path.isdir(FRONTEND_DIST) else None,
        instance_relative_config=True,
    )
    app.config.from_object(config_object)

    os.makedirs(app.instance_path, exist_ok=True)

    db.init_app(app)
    jwt.init_app(app)
    CORS(app, origins=os.getenv("CORS_ORIGINS", "*").split(","))

    # Register models so SQLAlchemy is aware of them
    from app import models  # noqa: F401

    # Blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.user_routes import user_bp
    from app.routes.ticket_routes import ticket_bp
    from app.routes.message_routes import message_bp
    from app.routes.ai_routes import ai_bp
    from app.routes.kb_routes import kb_bp
    from app.routes.dashboard_routes import dashboard_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(user_bp, url_prefix="/api/users")
    app.register_blueprint(ticket_bp, url_prefix="/api/tickets")
    app.register_blueprint(message_bp, url_prefix="/api/messages")
    app.register_blueprint(ai_bp, url_prefix="/api/ai")
    app.register_blueprint(kb_bp, url_prefix="/api/kb")
    app.register_blueprint(dashboard_bp)

    @app.get("/api/health")
    def health():
        return jsonify(status="ok", service="ai-help-desk")

    # Serve React SPA for all non-API routes (production only)
    if os.path.isdir(FRONTEND_DIST):
        @app.route("/", defaults={"path": ""})
        @app.route("/<path:path>")
        def serve_frontend(path):
            file_path = os.path.join(FRONTEND_DIST, path)
            if path and os.path.isfile(file_path):
                return send_from_directory(FRONTEND_DIST, path)
            return send_file(os.path.join(FRONTEND_DIST, "index.html"))

    with app.app_context():
        db.create_all()

    return app
