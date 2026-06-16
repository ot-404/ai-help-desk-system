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
    <div style={s.page}>
      <div style={s.main}>
        <Link to="/" style={s.back}>← Back to questions</Link>
        <h1 style={s.heading}>Ask a Question</h1>

        <form onSubmit={handleSubmit} style={s.form}>
          <section style={s.card}>
            <label style={s.label}>Title</label>
            <div style={s.hint}>Be specific and imagine you're asking a question to another person.</div>
            <input
              style={s.titleInput}
              placeholder="e.g. How do I reset my account password?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
            />
          </section>

          <section style={s.card}>
            <label style={s.label}>Body</label>
            <div style={s.hint}>Include all the information someone would need to answer your question.</div>
            <textarea
              style={s.body}
              placeholder="Describe what you've tried and what you expect to happen…"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
            />
          </section>

          <section style={s.card}>
            <label style={s.label}>Tags</label>
            <div style={s.hint}>Add up to 5 tags to describe what your question is about.</div>
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
          </section>

          {error && <div style={s.error}>{error}</div>}
          <div>
            <button type="submit" style={s.submit} disabled={submitting}>{submitting ? "Posting…" : "Post Your Question"}</button>
          </div>
        </form>
      </div>

      <aside style={s.side}>
        <div style={s.tipsCard}>
          <div style={s.tipsTitle}>Writing a good question</div>
          <ul style={s.tips}>
            <li style={s.tip}>Summarize the problem in the title.</li>
            <li style={s.tip}>Describe what you've tried and expected.</li>
            <li style={s.tip}>Add relevant tags so the right people find it.</li>
            <li style={s.tip}>Proofread before posting.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

const s = {
  page: { display: "flex", gap: 20, alignItems: "flex-start" },
  main: { flex: 1, minWidth: 0, maxWidth: 740 },
  side: { width: 260, flexShrink: 0 },
  back: { color: C.muted, textDecoration: "none", fontSize: 13, display: "block", marginBottom: 12 },
  heading: { fontSize: 26, fontWeight: 500, color: C.text, margin: "0 0 18px" },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  card: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: 18 },
  label: { fontSize: 15, fontWeight: 600, color: C.text, display: "block" },
  hint: { fontSize: 12, color: C.muted, margin: "4px 0 12px" },
  titleInput: { width: "100%", fontSize: 15, padding: "10px 12px", border: `1px solid #babfc4`, borderRadius: 4, boxSizing: "border-box", fontFamily: "inherit", color: C.text },
  body: { width: "100%", fontSize: 15, padding: "10px 12px", border: `1px solid #babfc4`, borderRadius: 4, resize: "vertical", fontFamily: "inherit", boxSizing: "border-box", color: C.text, lineHeight: 1.6 },
  tagBox: { display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", border: `1px solid #babfc4`, borderRadius: 4, padding: "8px 10px" },
  tagChip: { display: "inline-flex", alignItems: "center", gap: 4, background: C.tag, color: C.tagText, border: `1px solid #a4c2d9`, fontSize: 13, padding: "3px 8px", borderRadius: 3 },
  tagX: { background: "none", border: "none", color: C.tagText, fontSize: 15, lineHeight: 1, padding: 0, cursor: "pointer" },
  tagInput: { flex: 1, minWidth: 140, border: "none", fontSize: 14, padding: "4px 2px", outline: "none" },
  error: { background: "#fdf2f2", border: `1px solid #f5c6cb`, borderRadius: 4, padding: "10px 14px", fontSize: 14, color: C.red },
  submit: { background: C.primary, color: "#fff", border: "none", borderRadius: 4, padding: "11px 16px", fontSize: 14, fontWeight: 500, cursor: "pointer" },
  tipsCard: { background: "#fdf7e3", border: `1px solid #e6d8a8`, borderRadius: 6, padding: 16, position: "sticky", top: 76 },
  tipsTitle: { fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 10 },
  tips: { margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8 },
  tip: { fontSize: 13, color: C.muted, lineHeight: 1.4 },
};
