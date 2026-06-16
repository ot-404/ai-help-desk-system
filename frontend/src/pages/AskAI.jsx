import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import { C } from "../theme";

const SUGGESTIONS = [
  "How do I set up Docker?",
  "Explain Big-O notation with examples",
  "Best practices for REST API design",
  "How does OAuth 2.0 work?",
];

export default function AskAI() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) { nav("/login?next=/ask"); return; }
    if (!question.trim()) return;
    setError(""); setResult(null); setLoading(true);
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
      <h1 style={s.h1}>Ask AI</h1>
      <p style={s.sub}>Get instant, expert-level answers to your technical questions.</p>

      <form onSubmit={handleSubmit}>
        <textarea
          style={s.textarea}
          placeholder="Ask anything — e.g. How do I containerize a Node.js app with Docker?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        {error && <div style={s.error}>{error}</div>}
        <div style={s.btnRow}>
          {!user ? (
            <Link to="/login?next=/ask" style={s.submit}>Sign in to Ask</Link>
          ) : (
            <button type="submit" style={s.submit} disabled={loading || !question.trim()}>
              {loading ? "Thinking…" : "Ask"}
            </button>
          )}
        </div>
      </form>

      {result && !loading && (
        <div style={s.answerCard}>
          <div style={s.answerLabel}>AI Answer</div>
          <div style={s.answerText}>{result.answer}</div>
          {result.kb_article?.id && (
            <Link to={`/question/${result.kb_article.id}`} style={s.viewLink}>View saved article →</Link>
          )}
        </div>
      )}

      <div style={s.chips}>
        {SUGGESTIONS.map((sug) => (
          <button key={sug} style={s.chip} onClick={() => setQuestion(sug)}>Try: {sug}</button>
        ))}
      </div>
    </div>
  );
}

const s = {
  h1: { fontSize: 20, fontWeight: 600, color: C.text, margin: 0 },
  sub: { fontSize: 14, color: C.muted, margin: "6px 0 18px" },
  textarea: { width: "100%", minHeight: 120, border: `1px solid ${C.border}`, borderRadius: 6, padding: "12px 14px", fontSize: 16, lineHeight: 1.6, resize: "vertical", boxSizing: "border-box", fontFamily: "inherit", color: C.text },
  error: { background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: 6, padding: "10px 14px", margin: "12px 0", fontSize: 14, color: C.danger },
  btnRow: { display: "flex", justifyContent: "flex-end", marginTop: 12 },
  submit: { background: C.primary, color: "#fff", border: "none", borderRadius: 6, padding: "10px 24px", fontSize: 14, fontWeight: 600, textDecoration: "none", minHeight: 40, cursor: "pointer", display: "inline-flex", alignItems: "center" },
  answerCard: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 20, marginTop: 20 },
  answerLabel: { fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 10 },
  answerText: { fontSize: 15, color: C.text, lineHeight: 1.75, whiteSpace: "pre-wrap" },
  viewLink: { display: "inline-block", marginTop: 14, color: C.primary, fontWeight: 600, fontSize: 14, textDecoration: "none" },
  chips: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 24 },
  chip: { textAlign: "left", background: "none", border: "none", padding: 0, fontSize: 13, color: C.primary, cursor: "pointer" },
};
