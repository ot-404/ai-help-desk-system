import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/client";
import { C, COMMUNITIES } from "../../theme";

const TYPES = ["Discussion", "Q&A", "Blog", "Tutorial"];

export default function NewTicket() {
  const navigate = useNavigate();
  const [type, setType] = useState("Q&A");
  const [community, setCommunity] = useState(COMMUNITIES[0]);
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
      if (t && !tags.includes(t)) setTags((p) => [...p, t]);
      setTagInput("");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) { setError("Please enter a title."); return; }
    setSubmitting(true);
    setError("");
    const description = [
      `[${type}] · r/${community}`,
      tags.length ? `Tags: ${tags.map((t) => "#" + t).join(" ")}` : "",
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
      <Link to="/" style={s.back}>← Back to feed</Link>
      <h1 style={s.heading}>Create Post</h1>

      <div style={s.card}>
        <div style={s.typeTabs}>
          {TYPES.map((t) => (
            <button key={t} type="button" onClick={() => setType(t)} style={{ ...s.typeTab, ...(type === t ? s.typeActive : {}) }}>{t}</button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Community</label>
            <select style={s.select} value={community} onChange={(e) => setCommunity(e.target.value)}>
              {COMMUNITIES.map((c) => <option key={c} value={c}>r/{c}</option>)}
            </select>
          </div>

          <input style={s.titleInput} placeholder="An interesting title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} />

          <div style={s.field}>
            <label style={s.label}>Tags</label>
            <div style={s.tagBox}>
              {tags.map((t) => (
                <span key={t} style={s.tagChip}>#{t}
                  <button type="button" style={s.tagX} onClick={() => setTags((p) => p.filter((x) => x !== t))}>×</button>
                </span>
              ))}
              <input style={s.tagInput} placeholder="Add tag, press Enter" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={addTag} />
            </div>
          </div>

          <textarea style={s.body} placeholder="Share your thoughts, code, or question…" value={body} onChange={(e) => setBody(e.target.value)} rows={8} />

          {error && <div style={s.error}>{error}</div>}
          <button type="submit" style={s.submit} disabled={submitting || !title.trim()}>{submitting ? "Posting…" : "Post"}</button>
        </form>
      </div>
    </div>
  );
}

const s = {
  page: { maxWidth: 700, margin: "0 auto" },
  back: { color: C.muted, textDecoration: "none", fontSize: 13, display: "block", marginBottom: 14 },
  heading: { fontSize: 24, fontWeight: 800, color: C.text, margin: "0 0 16px" },
  card: { background: C.surface, border: "1px solid " + C.border, borderRadius: 10, padding: 22 },
  typeTabs: { display: "flex", gap: 6, marginBottom: 18, borderBottom: "1px solid " + C.border, paddingBottom: 14 },
  typeTab: { background: C.bg, border: "none", color: C.muted, padding: "8px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600 },
  typeActive: { background: C.primary, color: "#fff" },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: C.muted },
  select: { height: 42, borderRadius: 8, border: "1px solid " + C.border, padding: "0 12px", fontSize: 14, background: "#fff" },
  titleInput: { width: "100%", fontSize: 18, padding: "12px 14px", border: "1px solid " + C.border, borderRadius: 8, boxSizing: "border-box", fontFamily: "inherit", fontWeight: 600, color: C.text },
  tagBox: { display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", border: "1px solid " + C.border, borderRadius: 8, padding: "8px 10px" },
  tagChip: { display: "inline-flex", alignItems: "center", gap: 4, background: C.tagBg, color: C.tagText, fontSize: 13, fontWeight: 600, padding: "3px 8px", borderRadius: 6 },
  tagX: { background: "none", border: "none", color: C.tagText, fontSize: 15, lineHeight: 1, padding: 0 },
  tagInput: { flex: 1, minWidth: 120, border: "none", fontSize: 14, padding: "4px 2px" },
  body: { width: "100%", fontSize: 15, padding: "12px 14px", border: "1px solid " + C.border, borderRadius: 8, resize: "vertical", fontFamily: "inherit", boxSizing: "border-box", color: C.text, lineHeight: 1.6 },
  error: { background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: 8, padding: "10px 14px", fontSize: 14, color: "#c53030" },
  submit: { background: C.primary, color: "#fff", border: "none", borderRadius: 8, padding: "13px 0", fontSize: 15, fontWeight: 700, width: "100%" },
};
