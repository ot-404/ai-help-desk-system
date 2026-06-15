#!/bin/sh
set -e

# Seed demo data on first boot (no-op if already seeded)
flask --app run seed 2>/dev/null || true

exec gunicorn -b "0.0.0.0:${PORT:-7860}" --workers 2 --timeout 60 run:app
