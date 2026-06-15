"""Dashboard: stats API + serves the analytics UI."""
from datetime import datetime, timedelta
from flask import Blueprint, jsonify
from sqlalchemy import func
from app import db
from app.models.ticket_model import Ticket
from app.models.ai_logs_model import AILog
from app.models.message_model import Message
from app.models.user_model import User
from app.models.site_visit_model import SiteVisit

dashboard_bp = Blueprint("dashboard", __name__)

# SLA targets in hours by priority
SLA_HOURS = {"low": 72, "medium": 48, "high": 24, "urgent": 4}


@dashboard_bp.get("/api/dashboard/stats")
def stats():
    total = Ticket.query.count()
    by_status = dict(
        db.session.query(Ticket.status, func.count(Ticket.id)).group_by(Ticket.status).all()
    )
    by_priority = dict(
        db.session.query(Ticket.priority, func.count(Ticket.id)).group_by(Ticket.priority).all()
    )
    ai_messages = Message.query.filter_by(ai_generated=True).count()
    ai_calls = AILog.query.count()
    resolved = by_status.get("resolved", 0) + by_status.get("closed", 0)
    deflection = round((ai_messages / total * 100), 1) if total else 0.0

    # Avg resolution time from tickets that have resolved_at set
    resolved_tickets = Ticket.query.filter(Ticket.resolved_at.isnot(None)).all()
    if resolved_tickets:
        total_minutes = sum(
            (t.resolved_at - t.created_at).total_seconds() / 60
            for t in resolved_tickets
        )
        avg_resolution_minutes = round(total_minutes / len(resolved_tickets), 1)
    else:
        avg_resolution_minutes = None

    # SLA compliance: % of resolved tickets resolved within their SLA window
    sla_compliant = 0
    sla_total = len(resolved_tickets)
    for t in resolved_tickets:
        target_hours = SLA_HOURS.get(t.priority, 48)
        elapsed_hours = (t.resolved_at - t.created_at).total_seconds() / 3600
        if elapsed_hours <= target_hours:
            sla_compliant += 1
    sla_compliance = round(sla_compliant / sla_total * 100, 1) if sla_total else None

    # CSAT: average of submitted ratings (1-5), scaled to 0-100
    rated = Ticket.query.filter(Ticket.csat_rating.isnot(None)).all()
    if rated:
        avg_raw = sum(t.csat_rating for t in rated) / len(rated)
        csat = round((avg_raw / 5) * 100, 1)
    else:
        csat = None

    # User counts
    total_users = User.query.count()
    users_by_role = dict(
        db.session.query(User.role, func.count(User.id)).group_by(User.role).all()
    )

    # Visit counts
    now = datetime.utcnow()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_start = today_start - timedelta(days=6)
    visits_total = SiteVisit.query.count()
    visits_today = SiteVisit.query.filter(SiteVisit.visited_at >= today_start).count()
    visits_this_week = SiteVisit.query.filter(SiteVisit.visited_at >= week_start).count()
    unique_today = db.session.query(func.count(func.distinct(SiteVisit.ip_hash))).filter(
        SiteVisit.visited_at >= today_start
    ).scalar() or 0

    return jsonify(
        total_tickets=total,
        by_status=by_status,
        by_priority=by_priority,
        resolved=resolved,
        ai_messages=ai_messages,
        ai_calls=ai_calls,
        deflection_rate=deflection,
        csat=csat,
        csat_responses=len(rated),
        avg_resolution_minutes=avg_resolution_minutes,
        sla_compliance=sla_compliance,
        sla_total=sla_total,
        total_users=total_users,
        users_by_role=users_by_role,
        visits_total=visits_total,
        visits_today=visits_today,
        visits_this_week=visits_this_week,
        unique_visitors_today=unique_today,
    )
