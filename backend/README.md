# AI Help Desk System — Backend

A Flask + RAG help desk API built from the project blueprint. Tickets are
answered from a knowledge base by an LLM; low-confidence cases escalate to a
human. Includes JWT auth, role-based access, an AI assistant, and a live
analytics dashboard.

## Quick start

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # optional: add OPENAI_API_KEY
flask --app run seed          # demo users, tickets, KB articles
python run.py                 # http://localhost:5000
```

Open `http://localhost:5000/` for the analytics dashboard.
Without an `OPENAI_API_KEY` a built-in **mock model** is used so everything
still runs end to end.

### Demo logins (after `flask --app run seed`)
| Role  | Email             | Password  |
|-------|-------------------|-----------|
| admin | admin@example.com | admin123  |
| agent | agent@example.com | agent123  |
| user  | jane@example.com  | user123   |

## API overview

| Area | Method & path | Notes |
|------|---------------|-------|
| Auth | `POST /api/auth/register` · `POST /api/auth/login` · `POST /api/auth/logout` | JWT |
| Users | `GET /api/users/` (admin) · `GET/PUT /api/users/me` | |
| Tickets | `POST /api/tickets/` · `GET /api/tickets/` · `GET/PUT/DELETE /api/tickets/<id>` | create auto-answers via AI |
| Messages | `POST /api/messages/ticket/<id>` · `GET /api/messages/ticket/<id>` | conversation thread |
| AI | `POST /api/ai/answer` · `POST /api/ai/summarize/<id>` · `POST /api/ai/suggest/<id>` | RAG answer / summary / steps |
| KB | `GET /api/kb/` · `GET /api/kb/search?q=` · `POST/PUT /api/kb/<id>` | add/update needs agent/admin |
| Dashboard | `GET /` · `GET /api/dashboard/stats` | analytics UI + JSON |

## Architecture

```
app/
  __init__.py        app factory (db, jwt, cors, blueprints)
  config.py          env-driven config
  models/            User, Ticket, Message, KnowledgeBase, AILog
  routes/            auth, users, tickets, messages, ai, kb, dashboard
  services/          ai_service (LLM), rag_service, ticket_service, email_service
  utils/             auth_helpers (RBAC), seed
  templates/         dashboard.html
run.py               entry point + `seed` CLI command
```

### AI workflow
`user submits ticket → build prompt context (RAG over KB) → call LLM →
generate response → store AILog → return / escalate if no confident context.`

## Docker

```bash
docker compose up --build      # http://localhost:5000
```

## Production notes
- Swap the keyword retrieval in `rag_service.py` for a vector DB (Pinecone/Qdrant/FAISS) with embeddings + reranking.
- Move from SQLite to Postgres via `DATABASE_URL`.
- Add a JWT blocklist for real logout/revocation.
- Wire `email_service.py` to SMTP or a provider for escalation alerts.
