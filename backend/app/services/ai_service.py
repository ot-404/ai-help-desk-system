"""LLM integration + AI workflow.

Calls OpenAI and Anthropic directly via HTTP (requests library) —
no SDK dependencies, no version conflicts.

Priority: ANTHROPIC_API_KEY → OPENAI_API_KEY → fallback message.
"""
import json
import re
import requests
from flask import current_app
from app import db
from app.models.ai_logs_model import AILog
from app.services.rag_service import retrieve_context
from app.services.web_search_service import web_search

SYSTEM_PROMPT = (
    "You are a knowledgeable assistant integrated into a help desk. "
    "You are given context from a knowledge base and live web search results. "
    "Use the context when it is relevant. If the context does not cover the question, "
    "answer directly from your own knowledge — you are allowed and expected to do this. "
    "Never refuse to answer or say you don't know simply because the context is missing. "
    "If a source URL is provided in the context and you use it, cite it. "
    "Be accurate, concise, and friendly."
)

_FALLBACK = (
    "Our AI assistant is temporarily unavailable. A support agent has been "
    "notified and will respond to your question shortly.",
    "unavailable",
)


def _call_anthropic(messages, api_key, model):
    system = next((m["content"] for m in messages if m["role"] == "system"), "")
    user_msgs = [m for m in messages if m["role"] != "system"]
    resp = requests.post(
        "https://api.anthropic.com/v1/messages",
        headers={
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        json={
            "model": model,
            "max_tokens": 1024,
            "system": system,
            "messages": user_msgs,
        },
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json()["content"][0]["text"]


def _call_openai(messages, api_key, model, base_url="https://api.openai.com/v1"):
    """Works with OpenAI or any OpenAI-compatible provider (Groq, OpenRouter, …)."""
    import time
    for attempt in range(4):
        resp = requests.post(
            f"{base_url.rstrip('/')}/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": model,
                "messages": messages,
                "temperature": 0.3,
            },
            timeout=30,
        )
        if resp.status_code == 429:
            wait = 10 * (attempt + 1)  # 10s, 20s, 30s, 40s
            current_app.logger.warning("Rate limited (429), retrying in %ss…", wait)
            time.sleep(wait)
            continue
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"]
    resp.raise_for_status()
    return resp.json()["choices"][0]["message"]["content"]


def _call_llm(messages):
    """Return (text, model_name). Tries Anthropic → OpenAI → fallback."""
    anthropic_key = current_app.config.get("ANTHROPIC_API_KEY", "")
    openai_key    = current_app.config.get("OPENAI_API_KEY", "")
    anthropic_model = current_app.config.get("ANTHROPIC_MODEL", "claude-haiku-4-5-20251001")
    openai_model    = current_app.config.get("OPENAI_MODEL", "gpt-4o-mini")
    openai_base_url = current_app.config.get("OPENAI_BASE_URL", "https://api.openai.com/v1")

    if anthropic_key:
        try:
            return _call_anthropic(messages, anthropic_key, anthropic_model), anthropic_model
        except Exception as exc:
            current_app.logger.error("Anthropic failed: %s", exc)

    if openai_key:
        try:
            return _call_openai(messages, openai_key, openai_model, openai_base_url), openai_model
        except Exception as exc:
            current_app.logger.error("OpenAI-compatible call failed (%s): %s", openai_base_url, exc)

    return _FALLBACK


def _strip_json_fence(text):
    """Remove ```json ... ``` or ``` ... ``` wrappers if present."""
    text = text.strip()
    if text.startswith("```"):
        lines = text.split("\n")
        start = 1 if lines[0].startswith("```") else 0
        end = len(lines) - 1 if lines[-1].strip() == "```" else len(lines)
        text = "\n".join(lines[start:end]).strip()
    return text


def _call_llm_json(system_text, user_text, fallback):
    """Call LLM requesting JSON output, parse it. Returns (dict, model_name)."""
    messages = [
        {"role": "system", "content": system_text},
        {"role": "user",   "content": user_text},
    ]
    raw, model = _call_llm(messages)
    if model == "unavailable":
        return fallback, model
    try:
        return json.loads(_strip_json_fence(raw)), model
    except (json.JSONDecodeError, ValueError):
        start = raw.find("{")
        end   = raw.rfind("}") + 1
        if start != -1 and end > start:
            try:
                return json.loads(raw[start:end]), model
            except (json.JSONDecodeError, ValueError):
                pass
        return fallback, model


def is_it_related(question):
    """Return True if the question is IT / tech support related."""
    system = (
        "You classify user questions. Respond with valid JSON only — no extra text."
    )
    user = f"""Is this question related to IT, technology, software, hardware, networking,
accounts, passwords, billing, or technical support?

Question: {question}

Return JSON: {{"it_related": true}} or {{"it_related": false}}"""
    data, model = _call_llm_json(system, user, {"it_related": True})
    if model == "unavailable":
        return True  # default to storing if classifier is unavailable
    return bool(data.get("it_related", True))


def build_prompt(question, context_chunks):
    if context_chunks:
        context_block = "Context:\n" + "\n\n".join(f"- {c}" for c in context_chunks) + "\n\n"
    else:
        context_block = ""
    return [
        {"role": "system", "content": SYSTEM_PROMPT},
        {
            "role": "user",
            "content": f"{context_block}Question:\n{question}",
        },
    ]


def generate_response(question, ticket_id=None, top_k=4):
    """Answer using KB + live web search. Logs only IT-related questions."""
    it_related = is_it_related(question)

    kb_chunks = retrieve_context(question, top_k=top_k)
    web_chunks = web_search(question, max_results=4)
    all_chunks = kb_chunks + web_chunks

    messages = build_prompt(question, all_chunks)
    answer, model = _call_llm(messages)

    if it_related:
        log = AILog(
            ticket_id=ticket_id,
            prompt=messages[-1]["content"],
            response=answer,
            model_used=model,
        )
        db.session.add(log)
        try:
            db.session.commit()
        except Exception:
            db.session.rollback()

    return {
        "answer": answer,
        "model": model,
        "context_used": all_chunks,
        "it_related": it_related,
    }


def generate_kb_article(question, answer):
    system = (
        "You are a technical writer creating knowledge base articles. "
        "Respond with valid JSON only — no markdown fences, no extra text."
    )
    user = f"""Create a knowledge base article from this question and answer.

Question: {question}
Answer: {answer}

Return a JSON object with these exact keys:
- "title": a clear, searchable article title (string)
- "content": 2-3 paragraphs explaining the topic clearly (string)
- "category": one of FAQ, Account, Billing, Technical, General (string)
- "tags": 3-5 relevant keywords, comma-separated (string)"""

    fallback = {
        "title": question[:120],
        "content": answer,
        "category": "FAQ",
        "tags": "ai-generated,faq",
    }
    data, _ = _call_llm_json(system, user, fallback)
    data.setdefault("title",    question[:120])
    data.setdefault("content",  answer)
    data.setdefault("category", "FAQ")
    tags = data.get("tags", "ai-generated")
    if "ai-generated" not in tags:
        tags += ",ai-generated"
    data["tags"] = tags
    return data


def generate_blog_post(question, answer):
    system = (
        "You are a friendly content writer for a help desk blog. "
        "Respond with valid JSON only — no markdown fences, no extra text."
    )
    user = f"""Write an engaging blog post based on this question and answer.

Question: {question}
Answer: {answer}

Return a JSON object with these exact keys:
- "title": an engaging, friendly blog title (string)
- "content": a full blog post using markdown (## headers). ~300 words (string)
- "summary": a 1-2 sentence preview (string)"""

    fallback = {
        "title": f"Understanding: {question[:80]}",
        "content": (
            f"## Overview\n\n{answer}\n\n"
            "## Why This Matters\n\nUnderstanding this topic helps you get the most out of our service.\n\n"
            "## Need More Help?\n\nOur support team is always here for you."
        ),
        "summary": answer[:200],
    }
    data, _ = _call_llm_json(system, user, fallback)
    data.setdefault("title",   f"Understanding: {question[:80]}")
    data.setdefault("content", answer)
    data.setdefault("summary", answer[:200])
    return data


def _normalize_tag(raw):
    """lowercase, hyphenated, alnum-only slug; '' if nothing usable."""
    t = str(raw).strip().lower().lstrip("#")
    t = re.sub(r"\s+", "-", t)
    t = re.sub(r"[^a-z0-9-]", "", t).strip("-")
    return t[:30]


def extract_post_tags(subject, description, existing_tags=None, max_tags=3):
    """Find a post's main focus and return topic tags, reusing existing tags
    when they fit. Returns a list (primary tag first); empty if AI unavailable."""
    existing = sorted(existing_tags or [])
    existing_str = ", ".join(existing) if existing else "(none yet)"
    system = (
        "You label technical community posts with concise topic tags. "
        "Respond with valid JSON only — no markdown, no extra text."
    )
    user = f"""Post title: {subject}
Post body: {(description or '')[:1500]}

Existing tags already used on the site: {existing_str}

Identify the SINGLE main focus of this post, plus up to {max_tags - 1} clearly-present
secondary topics. Rules:
- If an existing tag fits the topic, REUSE it exactly.
- Otherwise create a concise new tag: lowercase, one or two words, hyphenated, no '#'.
- Tags describe the technical subject (e.g. "kubernetes", "password-reset", "react").
Return JSON: {{"tags": ["primary", "secondary"]}} — 1 to {max_tags} tags, primary first."""

    data, model = _call_llm_json(system, user, {"tags": []})
    if model == "unavailable":
        return []

    seen, clean = set(), []
    # Map normalized existing tags back to their canonical form for exact reuse.
    canon = {_normalize_tag(t): t for t in existing}
    for raw in (data.get("tags") or [])[:max_tags]:
        norm = _normalize_tag(raw)
        if not norm or norm in seen:
            continue
        seen.add(norm)
        clean.append(canon.get(norm, norm))
    return clean


def check_originality(subject, description, candidates):
    """Judge whether a new post copies existing site content, and suggest credits.

    candidates: list of {"ref": str, "text": str} (existing posts / KB articles).
    Returns {"flagged": bool, "reason": str, "credits": [str, ...]} or {} if AI is off.
    """
    if not (subject or description):
        return {}
    cand_str = "\n\n".join(f"[{c['ref']}]\n{(c['text'] or '')[:600]}" for c in candidates) or "(no similar content found)"
    system = (
        "You are a content-integrity assistant for a tech Q&A community. "
        "Respond with valid JSON only — no markdown, no extra text."
    )
    user = f"""New post:
Title: {subject}
Body: {(description or '')[:1800]}

Existing site content to compare against:
{cand_str}

Tasks:
1. Decide if the new post is substantially COPIED from, or a near-duplicate of, any item above.
2. Suggest source attributions ONLY if the post clearly quotes or closely paraphrases a
   well-known external source (official docs, a standard, a famous article). Be conservative —
   do not invent sources or URLs.

Return JSON:
{{"flagged": true|false, "duplicate_of": "ref or null", "reason": "one short sentence", "credits": ["source", ...]}}
- flagged=true ONLY for a clear copy / near-duplicate of a listed item.
- credits: 0-3 short attribution strings like "MDN Web Docs — Array.prototype.map"; [] if none."""

    data, model = _call_llm_json(system, user, {})
    if model == "unavailable" or not isinstance(data, dict):
        return {}
    flagged = bool(data.get("flagged"))
    reason = str(data.get("reason") or "").strip()[:300]
    dup = data.get("duplicate_of")
    if flagged and dup and str(dup).lower() != "null" and "duplicate" not in reason.lower():
        reason = (f"Possible duplicate of {dup}. " + reason).strip()
    credits = []
    for c in (data.get("credits") or [])[:3]:
        c = str(c).strip()
        if c and c.lower() not in ("none", "n/a"):
            credits.append(c[:160])
    return {"flagged": flagged, "reason": reason, "credits": credits}


def summarize_conversation(messages):
    text = "\n".join(f"{m.get('sender','')}: {m.get('message','')}" for m in messages)
    prompt = [
        {"role": "system", "content": "Summarize this support conversation in 2-3 sentences."},
        {"role": "user",   "content": text},
    ]
    answer, model = _call_llm(prompt)
    return {"summary": answer, "model": model}


def suggest_resolution(ticket_subject, ticket_description):
    chunks = retrieve_context(f"{ticket_subject} {ticket_description}", top_k=3)
    prompt = [
        {"role": "system", "content": "Suggest 3 concrete resolution steps for this support question using the context."},
        {
            "role": "user",
            "content": f"Context:\n{chr(10).join(chunks)}\n\nQuestion: {ticket_subject}\n{ticket_description}",
        },
    ]
    answer, model = _call_llm(prompt)
    return {"steps": answer, "model": model, "context_used": chunks}
