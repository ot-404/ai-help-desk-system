import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

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
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const { data } = await api.post("/ai/ask", { question: question.trim() });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleNew() {
    setResult(null);
    setQuestion("");
    setError("");
  }

  return (
    <div style={s.page}>
      {/* Hero */}
      <div style={s.hero}>
        <div style={s.heroInner}>
          <div style={s.heroTag}>AI-Powered Answers</div>
          <h1 style={s.heroTitle}>Ask Our AI Anything</h1>
          <p style={s.heroSub}>
            Ask a question and our AI will answer it, save it to the knowledge base,
            and publish a help article — so everyone benefits.
          </p>
        </div>
      </div>

      <div style={s.body}>
        <div style={s.inner}>

          {/* Ask form */}
          {!result && (
            <div style={s.formCard}>
              <div style={s.formHeader}>
                <span style={s.formIcon}>💬</span>
                <div>
                  <div style={s.formTitle}>Ask a Question</div>
                  <div style={s.formSub}>Be specific — the more detail you give, the better the answer.</div>
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <textarea
                  style={s.textarea}
                  placeholder="e.g. How do I reset my password? What are your billing options? How do I cancel my subscription?"
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  rows={5}
                  required
                />
                {error && <div style={s.errBox}>{error}</div>}
                {!user ? (
                  <div style={s.authPrompt}>
                    <span style={s.authIcon}>🔒</span>
                    <div>
                      <strong>Sign in to ask a question</strong>
                      <div style={s.authSub}>Your question and AI answer will be saved to help others too.</div>
                    </div>
                    <Link to="/login?next=/ask" style={s.signInBtn}>Sign In</Link>
                  </div>
                ) : (
                  <button type="submit" style={s.submitBtn} disabled={loading || !question.trim()}>
                    {loading ? (
                      <span style={s.loadingRow}><span style={s.spinner} />Thinking…</span>
                    ) : (
                      "Ask AI →"
                    )}
                  </button>
                )}
              </form>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div style={s.loadingCard}>
              <div style={s.loadingDots}>
                <span style={s.dot1} /><span style={s.dot2} /><span style={s.dot3} />
              </div>
              <div style={s.loadingText}>Generating answer, knowledge base article, and blog post…</div>
            </div>
          )}

          {/* Results */}
          {result && !loading && (
            <div style={s.results}>
              {/* Question recap */}
              <div style={s.questionRecap}>
                <span style={s.qIcon}>❓</span>
                <div style={s.qText}>{question}</div>
              </div>

              {/* AI Answer */}
              <div style={s.answerCard}>
                <div style={s.cardTopRow}>
                  <div style={s.cardLabel}>
                    <span style={s.labelDot} />AI Answer
                    {result.model && result.model !== "mock" && (
                      <span style={s.modelBadge}>{result.model}</span>
                    )}
                    {result.model === "mock" && (
                      <span style={{ ...s.modelBadge, background: "#fed7d7", color: "#c53030" }}>mock — add API key for live AI</span>
                    )}
                  </div>
                </div>
                <div style={s.answerText}>{result.answer}</div>
              </div>

              {/* Saved articles */}
              <div style={s.savedRow}>
                <div style={s.savedCard}>
                  <div style={s.savedIcon}>📚</div>
                  <div style={s.savedLabel}>Knowledge Base Article</div>
                  <div style={s.savedTitle}>{result.kb_article?.title}</div>
                  <div style={s.savedMeta}>Category: {result.kb_article?.category}</div>
                  <Link to={`/help?article=${result.kb_article?.id}`} style={s.viewBtn}>View Article →</Link>
                </div>
                <div style={s.savedCard}>
                  <div style={s.savedIcon}>✍️</div>
                  <div style={s.savedLabel}>Blog Post</div>
                  <div style={s.savedTitle}>{result.blog_post?.title}</div>
                  <div style={s.savedMeta}>Category: Blog · Published to Help Center</div>
                  <Link to={`/help?article=${result.blog_post?.id}`} style={s.viewBtn}>Read Post →</Link>
                </div>
              </div>

              {/* Ask another */}
              <div style={s.againRow}>
                <button onClick={handleNew} style={s.againBtn}>Ask Another Question</button>
                <Link to="/help" style={s.helpLink}>Browse all articles →</Link>
              </div>
            </div>
          )}

          {/* Info banner */}
          {!result && !loading && (
            <div style={s.infoBanner}>
              <div style={s.infoGrid}>
                <div style={s.infoItem}>
                  <div style={s.infoIcon}>🤖</div>
                  <div style={s.infoTitle}>AI-Powered</div>
                  <div style={s.infoText}>Uses your knowledge base to give accurate, contextual answers.</div>
                </div>
                <div style={s.infoItem}>
                  <div style={s.infoIcon}>📚</div>
                  <div style={s.infoTitle}>Saves to KB</div>
                  <div style={s.infoText}>Every question and answer is saved as a help article for future visitors.</div>
                </div>
                <div style={s.infoItem}>
                  <div style={s.infoIcon}>✍️</div>
                  <div style={s.infoTitle}>Creates Blog Posts</div>
                  <div style={s.infoText}>A formatted blog post is published automatically to the Help Center.</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100%", background: "#eef1f4" },

  hero: { background: "linear-gradient(135deg, #1f2a37 0%, #2d3748 100%)", padding: "56px 20px 48px", textAlign: "center" },
  heroInner: { maxWidth: 600, margin: "0 auto" },
  heroTag: { display: "inline-block", background: "#16c78422", color: "#16c784", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20, letterSpacing: ".5px", textTransform: "uppercase", marginBottom: 16 },
  heroTitle: { fontSize: 34, fontWeight: 800, color: "#fff", margin: "0 0 12px", lineHeight: 1.2 },
  heroSub: { fontSize: 15, color: "#a0aec0", lineHeight: 1.6, margin: 0 },

  body: { padding: "36px 20px 60px" },
  inner: { maxWidth: 720, margin: "0 auto" },

  formCard: { background: "#fff", borderRadius: 16, padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,.07)", marginBottom: 24 },
  formHeader: { display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 20 },
  formIcon: { fontSize: 28, lineHeight: 1 },
  formTitle: { fontSize: 16, fontWeight: 700, color: "#1f2a37", marginBottom: 3 },
  formSub: { fontSize: 13, color: "#7a8794" },
  textarea: { width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "13px 14px", fontSize: 14, lineHeight: 1.6, resize: "vertical", outline: "none", boxSizing: "border-box", fontFamily: "inherit", color: "#1f2a37", marginBottom: 16 },
  errBox: { background: "#fff5f5", color: "#c53030", border: "1px solid #feb2b2", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 14 },
  authPrompt: { display: "flex", alignItems: "center", gap: 14, background: "#f7fafc", borderRadius: 10, padding: "14px 16px", border: "1px solid #e2e8f0" },
  authIcon: { fontSize: 22, flexShrink: 0 },
  authSub: { fontSize: 12, color: "#7a8794", marginTop: 2 },
  signInBtn: { background: "#16c784", color: "#fff", borderRadius: 8, padding: "8px 18px", fontSize: 14, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap", marginLeft: "auto" },
  submitBtn: { width: "100%", background: "#16c784", color: "#fff", border: "none", borderRadius: 10, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer" },
  loadingRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8 },
  spinner: { display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,.4)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" },

  loadingCard: { background: "#fff", borderRadius: 16, padding: "48px 28px", boxShadow: "0 2px 12px rgba(0,0,0,.07)", textAlign: "center", marginBottom: 24 },
  loadingDots: { display: "flex", justifyContent: "center", gap: 8, marginBottom: 16 },
  dot1: { width: 10, height: 10, borderRadius: "50%", background: "#16c784", animation: "bounce 1.2s infinite 0s" },
  dot2: { width: 10, height: 10, borderRadius: "50%", background: "#16c784", animation: "bounce 1.2s infinite 0.2s" },
  dot3: { width: 10, height: 10, borderRadius: "50%", background: "#16c784", animation: "bounce 1.2s infinite 0.4s" },
  loadingText: { color: "#7a8794", fontSize: 14 },

  results: { display: "flex", flexDirection: "column", gap: 20 },
  questionRecap: { display: "flex", alignItems: "flex-start", gap: 12, background: "#f7fafc", borderRadius: 12, padding: "16px 18px", border: "1px solid #e2e8f0" },
  qIcon: { fontSize: 18, flexShrink: 0, marginTop: 1 },
  qText: { fontSize: 15, fontWeight: 600, color: "#1f2a37", lineHeight: 1.5 },

  answerCard: { background: "#fff", borderRadius: 16, padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,.07)" },
  cardTopRow: { marginBottom: 14 },
  cardLabel: { display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: "#a0aec0", textTransform: "uppercase", letterSpacing: ".5px" },
  labelDot: { width: 8, height: 8, borderRadius: "50%", background: "#16c784" },
  modelBadge: { background: "#f0fff4", color: "#276749", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 10 },
  answerText: { fontSize: 14, color: "#2d3748", lineHeight: 1.75, whiteSpace: "pre-wrap" },

  savedRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  savedCard: { background: "#fff", borderRadius: 14, padding: "22px 20px", boxShadow: "0 2px 10px rgba(0,0,0,.06)", display: "flex", flexDirection: "column", gap: 6 },
  savedIcon: { fontSize: 26, marginBottom: 4 },
  savedLabel: { fontSize: 11, fontWeight: 700, color: "#a0aec0", textTransform: "uppercase", letterSpacing: ".4px" },
  savedTitle: { fontSize: 14, fontWeight: 600, color: "#1f2a37", lineHeight: 1.4 },
  savedMeta: { fontSize: 12, color: "#7a8794" },
  viewBtn: { marginTop: "auto", paddingTop: 8, color: "#16c784", fontWeight: 700, fontSize: 13, textDecoration: "none" },

  againRow: { display: "flex", alignItems: "center", gap: 20, paddingTop: 4 },
  againBtn: { background: "#1f2a37", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  helpLink: { color: "#16c784", fontWeight: 600, fontSize: 13, textDecoration: "none" },

  infoBanner: { background: "#fff", borderRadius: 16, padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,.07)" },
  infoGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 },
  infoItem: { textAlign: "center" },
  infoIcon: { fontSize: 28, marginBottom: 10 },
  infoTitle: { fontSize: 14, fontWeight: 700, color: "#1f2a37", marginBottom: 6 },
  infoText: { fontSize: 13, color: "#7a8794", lineHeight: 1.5 },
};
