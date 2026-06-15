# AI Help Desk System — Setup & Project Guide

## What This Is

A full-stack AI-powered help desk with:
- **Flask** REST API backend (Python)
- **React + Vite** frontend (role-based UI)
- **RAG-based AI** ticket answering (OpenAI or mock fallback)
- **JWT authentication** with three roles: `user`, `agent`, `admin`
- **Single Docker container** deployment to Hugging Face Spaces
- **Neon PostgreSQL** for persistent production storage

---

## Project Structure

```
AI_HDS/
├── backend/
│   ├── app/
│   │   ├── __init__.py          # App factory, CORS, catch-all route for React
│   │   ├── config.py            # Config (SQLite dev / Postgres prod)
│   │   ├── models/
│   │   │   ├── user_model.py
│   │   │   ├── ticket_model.py  # csat_rating, resolved_at columns
│   │   │   ├── message_model.py
│   │   │   ├── kb_model.py      # category column
│   │   │   └── ai_logs_model.py
│   │   ├── routes/
│   │   │   ├── auth_routes.py
│   │   │   ├── ticket_routes.py # CSAT rating, resolved_at tracking
│   │   │   ├── message_routes.py
│   │   │   ├── kb_routes.py     # File upload (PDF/DOCX/TXT), delete
│   │   │   ├── dashboard_routes.py  # /api/dashboard/stats
│   │   │   ├── ai_routes.py
│   │   │   └── user_routes.py
│   │   ├── services/
│   │   │   ├── ai_service.py    # OpenAI + mock fallback
│   │   │   ├── rag_service.py   # KB retrieval
│   │   │   └── ticket_service.py
│   │   └── utils/
│   │       ├── auth_helpers.py  # role_required decorator
│   │       └── seed.py          # Reads seed_data.json
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   ├── src/
│   │   ├── api/client.js        # Axios, /api base, JWT interceptor
│   │   ├── context/AuthContext.jsx
│   │   ├── components/
│   │   │   ├── NavBar.jsx
│   │   │   └── PrivateRoute.jsx
│   │   └── pages/
│   │       ├── Login.jsx
│   │       ├── Register.jsx
│   │       ├── TicketDetail.jsx  # CSAT stars, sender role/email, resolved_at
│   │       ├── user/
│   │       │   ├── MyTickets.jsx
│   │       │   └── NewTicket.jsx
│   │       ├── agent/
│   │       │   └── AgentQueue.jsx
│   │       └── admin/
│   │           ├── AdminPanel.jsx
│   │           ├── Dashboard.jsx     # Charts, live stats
│   │           └── KnowledgeBase.jsx # Upload, delete, search
│   ├── vite.config.js           # /api proxy → localhost:5000
│   └── package.json
├── Dockerfile                   # Multi-stage: Node build → Python serve
├── entrypoint.sh                # Auto-seed then start gunicorn
├── seed_data.json               # Editable initial data
├── README.md                    # Hugging Face Spaces metadata header
└── SETUP.md                     # This file
```

---

## Local Development

### Prerequisites
- Python 3.11+
- Node.js 20+
- Git

### Backend Setup

```powershell
cd backend
pip install -r requirements.txt

# Copy and edit environment variables
copy .env.example .env

# Start Flask dev server (port 5000)
python run.py
```

**.env variables:**
```
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
DATABASE_URL=          # leave blank to use SQLite locally
OPENAI_API_KEY=        # optional — falls back to mock AI if not set
CORS_ORIGINS=http://localhost:5173
```

### Frontend Setup

```powershell
cd frontend
npm install

# Start Vite dev server (port 5173)
npm run dev
```

Open `http://localhost:5173` — Vite proxies `/api/*` to Flask at port 5000.

### Seed the Database

```powershell
cd backend
flask --app run seed
```

Or edit `seed_data.json` at the repo root to customize initial users, KB articles, and tickets before seeding.

---

## Default Seed Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | Admin123! | admin |
| agent@example.com | Agent123! | agent |
| user@example.com  | User123!  | user  |

---

## Role-Based UI

| Role | Access |
|------|--------|
| **user** | Submit tickets, view own tickets, rate resolved tickets (CSAT) |
| **agent** | View/manage all tickets queue, reply, change status |
| **admin** | All of the above + Analytics Dashboard, Knowledge Base management, Admin Panel |

---

## Key API Endpoints

```
POST   /api/auth/login
POST   /api/auth/register

GET    /api/tickets/             # all (agent/admin) or own (user)
POST   /api/tickets/             # create ticket
GET    /api/tickets/<id>
PATCH  /api/tickets/<id>         # update status/priority
POST   /api/tickets/<id>/rate    # CSAT rating (1–5)

GET    /api/messages/<ticket_id>
POST   /api/messages/<ticket_id>

GET    /api/kb/
GET    /api/kb/search?q=<query>
POST   /api/kb/                  # create article (agent/admin)
PUT    /api/kb/<id>              # edit (agent/admin)
DELETE /api/kb/<id>              # delete (agent/admin)
POST   /api/kb/upload            # upload PDF/DOCX/TXT (agent/admin)

GET    /api/dashboard/stats      # live analytics

GET    /api/users/               # admin only
PATCH  /api/users/<id>           # change role (admin)
```

---

## Dashboard Metrics

The admin analytics dashboard computes live:

| Metric | How |
|--------|-----|
| **Total Tickets** | COUNT all tickets |
| **Avg Resolution** | Mean minutes from `created_at` → `resolved_at` |
| **SLA Compliance** | % resolved within SLA window (low=72h, medium=48h, high=24h, urgent=4h) |
| **CSAT Score** | Avg user rating (1–5) × 20, shown as % |
| **AI Deflection** | AI-generated messages ÷ total tickets × 100 |
| **By Status / Priority** | Bar + doughnut charts |

---

## Knowledge Base File Upload

Agents and admins can upload files from the KB page:
- **PDF** — parsed with `pypdf`
- **DOCX / DOC** — parsed with `python-docx`
- **TXT** — decoded as UTF-8

The file content is extracted and saved as a KB article automatically.

---

## Deployment — Hugging Face Spaces

### Live URL
`https://ot404-ai-help-desk-system.hf.space`

### How It Works

1. `Dockerfile` builds the React frontend (Node stage), then copies the `dist/` into a Python image
2. `entrypoint.sh` runs `flask seed` then starts `gunicorn` on port 7860
3. Flask serves `/api/*` routes and serves React's `index.html` for everything else

### Re-deploying

```powershell
# After making changes:
git add .
git commit -m "Your message"

# Push to Hugging Face (deploys automatically)
git push hf clean-main:main

# Push to GitHub backup
git push origin clean-main:main
```

### Environment Secrets (set in HF Space Settings → Variables and Secrets)

| Secret | Value |
|--------|-------|
| `DATABASE_URL` | Your Neon PostgreSQL connection string |
| `SECRET_KEY` | Random secret for Flask sessions |
| `JWT_SECRET_KEY` | Random secret for JWT tokens |
| `OPENAI_API_KEY` | OpenAI key (optional) |

### Neon PostgreSQL

Production database: Neon serverless Postgres.
Connection string format:
```
postgresql://user:password@host/dbname?sslmode=require
```
Set as `DATABASE_URL` in HF Space secrets. The app automatically uses PostgreSQL when this variable is present.

---

## Git Remotes

```
origin  → https://github.com/ot-404/ai-help-desk-system.git
hf      → https://huggingface.co/spaces/ot404/ai-help-desk-system
```

The deployment branch is `clean-main` (orphan branch with no binary file history).

---

## Customizing Seed Data

Edit `seed_data.json` at the repo root before first deploy or `flask seed`:

```json
{
  "branding": { "company_name": "...", "support_email": "..." },
  "users": [ { "email": "...", "password": "...", "role": "admin" } ],
  "knowledge_base": [ { "title": "...", "content": "...", "category": "..." } ],
  "sample_tickets": [ { "subject": "...", "description": "...", "priority": "medium" } ]
}
```

Seed only runs once per database (skips if users already exist).

---

## Dev Server Config (Claude Code)

`.claude/launch.json` — used by Claude Code's preview_start:

```json
{
  "configurations": [
    {
      "name": "Flask Backend",
      "runtimeExecutable": "C:\\Users\\ripp3\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\python\\python.exe",
      "runtimeArgs": ["run.py"],
      "cwd": "backend",
      "port": 5000
    },
    {
      "name": "React Frontend (Vite)",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "cwd": "frontend",
      "port": 5173
    }
  ]
}
```
