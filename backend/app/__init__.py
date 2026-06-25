"""Application factory for Lumo — the AI-powered to-do app."""
import mimetypes
import os
from flask import Flask, jsonify, send_from_directory, send_file
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

# Serve compiled assets with correct MIME types in production.
mimetypes.add_type("text/javascript", ".js")

db = SQLAlchemy()
jwt = JWTManager()

# Path to the compiled React app (built by Docker into /app/frontend_dist).
FRONTEND_DIST = os.path.join(os.path.dirname(__file__), "..", "frontend_dist")


def create_app(config_object="app.config.Config"):
    instance_path = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..", "instance")
    )
    os.makedirs(instance_path, exist_ok=True)

    app = Flask(
        __name__,
        static_folder=FRONTEND_DIST if os.path.isdir(FRONTEND_DIST) else None,
        instance_path=instance_path,
        instance_relative_config=True,
    )
    app.config.from_object(config_object)

    db.init_app(app)
    jwt.init_app(app)
    CORS(app, origins=os.getenv("CORS_ORIGINS", "*").split(","))

    # Register models so SQLAlchemy is aware of them.
    from app import models  # noqa: F401

    from app.routes.auth_routes import auth_bp
    from app.routes.list_routes import list_bp
    from app.routes.task_routes import task_bp
    from app.routes.ai_routes import ai_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(list_bp, url_prefix="/api/lists")
    app.register_blueprint(task_bp, url_prefix="/api/tasks")
    app.register_blueprint(ai_bp, url_prefix="/api/ai")

    @app.get("/api/health")
    def health():
        return jsonify(status="ok", service="lumo")

    @app.errorhandler(Exception)
    def handle_exception(e):
        import traceback
        from werkzeug.exceptions import HTTPException
        if isinstance(e, HTTPException):
            return jsonify(error=e.description), e.code
        app.logger.error(traceback.format_exc())
        return jsonify(error="An unexpected server error occurred."), 500

    # Serve the React SPA for all non-API routes (production only).
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
