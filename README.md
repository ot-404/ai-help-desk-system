---
title: Lumo — AI To-Do
emoji: ✨
colorFrom: green
colorTo: gray
sdk: docker
app_port: 7860
pinned: false
---

# Lumo — your AI to-do list

A dark, SaaS-style to-do app where AI does the busywork: capture tasks in plain
English, auto-extract due dates and priorities, break big tasks into subtasks,
get a focused "plan my day", and chat with an assistant that knows your list.

**Live demo account (auto-seeded on first boot):**

| Email          | Password |
|----------------|----------|
| demo@lumo.app  | demo123  |

> Or click **Try the live demo** on the landing page.

## Stack
- **Backend:** Flask · SQLAlchemy · Flask-JWT-Extended
- **Frontend:** React 19 · Vite · Tailwind CSS · lucide-react
- **AI:** Anthropic Claude → OpenAI-compatible → built-in heuristic mock (works with no keys)
- **Deploy:** single Docker container (Vite build served by Flask)

## Features
- Marketing landing page → left-sidebar app shell after sign-in
- Views: Today · Upcoming · All · Inbox · Completed, plus custom Lists/projects
- Tasks with priority, due dates, notes, and nested subtasks
- **AI quick-add** — "email Sam about the proposal tomorrow 9am, high" → a structured task
- **AI breakdown** — turn any task into an ordered checklist
- **Plan my day** — AI orders today's tasks by what matters
- **AI assistant** — a chat drawer that knows your tasks
- Installable PWA, responsive down to mobile

See [SETUP.md](SETUP.md) for local setup, the API, and project structure.
