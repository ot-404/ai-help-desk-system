import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/client";
import { C } from "../../theme";

export default function NewTicket() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function addTag(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      const t = tagInput.trim().replace(/^#/, "");
      if (t && !tags.includes(t) && tags.length < 5) setTags((p) => [...p, t]);
      setTagInput("");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) { setError("Please enter a title."); return; }
    if (!body.trim()) { setError("Please describe your question."); return; }
    setSubmitting(true);
    setError("");
    const description = [
      tags.length ? `Tags: ${tags.join(", ")}` : "",
      "",
      body,
    ].filter(Boolean).join("\n");
    try {
      const { data } = await api.post("/tickets/", { subject: title, description, priority: "medium" });
      navigate(`/question/${data.ticket.id}`);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to post. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <Link to="/" style={s.back}>← Back to Questions</Link>
      <h1 style={s.heading}>Ask a Question</h1>

      <form onSubmit={handleSubmit} style={s.form}>
        <div>
          <label style={s.label}>Title</label>
          <input
            style={s.titleInput}
            placeholder="e.g. How do I reset my account password?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
          />
        </div>

        <div>
          <label style={s.label}>Details</label>
          <textarea
            style={s.body}
            placeholder="Describe what you've tried and what you expect to happen…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>

        <div>
          <label style={s.label}>Tags</label>
          <div style={s.tagBox}>
            {tags.map((t) => (
              <span key={t} style={s.tagChip}>{t}
                <button type="button" style={s.tagX} onClick={() => setTags((p) => p.filter((x) => x !== t))}>×</button>
              </span>
            ))}
            {tags.length < 5 && (
              <input style={s.tagInput} placeholder="Add a tag, press Enter" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={addTag} />
            )}
          </div>
        </div>

        {error && <div style={s.error}>{error}</div>}
        <div>
          <button type="submit" style={s.submit} disabled={submitting}>{submitting ? "Posting…" : "Post Your Question"}</button>
        </div>
      </form>

      <div style={s.tipsCard}>
        <strong style={s.tipsTitle}>Writing a good question</strong>
        <span style={s.tipsText}> Be specific. Include error messages. Describe what you tried.</span>
      </div>
    </div>
  );
}

const s = {
  back: { color: C.muted, textDecoration: "none", fontSize: 13, display: "block", marginBottom: 12 },
  heading: { fontSize: 20, fontWeight: 600, color: C.text, margin: "0 0 18px" },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  label: { fontSize: 14, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 },
  titleInput: { width: "100%", height: 42, fontSize: 16, padding: "0 12px", border: `1px solid ${C.border}`, borderRadius: 6, boxSizing: "border-box", fontFamily: "inherit", color: C.text },
  body: { width: "100%", minHeight: 200, fontSize: 16, padding: "10px 12px", border: `1px solid ${C.border}`, borderRadius: 6, resize: "vertical", fontFamily: "inherit", boxSizing: "border-box", color: C.text, lineHeight: 1.6 },
  tagBox: { display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", border: `1px solid ${C.border}`, borderRadius: 6, padding: "8px 10px", minHeight: 40, boxSizing: "border-box" },
  tagChip: { display: "inline-flex", alignItems: "center", gap: 4, background: C.tag, color: C.tagText, border: `1px solid ${C.tagBorder}`, fontSize: 13, padding: "3px 8px", borderRadius: 4 },
  tagX: { background: "none", border: "none", color: C.tagText, fontSize: 15, lineHeight: 1, padding: 0, cursor: "pointer" },
  tagInput: { flex: 1, minWidth: 140, border: "none", fontSize: 16, padding: "4px 2px", outline: "none" },
  error: { background: "#fff5f5", border: `1px solid #fed7d7`, borderRadius: 6, padding: "10px 14px", fontSize: 14, color: C.danger },
  submit: { background: C.primary, color: "#fff", border: "none", borderRadius: 6, padding: "11px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer", minHeight: 40 },
  tipsCard: { background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: 14, marginTop: 20, fontSize: 13, color: C.muted, lineHeight: 1.6 },
  tipsTitle: { color: C.text },
  tipsText: {},
};
