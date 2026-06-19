"""Application configuration."""
import os
from datetime import timedelta

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-jwt-secret")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=12)
    _db_url = os.getenv(
        "DATABASE_URL", "sqlite:///" + os.path.join(BASE_DIR, "instance", "ai_hds.db")
    )
    # SQLAlchemy 2.x requires postgresql:// not postgres://
    if _db_url.startswith("postgres://"):
        _db_url = "postgresql://" + _db_url[len("postgres://"):]
    SQLALCHEMY_DATABASE_URI = _db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # LLM — Anthropic takes priority if key is set, then OpenAI, then mock
    ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
    ANTHROPIC_MODEL = os.getenv("ANTHROPIC_MODEL", "claude-haiku-4-5-20251001")
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    # Base URL for any OpenAI-compatible provider (Groq, OpenRouter, Together,
    # Mistral, etc.). Defaults to OpenAI itself. e.g. https://api.groq.com/openai/v1
    OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1").rstrip("/")

    # Where the frontend lives, used to build password-reset links.
    # Falls back to the request origin if unset.
    FRONTEND_URL = os.getenv("FRONTEND_URL", "").rstrip("/")

    # Email (SMTP) for password resets. If unset, reset links are returned in the
    # API response (dev/demo fallback) instead of being emailed.
    SMTP_HOST = os.getenv("SMTP_HOST", "")
    SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER = os.getenv("SMTP_USER", "")
    SMTP_PASS = os.getenv("SMTP_PASS", "")
    SMTP_FROM = os.getenv("SMTP_FROM", os.getenv("SMTP_USER", "no-reply@hdsystems.app"))
    SMTP_TLS = os.getenv("SMTP_TLS", "true").lower() != "false"
    PASSWORD_RESET_MAX_AGE = int(os.getenv("PASSWORD_RESET_MAX_AGE", "3600"))  # seconds
