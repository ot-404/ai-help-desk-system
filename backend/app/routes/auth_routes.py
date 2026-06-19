"""Auth endpoints: register, login, logout, password reset."""
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from app import db
from app.models.user_model import User
from app.utils.email_util import send_email, smtp_configured

auth_bp = Blueprint("auth", __name__)

_RESET_SALT = "password-reset"


def _serializer():
    return URLSafeTimedSerializer(current_app.config["SECRET_KEY"])


def _make_reset_token(user):
    # Bind to a slice of the password hash so the token dies once the password changes.
    return _serializer().dumps(
        {"uid": user.id, "pw": user.password_hash[-12:]}, salt=_RESET_SALT
    )


def _verify_reset_token(token):
    max_age = current_app.config.get("PASSWORD_RESET_MAX_AGE", 3600)
    try:
        data = _serializer().loads(token, salt=_RESET_SALT, max_age=max_age)
    except (BadSignature, SignatureExpired):
        return None
    user = User.query.get(data.get("uid"))
    if not user or data.get("pw") != user.password_hash[-12:]:
        return None
    return user


def _reset_base_url():
    configured = current_app.config.get("FRONTEND_URL")
    if configured:
        return configured
    # Same-origin deploy (HF Space): derive from the incoming request.
    return request.host_url.rstrip("/")


@auth_bp.post("/register")
def register():
    data = request.get_json() or {}
    if not all(data.get(k) for k in ("name", "email", "password")):
        return jsonify(error="name, email and password are required"), 400
    if User.query.filter_by(email=data["email"]).first():
        return jsonify(error="email already registered"), 409
    user = User(name=data["name"], email=data["email"], role="user")
    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201


@auth_bp.post("/login")
def login():
    data = request.get_json() or {}
    user = User.query.filter_by(email=data.get("email")).first()
    if not user or not user.check_password(data.get("password", "")):
        return jsonify(error="invalid credentials"), 401
    token = create_access_token(
        identity=str(user.id), additional_claims={"role": user.role}
    )
    return jsonify(access_token=token, user=user.to_dict())


@auth_bp.post("/forgot-password")
def forgot_password():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    user = User.query.filter(db.func.lower(User.email) == email).first() if email else None

    resp = {"message": "If an account exists for that email, a reset link has been sent."}

    if user:
        token = _make_reset_token(user)
        link = f"{_reset_base_url()}/reset-password?token={token}"
        body = (
            f"Hi {user.name},\n\n"
            "We received a request to reset your HD Systems password.\n"
            f"Click the link below to choose a new password (valid for 1 hour):\n\n{link}\n\n"
            "If you didn't request this, you can safely ignore this email."
        )
        sent = send_email(user.email, "Reset your HD Systems password", body)
        current_app.logger.info("Password reset link for %s: %s", user.email, link)
        # Dev/demo fallback: if email isn't configured, return the link so the
        # flow is usable. Once SMTP is set, the link is emailed and never exposed.
        if not sent and not smtp_configured():
            resp["dev_reset_link"] = link

    return jsonify(resp)


@auth_bp.post("/reset-password")
def reset_password():
    data = request.get_json() or {}
    token = data.get("token", "")
    password = data.get("password", "")
    if len(password) < 6:
        return jsonify(error="Password must be at least 6 characters."), 400
    user = _verify_reset_token(token)
    if not user:
        return jsonify(error="This reset link is invalid or has expired."), 400
    user.set_password(password)
    db.session.commit()
    return jsonify(message="Your password has been reset. You can now log in.")


@auth_bp.post("/logout")
@jwt_required()
def logout():
    # Stateless JWT: client discards the token. For server-side revocation,
    # add a token blocklist here.
    return jsonify(message="logged out", user_id=get_jwt_identity())
