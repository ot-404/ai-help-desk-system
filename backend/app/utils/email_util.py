"""Minimal SMTP email sender. No-op (returns False) when SMTP isn't configured."""
import smtplib
from email.mime.text import MIMEText
from email.utils import formataddr
from flask import current_app


def smtp_configured():
    return bool(current_app.config.get("SMTP_HOST") and current_app.config.get("SMTP_USER"))


def send_email(to_email, subject, body_text):
    """Send a plain-text email. Returns True on success, False if not sent."""
    if not smtp_configured():
        current_app.logger.info("SMTP not configured; skipping email to %s", to_email)
        return False
    cfg = current_app.config
    msg = MIMEText(body_text, "plain", "utf-8")
    msg["Subject"] = subject
    msg["From"] = formataddr(("HD Systems", cfg["SMTP_FROM"]))
    msg["To"] = to_email
    try:
        with smtplib.SMTP(cfg["SMTP_HOST"], cfg["SMTP_PORT"], timeout=20) as server:
            if cfg.get("SMTP_TLS", True):
                server.starttls()
            server.login(cfg["SMTP_USER"], cfg["SMTP_PASS"])
            server.sendmail(cfg["SMTP_FROM"], [to_email], msg.as_string())
        return True
    except Exception as exc:
        current_app.logger.error("Failed to send email to %s: %s", to_email, exc)
        return False
