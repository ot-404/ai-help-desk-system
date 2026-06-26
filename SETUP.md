# Lumo — Setup & Project Guide

## What This Is

**Lumo** is a full-stack, AI-powered to-do app:
- **Flask** REST API backend (Python 3.11)
- **React + Vite + Tailwind** frontend (dark SaaS theme), installable as a PWA
- **AI** that parses natural language into tasks, breaks tasks into subtasks,
  plans your day, and powers a chat assistant
- **JWT authentication**, single-user model (everyone owns their own tasks)
- **Single Docker container** deploy to Hugging Face Spaces
- **PostgreSQL** in production (e.g. Neon), SQLite for local dev

---

## App routes (frontend)

| URL | Who | Description |
|-----|-----|-------------|
| `/` | guests | Marketing landing page (redirects to the app if already signed in) |
| `/login`, `/register` | guests | Auth |
| `/app/today` | signed in | Tasks due today (and overdue) |
| `/app/upcoming` | signed in | Tasks with a future due date |
| `/app/all` | signed in | All open tasks |
| `/app/inbox` | signed in | Open tasks with no list |
| `/app/completed` | signed in | Finished tasks |
| `/app/list/:id` | signed in | A custom list/project |

The AI assistant (chat + "Plan my day") lives in a drawer available from the
top bar and sidebar on every app screen.

---

## API (all under `/api`)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Create account (also seeds starter lists + tasks), returns JWT |
| POST | `/auth/login` | Log in, returns JWT |
| GET | `/auth/me` | Current user |
| GET | `/tasks/?view=today\|upcoming\|all\|inbox\|completed[&list_id=]` | List tasks |
| GET | `/tasks/counts` | Counts per view (for sidebar badges) |
| POST | `/tasks/` | Create a task (or subtask via `parent_id`) |
| GET/PATCH/DELETE | `/tasks/<id>` | Read / update / delete |
| POST | `/tasks/<id>/toggle` | Toggle completion (completes subtasks too) |
| POST | `/tasks/reorder` | Persist order from a list of ids |
| GET/POST | `/lists/` | List / create lists |
| PATCH/DELETE | `/lists/<id>` | Update / delete a list |
| POST | `/ai/quick-add` | Natural language → structured task (+ subtasks) |
| POST | `/ai/breakdown` | `{task_id}` → AI subtasks saved under the task |
| POST | `/ai/plan` | Order today's tasks + a short plan message |
| POST | `/ai/chat` | `{messages}` → assistant reply (knows your tasks) |

JWT identity is the user id; there are no roles.

---

## Quick Start (Local)

### 1. Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows (use source venv/bin/activate on macOS/Linux)
pip install -r requirements.txt

# Optional: add an AI key to .env (otherwise a built-in mock is used)
copy .env.example .env         # then edit it

flask --app run seed           # seed the demo account
python run.py                  # http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev                    # http://localhost:5173  (proxies /api -> :5000)
```

### 3. Demo account
| Email | Password |
|-------|----------|
| demo@lumo.app | demo123 |

---

## AI

The AI layer (`backend/app/services/ai_service.py`) tries providers in order and
falls back gracefully, so the app is fully functional with **no** API keys:

```
ANTHROPIC_API_KEY set → Claude (claude-haiku-4-5-20251001)
OPENAI_API_KEY set    → GPT-4o mini (or any OpenAI-compatible endpoint via OPENAI_BASE_URL)
Neither               → built-in heuristic mock (parses dates/priority locally)
```

Capabilities: natural-language task parsing, subtask breakdown, day planning, and
a task-aware chat assistant.

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

The `Dockerfile` builds the Vite frontend, then runs Flask (gunicorn via
`entrypoint.sh`) which serves both the API and the built SPA on port 7860.

### Secrets to set on the Space
```
SECRET_KEY          (any long random string)
JWT_SECRET_KEY      (32+ chars recommended)
DATABASE_URL        (PostgreSQL connection string; SQLite used if unset)
ANTHROPIC_API_KEY   (optional — enables Claude)
OPENAI_API_KEY      (optional — fallback)
CORS_ORIGINS        (optional; defaults to *)
```

---

## Project Structure

```
AI_HDS/
├── backend/
│   ├── app/
│   │   ├── __init__.py            # app factory, CORS, JWT, serves the SPA
│   │   ├── config.py              # env-driven config (keys, DB URL)
│   │   ├── models/
│   │   │   ├── user_model.py
│   │   │   ├── list_model.py      # TaskList (name, color, icon)
│   │   │   ├── task_model.py      # priority, due_date, parent_id subtasks
│   │   │   └── ai_logs_model.py
│   │   ├── routes/
│   │   │   ├── auth_routes.py     # register / login / me
│   │   │   ├── task_routes.py     # CRUD, toggle, reorder, view filters
│   │   │   ├── list_routes.py     # list CRUD
│   │   │   └── ai_routes.py       # quick-add, breakdown, plan, chat
│   │   ├── services/ai_service.py # provider fallback + AI helpers
│   │   └── utils/
│   │       ├── auth_helpers.py    # current_user()
│   │       └── seed.py            # demo account + starter content
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   ├── src/
│   │   ├── App.jsx                # routes
│   │   ├── main.jsx               # entry + PWA service-worker registration
│   │   ├── index.css              # Tailwind layers + design tokens
│   │   ├── lib/                   # api.js, dates.js, icons.js
│   │   ├── context/AuthContext.jsx
│   │   ├── components/            # AppLayout, Sidebar, AIAssistant, QuickAdd,
│   │   │                          # TaskRow, TaskModal, ListModal, Modal, …
│   │   └── pages/                 # Landing, Login, Register, TasksView
│   ├── public/                    # favicon, PWA manifest + icons, sw.js
│   ├── tailwind.config.js
│   ├── index.html
│   └── vite.config.js
├── Dockerfile                     # 2-stage: build Vite -> Flask serves dist
├── entrypoint.sh                  # seeds demo account, then gunicorn
└── SETUP.md                       # this file
```

---

## Notes
- Passwords hashed with Werkzeug `generate_password_hash`.
- The AI never blocks the app — every endpoint has a local fallback.
- Deleting a list keeps its tasks (they move to Inbox).
