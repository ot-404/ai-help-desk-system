import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";
import { C, POST_TYPES, TOPICS } from "../../theme";

const PLACEHOLDERS = {
  "Question": "e.g. How do I fix a Kubernetes CrashLoopBackOff?",
  "Discussion": "e.g. Is microservices overkill for small teams?",
  "Tutorial": "e.g. How to set up CI/CD with GitHub Actions",
  "Anonymous Ask": "Ask anything — your identity stays hidden",
};

export default function NewTicket() {
  const navigate = useNavigate();
  const [type, setType] = useState("Question");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [body, setBody] = useState("");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [sugLoading, setSugLoading] = useState(false);
  const debounceRef = useRef(null);

  const isAnon = type === "Anonymous Ask";

  // Debounced FAQ search as user types title
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (title.trim().length < 5) { setSuggestions([]); return; }
    debounceRef.current = setTimeout(async () => {
      setSugLoading(true);
      try {
        const { data } = await api.get(`/kb/search?q=${encodeURIComponent(title)}`);
        const list = Array.isArray(data) ? data : (data.results || []);
        setSuggestions(list.slice(0, 3));
      } catch { setSuggestions([]); }
      finally { setSugLoading(false); }
    }, 500);
    return () => clearTimeout(debounceRef.current);
  }, [title]);

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
    if (!body.trim()) { setError("Please describe your post."); return; }
    setSubmitting(true);
    setError("");
    const description = [
      `Topic: ${topic}`,
      tags.length ? `Tags: ${tags.join(", ")}` : "",
      "",
      body,
    ].filter(Boolean).join("\n");
    try {
      const { data } = await api.post("/tickets/", {
        subject: title,
        description,
        priority: "medium",
        is_anonymous: isAnon,
      });
      navigate(`/question/${data.ticket.id}`);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to post. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 style={s.heading}>Create Post</h1>

      <div style={s.tabBar}>
        {POST_TYPES.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            style={{ ...s.tab, ...(type === t ? s.tabActive : {}) }}
          >
            {t}
          </button>
        ))}
      </div>

      {isAnon && (
        <div style={s.anonBox}>
          Your identity will be hidden. This is inspired by Ask.fm and Tellonym — ask anything without revealing who you are.
        </div>
      )}

      <form onSubmit={handleSubmit} style={s.card}>
        <input
          style={s.titleInput}
          placeholder={PLACEHOLDERS[type]}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
        />

        {/* AI suggestions */}
        {(sugLoading || suggestions.length > 0) && (
          <div style={s.sugBox}>
            <div style={s.sugHead}>
              <span style={s.sugIcon}>🤖</span>
              {sugLoading ? "Searching for similar questions…" : `${suggestions.length} similar answer${suggestions.length !== 1 ? "s" : ""} found in FAQs`}
            </div>
            {suggestions.map((a) => (
              <a key={a.id} href={`/faq`} target="_blank" rel="noreferrer" style={s.sugItem}>
                <strong>{a.title}</strong>
                <span style={s.sugExcerpt}>{(a.content || "").slice(0, 100)}…</span>
              </a>
            ))}
            {suggestions.length > 0 && (
              <div style={s.sugFooter}>Your question might already be answered above. Still post if you need more help.</div>
            )}
          </div>
        )}

        <textarea
          style={s.body}
          placeholder="Add details. Code is welcome — share what you tried and what you expect."
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

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

        <div>
          <label style={s.label}>Topic</label>
          <select style={s.select} value={topic} onChange={(e) => setTopic(e.target.value)}>
            {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {error && <div style={s.error}>{error}</div>}

        <div style={s.submitRow}>
          <button type="submit" style={s.submit} disabled={submitting}>{submitting ? "Posting…" : "Post"}</button>
        </div>
      </form>
    </div>
  );
}

const s = {
  heading: { fontSize: 20, fontWeight: 700, color: C.text, margin: "0 0 16px", borderBottom: `1px solid ${C.border}`, paddingBottom: 12, letterSpacing: -0.3 },
  tabBar: { display: "flex", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 14, overflowX: "auto" },
  tab: { flex: 1, minWidth: 110, background: "none", border: "none", borderBottom: "2px solid transparent", padding: "12px 8px", fontSize: 14, fontWeight: 600, color: C.muted, cursor: "pointer", whiteSpace: "nowrap" },
  tabActive: { color: C.primary, borderBottom: `2px solid ${C.primary}` },
  anonBox: { background: C.surfaceHover, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", fontSize: 13, color: C.muted, lineHeight: 1.5, marginBottom: 12 },
  card: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18, display: "flex", flexDirection: "column", gap: 16 },
  titleInput: { width: "100%", height: 46, fontSize: 16, padding: "0 14px", border: `1px solid ${C.border}`, borderRadius: 10, boxSizing: "border-box", fontFamily: "inherit", color: C.text },
  body: { width: "100%", minHeight: 280, fontSize: 16, padding: "12px 14px", border: `1px solid ${C.border}`, borderRadius: 10, resize: "vertical", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", boxSizing: "border-box", color: C.text, lineHeight: 1.6 },
  label: { fontSize: 13, fontWeight: 700, color: C.text, display: "block", marginBottom: 6 },
  tagBox: { display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 10px", minHeight: 44, boxSizing: "border-box" },
  tagChip: { display: "inline-flex", alignItems: "center", gap: 4, background: C.tag, color: C.tagText, fontSize: 13, padding: "3px 9px", borderRadius: 6 },
  tagX: { background: "none", border: "none", color: C.tagText, fontSize: 15, lineHeight: 1, padding: 0, cursor: "pointer" },
  tagInput: { flex: 1, minWidth: 140, border: "none", fontSize: 16, padding: "4px 2px", outline: "none" },
  select: { width: "100%", height: 46, fontSize: 16, padding: "0 12px", border: `1px solid ${C.border}`, borderRadius: 10, boxSizing: "border-box", background: C.surface, color: C.text },
  sugBox: { background: "#e3f2f6", border: "1px solid #bcdfe8", borderRadius: 10, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 },
  sugHead: { fontSize: 13, fontWeight: 700, color: C.purple, display: "flex", alignItems: "center", gap: 6 },
  sugIcon: { fontSize: 16 },
  sugItem: { display: "flex", flexDirection: "column", gap: 2, background: "#fff", borderRadius: 8, padding: "8px 11px", textDecoration: "none", border: "1px solid #e2d5f5", color: C.text },
  sugExcerpt: { fontSize: 12, color: C.muted, marginTop: 2, lineHeight: 1.4 },
  sugFooter: { fontSize: 11, color: "#6b9aa6", fontStyle: "italic" },
  error: { background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 14, color: C.danger },
  submitRow: { display: "flex", justifyContent: "flex-end" },
  submit: { background: C.gradient, color: "#fff", border: "none", borderRadius: 10, padding: "10px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer", minHeight: 40 },
};
