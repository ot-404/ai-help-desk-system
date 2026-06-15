"""Email notifications (stub). Wire up SMTP / a provider in production."""
from flask import current_app


def send_email(to, subject, body):
    current_app.logger.info("EMAIL -> %s | %s | %s", to, subject, body[:80])
    return True


def notify_escalation(agent_email, ticket):
    return send_email(
        agent_email,
        f"[Escalation] Ticket #{ticket.id}: {ticket.subject}",
        ticket.description,
    )
