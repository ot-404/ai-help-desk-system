"""Knowledge Base endpoints: list/retrieve, add, update, file upload."""
import io
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models.kb_model import KnowledgeBase
from app.services.rag_service import retrieve_context
from app.utils.auth_helpers import role_required

kb_bp = Blueprint("kb", __name__)


def _parse_pdf(file_bytes):
    try:
        from pypdf import PdfReader
        reader = PdfReader(io.BytesIO(file_bytes))
        return "\n\n".join(page.extract_text() or "" for page in reader.pages).strip()
    except Exception as e:
        raise ValueError(f"PDF parse error: {e}")


def _parse_docx(file_bytes):
    try:
        import docx
        doc = docx.Document(io.BytesIO(file_bytes))
        return "\n\n".join(p.text for p in doc.paragraphs if p.text.strip())
    except Exception as e:
        raise ValueError(f"DOCX parse error: {e}")


def _parse_txt(file_bytes):
    return file_bytes.decode("utf-8", errors="replace").strip()


@kb_bp.get("/")
def list_articles():
    sort = request.args.get("sort", "newest")  # newest | votes | views
    q = KnowledgeBase.query
    if sort == "votes":
        q = q.order_by(KnowledgeBase.vote_count.desc())
    elif sort == "views":
        q = q.order_by(KnowledgeBase.views.desc())
    else:
        q = q.order_by(KnowledgeBase.created_at.desc())
    return jsonify([a.to_dict() for a in q.all()])


@kb_bp.get("/search")
def search():
    q = request.args.get("q", "").strip()
    if not q:
        return jsonify([a.to_dict() for a in KnowledgeBase.query.order_by(KnowledgeBase.created_at.desc()).all()])
    # Score all articles by keyword overlap and return full objects
    import re
    q_tokens = set(re.findall(r"[a-z0-9]+", q.lower()))
    scored = []
    for a in KnowledgeBase.query.all():
        doc = (a.title or "") + " " + (a.content or "") + " " + (a.tags or "")
        doc_tokens = set(re.findall(r"[a-z0-9]+", doc.lower()))
        overlap = len(q_tokens & doc_tokens)
        if overlap:
            scored.append((overlap, a))
    scored.sort(key=lambda x: x[0], reverse=True)
    return jsonify([a.to_dict() for _, a in scored])


@kb_bp.get("/<int:kb_id>")
def get_article(kb_id):
    a = KnowledgeBase.query.get(kb_id)
    if not a:
        return jsonify(error="not found"), 404
    a.views = (a.views or 0) + 1
    db.session.commit()
    return jsonify(a.to_dict())


@kb_bp.post("/<int:kb_id>/vote")
@jwt_required()
def vote_article(kb_id):
    data = request.get_json() or {}
    direction = data.get("direction")  # "up" or "down"
    if direction not in ("up", "down"):
        return jsonify(error="direction must be 'up' or 'down'"), 400
    a = KnowledgeBase.query.get(kb_id)
    if not a:
        return jsonify(error="not found"), 404
    a.vote_count = (a.vote_count or 0) + (1 if direction == "up" else -1)
    db.session.commit()
    return jsonify(vote_count=a.vote_count)


@kb_bp.post("/")
@role_required("agent", "admin")
def add_article():
    data = request.get_json() or {}
    if not data.get("title") or not data.get("content"):
        return jsonify(error="title and content are required"), 400
    tags = data.get("tags", "")
    if isinstance(tags, list):
        tags = ",".join(tags)
    article = KnowledgeBase(
        title=data["title"],
        content=data["content"],
        category=data.get("category", ""),
        tags=tags,
    )
    db.session.add(article)
    db.session.commit()
    return jsonify(article.to_dict()), 201


@kb_bp.put("/<int:kb_id>")
@role_required("agent", "admin")
def update_article(kb_id):
    a = KnowledgeBase.query.get(kb_id)
    if not a:
        return jsonify(error="not found"), 404
    data = request.get_json() or {}
    for field in ("title", "content", "category"):
        if field in data:
            setattr(a, field, data[field])
    if "tags" in data:
        a.tags = ",".join(data["tags"]) if isinstance(data["tags"], list) else data["tags"]
    db.session.commit()
    return jsonify(a.to_dict())


@kb_bp.delete("/<int:kb_id>")
@role_required("agent", "admin")
def delete_article(kb_id):
    a = KnowledgeBase.query.get(kb_id)
    if not a:
        return jsonify(error="not found"), 404
    db.session.delete(a)
    db.session.commit()
    return jsonify(message="deleted")


@kb_bp.post("/upload")
@role_required("agent", "admin")
def upload_file():
    """Parse a PDF, DOCX, or TXT file and create a KB article from it."""
    if "file" not in request.files:
        return jsonify(error="no file provided"), 400

    f = request.files["file"]
    filename = f.filename or ""
    file_bytes = f.read()

    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    try:
        if ext == "pdf":
            content = _parse_pdf(file_bytes)
        elif ext in ("docx", "doc"):
            content = _parse_docx(file_bytes)
        elif ext == "txt":
            content = _parse_txt(file_bytes)
        else:
            return jsonify(error="Unsupported file type. Use PDF, DOCX, or TXT."), 400
    except ValueError as e:
        return jsonify(error=str(e)), 422

    if not content:
        return jsonify(error="Could not extract text from file"), 422

    title = request.form.get("title") or filename.rsplit(".", 1)[0].replace("_", " ").replace("-", " ").title()
    category = request.form.get("category", "")

    article = KnowledgeBase(title=title, content=content, category=category, tags=ext)
    db.session.add(article)
    db.session.commit()
    return jsonify(article.to_dict()), 201
