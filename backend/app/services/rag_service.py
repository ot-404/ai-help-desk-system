"""Lightweight retrieval over the knowledge base.

Uses keyword/word-overlap scoring so it works with zero external services.
Swap `retrieve_context` for a vector DB (Pinecone/Qdrant/FAISS) in production.
"""
import re
from app.models.kb_model import KnowledgeBase


def _tokenize(text):
    return set(re.findall(r"[a-z0-9]+", (text or "").lower()))


def retrieve_context(query, top_k=4):
    q_tokens = _tokenize(query)
    if not q_tokens:
        return []
    scored = []
    for article in KnowledgeBase.query.all():
        doc_tokens = _tokenize(article.title + " " + article.content + " " + article.tags)
        if not doc_tokens:
            continue
        overlap = len(q_tokens & doc_tokens)
        if overlap:
            score = overlap / (len(q_tokens) ** 0.5)
            scored.append((score, article))
    scored.sort(key=lambda x: x[0], reverse=True)
    return [f"{a.title}: {a.content}" for _, a in scored[:top_k]]
