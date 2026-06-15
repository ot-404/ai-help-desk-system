"""Tracks page visits to the frontend."""
from datetime import datetime
from app import db


class SiteVisit(db.Model):
    __tablename__ = "site_visits"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ip_hash = db.Column(db.String(64))   # SHA-256 of IP — no PII stored
    path = db.Column(db.String(500), default="/")
    visited_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
