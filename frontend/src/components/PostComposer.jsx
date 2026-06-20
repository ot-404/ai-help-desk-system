import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import { C, POST_TYPES, TOPICS } from "../theme";

const PLACEHOLDERS = {
  "Question": "Ask anything… e.g. How do I solve a quadratic equation? What causes inflation? How do I reset my password?",
  "Discussion": "Start a discussion… e.g. What are the best study habits? Is remote work here to stay?",
  "Tutorial": "Share what you know… e.g. How to write a persuasive essay, How to budget your salary",
  "Anonymous Ask": "Ask anonymously — your identity stays hidden",
};

/**
 * Inline post composer. Collapses to a single prompt bar; expands into a full
 * form. On success calls onCreated(ticket) if provided, otherwise navigates to
 * the new post.
 */
export default function PostComposer({ onCreated }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("Question");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isAnon = type === "Anonymous Ask";

  // Guests: prompt to sign in.
  if (!user) {
    return (
      <div style={s.guest}>
        <span style={s.guestText}>Join the community to ask questions and share answers.</span>
        <Link to="/login?next=/" style={s.guestBtn}>Log in to post</Link>
      </div>
    );
  }

  const avatarChar = (user.name || user.email || "?")[0].toUpperCase();

  function reset() {
    setTitle(""); setBody(""); setTopic(TOPICS[0]); setType("Question");
    setError(""); setOpen(false);
  }

  async function submit(e) {
    e.preventDefault();
    if (!title.trim()) { setError("Please enter a title."); return; }
    if (!body.trim()) { setError("Please add some details."); return; }
    setSubmitting(true);
    setError("");
    const description = `Topic: ${topic}\n\n${body}`;
    try {
      const { data } = await api.post("/tickets/", {
        subject: title.trim(),
        description,
        priority: "medium",
        is_anonymous: isAnon,
      });
      const ticket = data.ticket;
      reset();
      if (onCreated) onCreated(ticket);
      else navigate(`/question/${ticket.id}`);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <div style={s.collapsed} onClick={() => setOpen(true)}>
        <div style={s.avatar}>{avatarChar}</div>
        <div style={s.prompt}>Create a post…</div>
        <div style={s.plusBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        </div>
      </div>
    );
  }

  return (
    <form style={s.card} onSubmit={submit}>
      <div style={s.tabBar}>
        {POST_TYPES.map((t) => (
          <button key={t} type="button" onClick={() => setType(t)}
            style={{ ...s.tab, ...(type === t ? s.tabActive : {}) }}>
            {t}
          </button>
        ))}
      </div>

      <input
        autoFocus
        style={s.titleInput}
        placeholder={PLACEHOLDERS[type]}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={200}
      />
      <textarea
        style={s.body}
        placeholder="Add more details… the more context you give, the better the answers you'll get."
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />

      <div style={s.row}>
        <select style={s.select} value={topic} onChange={(e) => setTopic(e.target.value)}>
          {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        {isAnon && (
          <span style={s.anonBadge}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><path d="M2 2l20 20" /></svg>
            Posting anonymously
          </span>
        )}
      </div>

      {error && <div style={s.error}>{error}</div>}

      <div style={s.actions}>
        <button type="button" style={s.cancel} onClick={reset} disabled={submitting}>Cancel</button>
        <button type="submit" style={s.submit} disabled={submitting}>{submitting ? "Posting…" : "Post"}</button>
      </div>
    </form>
  );
}

const s = {
  collapsed: {
    display: "flex", alignItems: "center", gap: 12, background: C.surface,
    border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 14px",
    marginBottom: 14, cursor: "pointer",
  },
  avatar: {
    width: 34, height: 34, borderRadius: "50%", background: C.gradient, color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700,
    fontSize: 14, flexShrink: 0,
  },
  prompt: { flex: 1, minWidth: 0, color: C.muted, fontSize: 14.5 },
  plusBtn: {
    width: 34, height: 34, borderRadius: 8, background: C.surfaceHover, color: C.muted,
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },

  card: {
    background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12,
    padding: 14, marginBottom: 14, display: "flex", flexDirection: "column", gap: 12,
  },
  tabBar: { display: "flex", gap: 6, overflowX: "auto" },
  tab: {
    padding: "7px 14px", borderRadius: 20, border: `1px solid ${C.border}`,
    background: C.surface, color: C.muted, fontSize: 13, fontWeight: 500,
    cursor: "pointer", whiteSpace: "nowrap", minHeight: 34,
  },
  tabActive: { background: C.gradient, color: "#fff", border: `1px solid transparent`, fontWeight: 600 },
  titleInput: {
    width: "100%", height: 46, fontSize: 16, padding: "0 14px",
    border: `1px solid ${C.border}`, borderRadius: 10, boxSizing: "border-box",
    fontFamily: "inherit", color: C.text,
  },
  body: {
    width: "100%", minHeight: 120, fontSize: 16, padding: "12px 14px",
    border: `1px solid ${C.border}`, borderRadius: 10, resize: "vertical",
    fontFamily: "inherit", boxSizing: "border-box", color: C.text, lineHeight: 1.6,
  },
  row: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
  select: {
    height: 42, fontSize: 15, padding: "0 12px", border: `1px solid ${C.border}`,
    borderRadius: 10, background: C.surface, color: C.text, flex: "0 1 220px",
  },
  anonBadge: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: C.muted, fontWeight: 500 },
  error: { background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "9px 13px", fontSize: 13.5, color: C.danger },
  actions: { display: "flex", justifyContent: "flex-end", gap: 8 },
  cancel: { background: "none", border: `1px solid ${C.border}`, color: C.muted, borderRadius: 10, padding: "9px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  submit: { background: C.gradient, color: "#fff", border: "none", borderRadius: 10, padding: "9px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer", minHeight: 40 },

  guest: {
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
    background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12,
    padding: "12px 16px", marginBottom: 14, flexWrap: "wrap",
  },
  guestText: { fontSize: 14, color: C.muted },
  guestBtn: { background: C.gradient, color: "#fff", borderRadius: 10, padding: "8px 16px", fontSize: 14, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" },
};
