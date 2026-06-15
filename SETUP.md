# AI Help Desk System — Setup & Project Guide

## What This Is

A full-stack AI-powered help desk with:
- **Flask** REST API backend (Python 3.11)
- **React + Vite** frontend (role-based UI, public browsing, personalized home pages)
- **AI content generation** — ask a question → AI answers + saves KB article + blog post
- **RAG-based AI** answers using knowledge base context (Anthropic Claude or OpenAI or mock)
- **JWT authentication** with three roles: `user`, `agent`, `admin`
- **Single Docker container** deployment to Hugging Face Spaces
- **Neon PostgreSQL** in production, SQLite for local dev

---

## Roles

| Role | Access |
|------|--------|
| **user** | Public home, Help Center, Ask AI, My Tickets, New Ticket, Ticket Detail |
| **agent** | All of the above + Queue, Knowledge Base management |
| **admin** | Everything + Dashboard analytics, User management |

Users cannot self-assign agent/admin — registration always creates `role="user"`.

---

## Pages

| URL | Who can see | Description |
|-----|------------|-------------|
| `/` | everyone | Personalized home: guest → public landing, user → their ticket stats, agent/admin → queue overview |
| `/help` | everyone | Public Help Center — browse KB articles with category tabs (All / Blog / FAQ / Technical / Account / Billing / General) |
| `/ask` | everyone (submit requires login) | Ask AI a question → instant answer + auto-saved KB article + blog post |
| `/login` | everyone | Sign in — honours `?next=` redirect param |
| `/register` | everyone | Create account |
| `/my-tickets` | user | List of own tickets |
| `/new-ticket` | user | Submit ticket with priority picker |
| `/ticket/:id` | logged in | Thread view; CSAT stars for owner; AI suggest for agent/admin |
| `/agent` | agent, admin | Full ticket queue with status filter |
| `/admin` | admin | Analytics dashboard (charts, SLA, CSAT, visits, users) |
| `/admin/users` | admin | User list with role change + role definitions |
| `/admin/kb` | agent, admin | Create / edit / delete / upload KB articles |

---

## Quick Start (Local)

### 1. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt

# Optional: set API keys in .env
echo ANTHROPIC_API_KEY=sk-ant-... >> .env
echo OPENAI_API_KEY=sk-...      >> .env

flask --app run seed            # seed demo data
python run.py                   # starts on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev                     # starts on http://localhost:5173
```

### 3. Demo accounts (seeded from seed_data.json)

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | admin123 | admin |
| agent@example.com | agent123 | agent |
| jane@example.com  | user123  | user  |

---

## AI Features

### Ask AI (`/ask`)
Any logged-in user can ask a question. The system:
1. Searches the KB for relevant context (RAG)
2. Generates an AI answer
3. Asks the AI to format that Q&A into a **KB article** (title, content, auto-picked category, tags)
4. Asks the AI to write a **blog post** (intro, sections with `##` headers, conclusion)
5. Saves both to the database and returns them with links

Blog posts appear in the Help Center under the **Blog** tab.

### AI Provider Priority
```
ANTHROPIC_API_KEY set → Claude (claude-haiku-4-5-20251001)
OPENAI_API_KEY set    → GPT-4o mini
Neither               → mock model (safe fallback, no external calls)
```

### Other AI features (agents/admins only)
- **AI Suggest** on ticket detail — 3 resolution steps
- **AI Summarize** on ticket detail — 2-3 sentence conversation summary
- **AI Reply** on ticket detail — posts an AI-generated reply to the thread

---

## Deployment (Hugging Face Spaces)

### Remotes
```
origin  →  https://github.com/ot-404/ai-help-desk-system.git
hf      →  https://huggingface.co/spaces/ot404/ai-help-desk-system
```

### Push
```bash
git push origin clean-main:main
git push hf clean-main:main
```

### HF Spaces secrets to set
```
SECRET_KEY          (any long random string)
JWT_SECRET_KEY      (32+ chars)
DATABASE_URL        (Neon PostgreSQL connection string)
ANTHROPIC_API_KEY   (optional — enables Claude AI)
OPENAI_API_KEY      (optional — fallback AI)
```

---

## Project Structure

```
AI_HDS/
├── backend/
│   ├── app/
│   │   ├── __init__.py          # app factory, CORS, JWT, visit tracking
│   │   ├── config.py            # env-driven config (API keys, DB URL)
│   │   ├── models/
│   │   │   ├── user_model.py
│   │   │   ├── ticket_model.py  # csat_rating, resolved_at
│   │   │   ├── message_model.py
│   │   │   ├── kb_model.py
│   │   │   ├── ai_logs_model.py
│   │   │   └── site_visit_model.py
│   │   ├── routes/
│   │   │   ├── auth_routes.py
│   │   │   ├── ticket_routes.py
│   │   │   ├── message_routes.py  # _serialize_message() masks agent identity
│   │   │   ├── ai_routes.py       # /answer, /ask, /suggest, /summarize
│   │   │   ├── kb_routes.py       # CRUD + file upload
│   │   │   ├── user_routes.py     # PATCH role (admin only)
│   │   │   └── dashboard_routes.py
│   │   ├── services/
│   │   │   ├── ai_service.py      # LLM calls, KB article gen, blog post gen
│   │   │   └── rag_service.py     # KB context retrieval
│   │   └── utils/
│   │       └── auth_helpers.py    # role_required() decorator
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # routes
│   │   ├── index.css            # global reset + keyframe animations
│   │   ├── api/client.js        # Axios instance with JWT header
│   │   ├── context/AuthContext.jsx
│   │   ├── components/
│   │   │   ├── NavBar.jsx       # role-aware nav; unauth shows Sign In/Get Help
│   │   │   └── PrivateRoute.jsx # redirects to /login?next=<path>
│   │   └── pages/
│   │       ├── Home.jsx         # public landing
│   │       ├── UserHome.jsx     # personalized home for users
│   │       ├── StaffHome.jsx    # queue overview home for agents/admins
│   │       ├── PublicHelp.jsx   # KB browser with category tabs
│   │       ├── AskAI.jsx        # ask → answer + KB article + blog post
│   │       ├── Login.jsx
│   │       ├── Register.jsx
│   │       ├── TicketDetail.jsx
│   │       ├── user/
│   │       │   ├── MyTickets.jsx
│   │       │   └── NewTicket.jsx
│   │       ├── agent/
│   │       │   └── AgentQueue.jsx
│   │       └── admin/
│   │           ├── Dashboard.jsx
│   │           ├── AdminPanel.jsx  # role definitions + user table
│   │           └── KnowledgeBase.jsx
│   ├── index.html
│   └── vite.config.js
├── Dockerfile
├── entrypoint.sh            # auto-seeds on first boot
├── seed_data.json           # editable seed users + KB articles
└── SETUP.md                 # this file
```

---

## Security Notes
- Passwords hashed with Werkzeug `generate_password_hash`
- Role self-assignment blocked — register always sets `role="user"`
- Agent/admin identity masked from users in ticket threads (`_serialize_message`)
- Site visits tracked with SHA-256 hashed IPs (no raw IPs stored)
- KB write/delete endpoints require agent or admin role
- Dashboard stats endpoint requires admin role
