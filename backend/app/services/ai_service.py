"""LLM integration + AI workflow.

Workflow (from the project blueprint):
  user submits ticket -> build prompt context -> send to LLM
  -> generate AI response -> store logs -> return response

If OPENAI_API_KEY is not configured, a deterministic mock model is used
so the whole flow runs without external dependencies.
"""
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
    """Return (text, model_name). Falls back to a mock model."""
    api_key = current_app.config.get("OPENAI_API_KEY")
    model = current_app.config.get("OPENAI_MODEL", "gpt-4o-mini")
    if not api_key:
        user_msg = next(
            (m["content"] for m in reversed(messages) if m["role"] == "user"), ""
        )
        return (
            "[mock model] Based on our knowledge base, here is guidance for: "
            + user_msg[:160]
            + " ... (set OPENAI_API_KEY to enable a live model).",
            "mock",
        )
    try:
        from openai import OpenAI

        client = OpenAI(api_key=api_key)
        resp = client.chat.completions.create(
            model=model, messages=messages, temperature=0.2
        )
        return resp.choices[0].message.content, model
    except Exception as exc:  # pragma: no cover - network/dep guard
        return (f"[fallback] LLM call failed: {exc}", "error")


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
