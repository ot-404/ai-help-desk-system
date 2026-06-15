"""LLM integration + AI workflow.

Supports Anthropic (claude-haiku-4-5) and OpenAI (gpt-4o-mini).
Priority: ANTHROPIC_API_KEY → OPENAI_API_KEY → mock model.

Workflow:
  user submits ticket -> build prompt context -> send to LLM
  -> generate AI response -> store logs -> return response
"""
import json
from flask import current_app
from app import db
from app.models.ai_logs_model import AILog
from app.services.rag_service import retrieve_context

SYSTEM_PROMPT = (
    "You are a helpful, accurate support assistant for a help desk. "
    "Answer using ONLY the provided knowledge base context. If the answer "
    "is not in the context, say you are not sure and suggest escalation to "
    "a human agent. Be concise and friendly."
)


def _call_llm(messages):
    """Return (text, model_name). Tries Anthropic → OpenAI → mock."""
    anthropic_key = current_app.config.get("ANTHROPIC_API_KEY")
    openai_key = current_app.config.get("OPENAI_API_KEY")

    # --- Anthropic (Claude) ---
    if anthropic_key:
        try:
            import anthropic
            client = anthropic.Anthropic(api_key=anthropic_key)
            model = current_app.config.get("ANTHROPIC_MODEL", "claude-haiku-4-5-20251001")
            system = next((m["content"] for m in messages if m["role"] == "system"), "")
            user_msgs = [m for m in messages if m["role"] != "system"]
            resp = client.messages.create(
                model=model,
                max_tokens=1024,
                system=system,
                messages=user_msgs,
            )
            return resp.content[0].text, model
        except Exception as exc:
            current_app.logger.error("Anthropic call failed: %s", exc)
            # fall through to OpenAI

    # --- OpenAI ---
    if openai_key:
        try:
            from openai import OpenAI
            model = current_app.config.get("OPENAI_MODEL", "gpt-4o-mini")
            client = OpenAI(api_key=openai_key)
            resp = client.chat.completions.create(
                model=model, messages=messages, temperature=0.3
            )
            return resp.choices[0].message.content, model
        except Exception as exc:
            current_app.logger.error("OpenAI call failed: %s", exc)
            # fall through to fallback

    # --- Fallback (no key configured or all providers failed) ---
    return (
        "Our AI assistant is temporarily unavailable. A support agent has been notified "
        "and will respond to your question shortly. We apologize for the inconvenience.",
        "unavailable",
    )


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
        {"role": "user", "content": user_text},
    ]
    raw, model = _call_llm(messages)
    if model == "mock" or model.startswith("["):
        return fallback, model
    try:
        return json.loads(_strip_json_fence(raw)), model
    except (json.JSONDecodeError, ValueError):
        # Try to extract JSON from the text
        start = raw.find("{")
        end = raw.rfind("}") + 1
        if start != -1 and end > start:
            try:
                return json.loads(raw[start:end]), model
            except (json.JSONDecodeError, ValueError):
                pass
        return fallback, model


def build_prompt(question, context_chunks):
    context = "\n\n".join(f"- {c}" for c in context_chunks) or "(no context found)"
    return [
        {"role": "system", "content": SYSTEM_PROMPT},
        {
            "role": "user",
            "content": f"Knowledge base context:\n{context}\n\nUser question:\n{question}",
        },
    ]


def generate_response(question, ticket_id=None, top_k=4):
    """Full RAG answer flow with logging."""
    chunks = retrieve_context(question, top_k=top_k)
    messages = build_prompt(question, chunks)
    answer, model = _call_llm(messages)

    log = AILog(
        ticket_id=ticket_id,
        prompt=messages[-1]["content"],
        response=answer,
        model_used=model,
    )
    db.session.add(log)
    db.session.commit()
    return {"answer": answer, "model": model, "context_used": chunks}


def generate_kb_article(question, answer):
    """Format a Q&A pair into a structured KB article dict."""
    system = (
        "You are a technical writer creating knowledge base articles. "
        "Respond with valid JSON only — no markdown fences, no extra text."
    )
    user = f"""Create a knowledge base article from this question and answer.

Question: {question}
Answer: {answer}

Return a JSON object with these exact keys:
- "title": a clear, searchable article title (string)
- "content": 2-3 paragraphs explaining the topic clearly, using the answer as the basis (string)
- "category": one of FAQ, Account, Billing, Technical, General (string)
- "tags": 3-5 relevant keywords, comma-separated (string)"""

    fallback = {
        "title": question[:120],
        "content": answer,
        "category": "FAQ",
        "tags": "ai-generated,faq",
    }
    data, _ = _call_llm_json(system, user, fallback)
    data.setdefault("title", question[:120])
    data.setdefault("content", answer)
    data.setdefault("category", "FAQ")
    tags = data.get("tags", "ai-generated")
    if "ai-generated" not in tags:
        tags = tags + ",ai-generated"
    data["tags"] = tags
    return data


def generate_blog_post(question, answer):
    """Format a Q&A pair into a blog post dict."""
    system = (
        "You are a friendly content writer for a help desk blog. "
        "Respond with valid JSON only — no markdown fences, no extra text."
    )
    user = f"""Write an engaging blog post based on this question and answer.

Question: {question}
Answer: {answer}

Return a JSON object with these exact keys:
- "title": an engaging, friendly blog title (string)
- "content": a full blog post using markdown formatting (## for section headers). Include an intro, 2-3 sections expanding on the answer, and a short conclusion. Around 300-400 words (string)
- "summary": a 1-2 sentence preview of the post (string)"""

    fallback = {
        "title": f"Understanding: {question[:80]}",
        "content": (
            f"## Overview\n\n{answer}\n\n"
            "## Why This Matters\n\nUnderstanding this topic helps you get the most out of our service.\n\n"
            "## Need More Help?\n\nIf you have follow-up questions, our support team is always here for you."
        ),
        "summary": answer[:200],
    }
    data, _ = _call_llm_json(system, user, fallback)
    data.setdefault("title", f"Understanding: {question[:80]}")
    data.setdefault("content", answer)
    data.setdefault("summary", answer[:200])
    return data


def summarize_conversation(messages):
    text = "\n".join(f"{m.get('sender','')}: {m.get('message','')}" for m in messages)
    prompt = [
        {"role": "system", "content": "Summarize this support conversation in 2-3 sentences."},
        {"role": "user", "content": text},
    ]
    answer, model = _call_llm(prompt)
    return {"summary": answer, "model": model}


def suggest_resolution(ticket_subject, ticket_description):
    chunks = retrieve_context(f"{ticket_subject} {ticket_description}", top_k=3)
    prompt = [
        {"role": "system", "content": "Suggest 3 concrete resolution steps for this ticket using the context."},
        {
            "role": "user",
            "content": f"Context:\n{chr(10).join(chunks)}\n\nTicket: {ticket_subject}\n{ticket_description}",
        },
    ]
    answer, model = _call_llm(prompt)
    return {"steps": answer, "model": model, "context_used": chunks}
