import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useIsMobile } from "../hooks/useIsMobile";
import api from "../api/client";
import { C } from "../theme";

const SUGGESTIONS = [
  "How do I set up Kubernetes?",
  "Explain Big-O notation with examples",
  "Best practices for REST API design",
  "How does OAuth 2.0 work?",
  "When should I use Rust over Go?",
];

export default function AskAI() {
  const { user } = useAuth();
  const nav = useNavigate();
  const isMobile = useIsMobile();
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
    <div style={s.page}>
      <div style={s.banner}>
        <div style={s.bannerTag}>AI ASSISTANT</div>
        <h1 style={s.bannerTitle}>Ask HD Systems AI</h1>
        <p style={s.bannerSub}>Get instant, expert-level answers to your technical questions.</p>
      </div>

      <div style={{ ...s.body, gridTemplateColumns: isMobile ? "1fr" : "1fr 260px" }}>
        <div>
          <form onSubmit={handleSubmit} style={s.card}>
            <textarea
              style={s.textarea}
              placeholder="Ask anything — e.g. How do I containerize a Node.js app with Docker?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={6}
            />
            {error && <div style={s.error}>{error}</div>}
            {!user ? (
              <Link to="/login?next=/ask" style={s.submit}>Sign in to Ask AI</Link>
            ) : (
              <button type="submit" style={s.submit} disabled={loading || !question.trim()}>
                {loading ? "Thinking…" : "Ask AI"}
              </button>
            )}
          </form>

          {result && !loading && (
            <div style={s.answerCard}>
              <div style={s.answerLabel}>AI Answer{result.model && result.model !== "mock" ? ` · ${result.model}` : result.model === "mock" ? " · mock" : ""}</div>
              <div style={s.answerText}>{result.answer}</div>
              {result.kb_article?.id && (
                <Link to={`/question/${result.kb_article.id}`} style={s.viewLink}>View saved article →</Link>
              )}
            </div>
          )}
        </div>

        {!isMobile && (
          <div style={s.sideCard}>
            <div style={s.sideTitle}>Try asking</div>
            <div style={s.chips}>
              {SUGGESTIONS.map((sug) => (
                <button key={sug} style={s.chip} onClick={() => setQuestion(sug)}>{sug}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { display: "flex", flexDirection: "column", gap: 16 },
  banner: { background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)", borderRadius: 12, padding: "32px 28px", color: "#fff" },
  bannerTag: { display: "inline-block", background: "rgba(255,255,255,.18)", fontSize: 11, fontWeight: 700, letterSpacing: 1, padding: "4px 10px", borderRadius: 20, marginBottom: 12 },
  bannerTitle: { fontSize: 30, fontWeight: 800, margin: "0 0 8px" },
  bannerSub: { fontSize: 15, color: "rgba(255,255,255,.85)", margin: 0 },
  body: { display: "grid", gap: 16, alignItems: "start" },
  card: { background: C.surface, border: "1px solid " + C.border, borderRadius: 10, padding: 18 },
  textarea: { width: "100%", border: "1.5px solid " + C.border, borderRadius: 8, padding: "12px 14px", fontSize: 14, lineHeight: 1.6, resize: "vertical", boxSizing: "border-box", fontFamily: "inherit", color: C.text, marginBottom: 14 },
  error: { background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 14, color: "#c53030" },
  submit: { display: "block", width: "100%", textAlign: "center", background: C.ai, color: "#fff", border: "none", borderRadius: 8, padding: "13px", fontSize: 15, fontWeight: 700, textDecoration: "none" },
  answerCard: { background: C.surface, border: "1px solid " + C.border, borderRadius: 10, padding: 20, marginTop: 16 },
  answerLabel: { fontSize: 12, fontWeight: 700, color: C.ai, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 10 },
  answerText: { fontSize: 14, color: C.text, lineHeight: 1.75, whiteSpace: "pre-wrap" },
  viewLink: { display: "inline-block", marginTop: 14, color: C.primary, fontWeight: 700, fontSize: 13, textDecoration: "none" },
  sideCard: { background: C.surface, border: "1px solid " + C.border, borderRadius: 10, padding: 16 },
  sideTitle: { fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 12 },
  chips: { display: "flex", flexDirection: "column", gap: 8 },
  chip: { textAlign: "left", background: C.bg, border: "1px solid " + C.border, borderRadius: 8, padding: "9px 12px", fontSize: 13, color: C.muted, fontWeight: 500 },
};
