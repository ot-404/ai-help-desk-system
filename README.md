---
title: AI Help Desk System
emoji: 🎫
colorFrom: green
colorTo: blue
sdk: docker
app_port: 7860
pinned: false
---

# AI Help Desk System

A full-stack AI-powered help desk with JWT auth, RAG-based ticket answering, role-based dashboards, and a live analytics panel.

**Demo accounts (auto-seeded on first boot):**

| Role  | Email                 | Password  |
|-------|-----------------------|-----------|
| Admin | admin@example.com     | admin123  |
| Agent | agent@example.com     | agent123  |
| User  | jane@example.com      | user123   |

## Stack
- **Backend:** Flask · SQLAlchemy · Flask-JWT-Extended · RAG + OpenAI
- **Frontend:** React · Vite · Chart.js
- **Deploy:** Docker (single container)
