"""AI layer for Lumo.

Tries Anthropic (Claude) first, then any OpenAI-compatible endpoint, then a
local heuristic mock — so the app is fully functional with zero API keys.

Public helpers:
  parse_task(text)            -> {"title","due_date","priority","notes","subtasks"}
  breakdown_task(title, notes)-> {"subtasks": [...]}
  plan_day(tasks)             -> {"message", "order": [task_id, ...]}
  chat(messages, tasks)       -> {"reply"}
Each returns a tuple of (result_dict, model_used).
"""
import json
import re
from datetime import date, timedelta

import requests
from flask import current_app

_TIMEOUT = 30
_WEEKDAYS = ["monday", "tuesday", "wednesday", "thursday",
             "friday", "saturday", "sunday"]


# --------------------------------------------------------------------------- #
# Provider plumbing
# --------------------------------------------------------------------------- #
def _anthropic(system, messages, max_tokens):
    key = current_app.config.get("ANTHROPIC_API_KEY")
    if not key:
        return None
    model = current_app.config.get("ANTHROPIC_MODEL")
    try:
        r = requests.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": key,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            json={"model": model, "max_tokens": max_tokens,
                  "system": system, "messages": messages},
            timeout=_TIMEOUT,
        )
        r.raise_for_status()
        return r.json()["content"][0]["text"], model
    except Exception as e:  # noqa: BLE001
        current_app.logger.warning("Anthropic call failed: %s", e)
        return None


def _openai(system, messages, max_tokens):
    key = current_app.config.get("OPENAI_API_KEY")
    if not key:
        return None
    base = current_app.config.get("OPENAI_BASE_URL")
    model = current_app.config.get("OPENAI_MODEL")
    try:
        r = requests.post(
            f"{base}/chat/completions",
            headers={"Authorization": f"Bearer {key}",
                     "Content-Type": "application/json"},
            json={"model": model,
                  "messages": [{"role": "system", "content": system}] + messages,
                  "max_tokens": max_tokens, "temperature": 0.4},
            timeout=_TIMEOUT,
        )
        r.raise_for_status()
        return r.json()["choices"][0]["message"]["content"], model
    except Exception as e:  # noqa: BLE001
        current_app.logger.warning("OpenAI call failed: %s", e)
        return None


def _complete(system, messages, max_tokens=700):
    """Return (text, model_used) or (None, 'mock') when no provider answers."""
    return _anthropic(system, messages, max_tokens) \
        or _openai(system, messages, max_tokens) \
        or (None, "mock")


def _extract_json(text):
    """Pull the first JSON object/array out of an LLM response."""
    if not text:
        return None
    fenced = re.search(r"```(?:json)?\s*(.+?)```", text, re.DOTALL)
    if fenced:
        text = fenced.group(1)
    match = re.search(r"[\[{].*[\]}]", text, re.DOTALL)
    if not match:
        return None
    try:
        return json.loads(match.group(0))
    except json.JSONDecodeError:
        return None


# --------------------------------------------------------------------------- #
# Heuristic mock helpers (used when no LLM is configured)
# --------------------------------------------------------------------------- #
def _mock_parse(text):
    raw = text.strip()
    low = raw.lower()
    today = date.today()
    due = None
    consumed = []

    def take(pattern):
        nonlocal low
        m = re.search(pattern, low)
        if m:
            consumed.append(m.group(0))
        return m

    if take(r"\btomorrow\b"):
        due = today + timedelta(days=1)
    elif take(r"\btoday\b|\btonight\b"):
        due = today
    elif (m := take(r"\bin (\d+) days?\b")):
        due = today + timedelta(days=int(m.group(1)))
    elif take(r"\bnext week\b"):
        due = today + timedelta(days=7)
    else:
        for i, wd in enumerate(_WEEKDAYS):
            if take(rf"\b(?:next |on )?{wd}\b"):
                ahead = (i - today.weekday()) % 7
                due = today + timedelta(days=ahead or 7)
                break
    iso = re.search(r"\b(\d{4}-\d{2}-\d{2})\b", low)
    if iso and not due:
        try:
            due = date.fromisoformat(iso.group(1))
            consumed.append(iso.group(1))
        except ValueError:
            pass

    priority = "none"
    if re.search(r"\b(urgent|asap|important|high priority)\b|!!", low):
        priority = "high"
        consumed += re.findall(r"\b(urgent|asap|important|high priority)\b", low)
    elif re.search(r"\b(low priority|whenever|someday)\b", low):
        priority = "low"
        consumed += re.findall(r"\b(low priority|whenever|someday)\b", low)

    title = raw
    for phrase in consumed:
        title = re.sub(re.escape(phrase), "", title, flags=re.IGNORECASE)
    title = re.sub(r"\b(by|on|at|due)\b\s*$", "", title.strip(), flags=re.IGNORECASE)
    title = re.sub(r"\s{2,}", " ", title).strip(" ,.-!") or raw
    title = title[0].upper() + title[1:] if title else raw

    return {
        "title": title,
        "due_date": due.isoformat() if due else None,
        "priority": priority,
        "notes": "",
        "subtasks": [],
    }


def _mock_breakdown(title):
    base = title.rstrip(".!?")
    return {"subtasks": [
        f"Outline what '{base}' involves",
        f"Gather everything needed for {base.lower()}",
        f"Do the main work for {base.lower()}",
        "Review and wrap up",
    ]}


# --------------------------------------------------------------------------- #
# Public API
# --------------------------------------------------------------------------- #
def parse_task(text):
    system = (
        "You turn a short natural-language note into a single structured to-do. "
        "Respond with ONLY a JSON object: "
        '{"title": string, "due_date": "YYYY-MM-DD" or null, '
        '"priority": "none"|"low"|"medium"|"high", "notes": string, '
        '"subtasks": [string, ...]}. '
        f"Today is {date.today().isoformat()}. Resolve relative dates "
        "(today, tomorrow, next friday). Keep the title concise and imperative. "
        "Only add subtasks if the note clearly implies multiple steps."
    )
    text_out, model = _complete(system, [{"role": "user", "content": text}], 500)
    data = _extract_json(text_out) if text_out else None
    if not isinstance(data, dict) or not data.get("title"):
        return _mock_parse(text), "mock"
    data.setdefault("due_date", None)
    data.setdefault("priority", "none")
    data.setdefault("notes", "")
    subs = data.get("subtasks") or []
    data["subtasks"] = [str(s) for s in subs if str(s).strip()][:8]
    if data["priority"] not in ("none", "low", "medium", "high"):
        data["priority"] = "none"
    return data, model


def breakdown_task(title, notes=""):
    system = (
        "Break the given task into 3-6 concrete, ordered subtasks. "
        'Respond with ONLY JSON: {"subtasks": [string, ...]}. '
        "Each subtask is a short imperative action."
    )
    prompt = f"Task: {title}\nNotes: {notes}" if notes else f"Task: {title}"
    text_out, model = _complete(system, [{"role": "user", "content": prompt}], 400)
    data = _extract_json(text_out) if text_out else None
    if not isinstance(data, dict) or not data.get("subtasks"):
        return _mock_breakdown(title), "mock"
    data["subtasks"] = [str(s).strip() for s in data["subtasks"] if str(s).strip()][:8]
    return data, model


def plan_day(tasks):
    """tasks: list of dicts with id/title/priority/due_date. Returns plan."""
    if not tasks:
        return {"message": "You're all clear — nothing due. Add a task to get started.",
                "order": []}, "mock"

    listing = "\n".join(
        f"- [{t['id']}] {t['title']} (priority: {t.get('priority','none')}, "
        f"due: {t.get('due_date') or 'none'})" for t in tasks
    )
    system = (
        "You are a focused productivity coach. Given today's tasks, suggest a "
        "sensible order to tackle them and a one-paragraph motivating plan. "
        'Respond with ONLY JSON: {"message": string, "order": [task_id, ...]}. '
        "Order ids most-important-first using priority and due dates."
    )
    text_out, model = _complete(system, [{"role": "user", "content": listing}], 500)
    data = _extract_json(text_out) if text_out else None
    if isinstance(data, dict) and data.get("order"):
        ids = [int(i) for i in data["order"] if str(i).isdigit()]
        msg = data.get("message") or "Here's a good order to work through today."
        return {"message": msg, "order": ids}, model

    rank = {"high": 0, "medium": 1, "low": 2, "none": 3}
    ordered = sorted(tasks, key=lambda t: (rank.get(t.get("priority"), 3),
                                           t.get("due_date") or "9999"))
    top = ordered[0]["title"] if ordered else ""
    return {
        "message": f"You have {len(tasks)} task(s) for today. "
                   f"Start with “{top}”, then work down the list. "
                   "Tackle the high-priority items while your focus is fresh.",
        "order": [t["id"] for t in ordered],
    }, "mock"


def chat(messages, tasks):
    context = "\n".join(
        f"- {t['title']} (priority: {t.get('priority','none')}, "
        f"due: {t.get('due_date') or 'none'}, "
        f"{'done' if t.get('completed') else 'open'})" for t in tasks[:50]
    ) or "(no tasks yet)"
    system = (
        "You are Lumo, a friendly, concise AI assistant inside a to-do app. "
        "Help the user think through, prioritise and plan their tasks. "
        "Be brief and practical. The user's current tasks:\n" + context
    )
    text_out, model = _complete(system, messages, 600)
    if not text_out:
        last = messages[-1]["content"] if messages else ""
        open_count = sum(1 for t in tasks if not t.get("completed"))
        return {"reply": (
            f"You have {open_count} open task(s). "
            "I can help you prioritise them, break a big one into steps, or plan "
            f"your day. (You asked: “{last[:80]}” — connect an AI key for "
            "full answers.)")}, "mock"
    return {"reply": text_out.strip()}, model
