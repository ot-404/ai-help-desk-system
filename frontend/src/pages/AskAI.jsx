import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import { C } from "../theme";

const SUGGESTIONS = [
  "How do I set up Docker for a Node.js app?",
  "Explain Big-O notation with examples",
  "Best practices for REST API design",
];

export default function AskAI() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [question, setQuestion] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [helpful, setHelpful] = useState(null);

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
    if (!user) { nav("/login?next=/ask"); return; }
    if (!question.trim()) return;
    setError(""); setResult(null); setHelpful(null); setLoading(true);
    try {
      const { data } = await api.post("/ai/ask", { question: question.trim() });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div style={s.headerCard}>
        <h1 style={s.h1}>Ask AI</h1>
        <p style={s.sub}>Powered by AI · Ask anything about tech, programming, DevOps, and more.</p>
      </div>

      <form onSubmit={handleSubmit} style={s.inputCard}>
        <textarea
          style={s.textarea}
          placeholder="Ask anything — e.g. How do I containerize a Node.js app with Docker?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <div style={s.tagBox}>
          {tags.map((t) => (
            <span key={t} style={s.tagChip}>{t}
              <button type="button" style={s.tagX} onClick={() => setTags((p) => p.filter((x) => x !== t))}>×</button>
            </span>
          ))}
          {tags.length < 5 && (
            <input style={s.tagInput} placeholder="Add context tags, press Enter" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={addTag} />
          )}
        </div>
        {error && <div style={s.error}>{error}</div>}
        <div style={s.btnRow}>
          {!user ? (
            <Link to="/login?next=/ask" style={s.submit}>Sign in to ask</Link>
          ) : (
            <button type="submit" style={s.submit} disabled={loading || !question.trim()}>
              {loading ? "Thinking…" : "Ask"}
            </button>
          )}
        </div>
      </form>

      {result && !loading && (
        <div style={s.answerCard}>
          <div style={s.answerHead}>
            <span style={s.answerLabel}>AI Response</span>
            <span style={s.modelBadge}>AI model</span>
          </div>
          <div style={s.answerText}>{result.answer}</div>
          {result.kb_article?.id && (
            <Link to={`/question/${result.kb_article.id}`} style={s.viewLink}>View saved article →</Link>
          )}
          <div style={s.helpfulRow}>
            <span style={s.helpfulLabel}>Was this helpful?</span>
            <button style={{ ...s.thumb, color: helpful === "up" ? C.success : C.muted }} onClick={() => setHelpful("up")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z" /><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
            </button>
            <button style={{ ...s.thumb, color: helpful === "down" ? C.danger : C.muted }} onClick={() => setHelpful("down")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3z" /><path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" /></svg>
            </button>
          </div>
        </div>
      )}

      <div style={s.suggestGrid}>
        {SUGGESTIONS.map((sug) => (
          <button key={sug} style={s.suggestCard} onClick={() => setQuestion(sug)}>{sug}</button>
        ))}
      </div>
    </div>
  );
}

const s = {
  headerCard: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18, marginBottom: 14 },
  h1: { fontSize: 20, fontWeight: 700, color: C.text, margin: 0, letterSpacing: -0.3 },
  sub: { fontSize: 14, color: C.muted, margin: "6px 0 0" },
  inputCard: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 },
  textarea: { width: "100%", minHeight: 180, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", fontSize: 16, lineHeight: 1.6, resize: "vertical", boxSizing: "border-box", fontFamily: "inherit", color: C.text },
  tagBox: { display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 10px", minHeight: 44, boxSizing: "border-box", marginTop: 12 },
  tagChip: { display: "inline-flex", alignItems: "center", gap: 4, background: C.tag, color: C.tagText, fontSize: 13, padding: "3px 9px", borderRadius: 6 },
  tagX: { background: "none", border: "none", color: C.tagText, fontSize: 15, lineHeight: 1, padding: 0, cursor: "pointer" },
  tagInput: { flex: 1, minWidth: 160, border: "none", fontSize: 16, padding: "4px 2px", outline: "none" },
  error: { background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", margin: "12px 0 0", fontSize: 14, color: C.danger },
  btnRow: { display: "flex", justifyContent: "flex-end", marginTop: 12 },
  submit: { background: C.gradient, color: "#fff", border: "none", borderRadius: 10, padding: "10px 28px", fontSize: 14, fontWeight: 600, textDecoration: "none", minHeight: 40, cursor: "pointer", display: "inline-flex", alignItems: "center" },
  answerCard: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18, marginTop: 14 },
  answerHead: { display: "flex", alignItems: "center", gap: 8, marginBottom: 10 },
  answerLabel: { fontSize: 14, fontWeight: 700, color: C.text },
  modelBadge: { fontSize: 10, fontWeight: 700, color: C.purple, background: "#e3f2f6", padding: "2px 8px", borderRadius: 10 },
  answerText: { fontSize: 15, color: C.text, lineHeight: 1.75, whiteSpace: "pre-wrap" },
  viewLink: { display: "inline-block", marginTop: 14, color: C.blue, fontWeight: 600, fontSize: 14, textDecoration: "none" },
  helpfulRow: { display: "flex", alignItems: "center", gap: 10, marginTop: 16, paddingTop: 12, borderTop: `1px solid ${C.divider}` },
  helpfulLabel: { fontSize: 13, color: C.muted, fontWeight: 600 },
  thumb: { background: "none", border: "none", cursor: "pointer", padding: 6, display: "flex", minHeight: 44, minWidth: 44, alignItems: "center", justifyContent: "center" },
  suggestGrid: { display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 },
  suggestCard: { flex: "1 1 200px", textAlign: "left", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, fontSize: 14, color: C.text, cursor: "pointer", minWidth: 0 },
};
