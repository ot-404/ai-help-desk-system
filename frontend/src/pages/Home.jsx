import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";

const CAT_COLOR = {
  Blog:      { bg: "#faf5ff", color: "#805ad5" },
  FAQ:       { bg: "#f0fff4", color: "#276749" },
  Technical: { bg: "#ebf8ff", color: "#2b6cb0" },
  Account:   { bg: "#fffff0", color: "#744210" },
  Billing:   { bg: "#fff5f5", color: "#c53030" },
  General:   { bg: "#f7fafc", color: "#4a5568" },
};

function EngageRow({ articleId }) {
  const [upvoted, setUpvoted] = useState(false);
  const [count, setCount] = useState(0);
  const [copied, setCopied] = useState(false);

  function handleUpvote(e) {
    e.preventDefault();
    setUpvoted(v => !v);
    setCount(c => upvoted ? c - 1 : c + 1);
  }

  function handleShare(e) {
    e.preventDefault();
    navigator.clipboard.writeText(window.location.origin + `/help?article=${articleId}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div style={s.engage}>
      <button style={{ ...s.engBtn, ...(upvoted ? s.engBtnActive : {}) }} onClick={handleUpvote}>
        <span style={s.engArrow}>▲</span>
        <span>Upvote</span>
        {count > 0 && <><span style={s.engSep}>·</span><span>{count}</span></>}
      </button>
      <Link to={`/help?article=${articleId}`} style={s.engLink}>
        Comment
      </Link>
      <button style={s.engBtn} onClick={handleShare}>
        {copied ? "✓ Copied!" : "↗ Share"}
      </button>
      <Link to={`/help?article=${articleId}`} style={s.engDots}>···</Link>
    </div>
  );
}

function FeedCard({ article }) {
  const [open, setOpen] = useState(false);
  const PREVIEW = 240;
  const needsMore = (article.content || "").length > PREVIEW;
  const cc = CAT_COLOR[article.category] || CAT_COLOR.General;

  return (
    <div style={s.card}>
      {/* Topic + tags */}
      <div style={s.cardMeta}>
        {article.category && (
          <span style={{ ...s.catBadge, background: cc.bg, color: cc.color }}>
            {article.category}
          </span>
        )}
        {(article.tags || []).slice(0, 3).map((t, i) => (
          <span key={`${t}-${i}`} style={s.tag}>{t}</span>
        ))}
      </div>

      {/* Question title */}
      <Link to={`/help?article=${article.id}`} style={s.cardTitle}>
        {article.title}
      </Link>

      {/* Author line */}
      <div style={s.authorLine}>
        <div style={s.authorAvatar}>AI</div>
        <div style={s.authorMeta}>
          <span style={s.authorName}>AI Help Desk</span>
          <span style={s.authorDot}>·</span>
          <span style={s.authorDate}>
            {article.created_at
              ? new Date(article.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              : "Recently"}
          </span>
        </div>
      </div>

      {/* Answer preview */}
      <div style={s.cardBody}>
        {open
          ? article.content
          : (article.content || "").slice(0, PREVIEW) + (needsMore ? "…" : "")}
      </div>
      {needsMore && (
        <button style={s.moreBtn} onClick={() => setOpen(o => !o)}>
          {open ? "Collapse ▲" : "(more)"}
        </button>
      )}

      {/* Quora engagement row */}
      <EngageRow articleId={article.id} />
    </div>
  );
}

export default function Home() {
  const nav = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    api.get("/kb/").then(r => setArticles(r.data || [])).finally(() => setLoading(false));
  }, []);

  function handleAsk(e) {
    e.preventDefault();
    nav("/ask");
  }

  return (
    <div style={s.page}>

      {/* Ask box */}
      <div style={s.askCard}>
        <div style={s.askHeader}>
          <div style={s.askAvatar}>AI</div>
          <form onSubmit={handleAsk} style={s.askForm}>
            <input
              style={s.askInput}
              placeholder="What do you want to know?"
              value={q}
              onChange={e => setQ(e.target.value)}
            />
            <button type="submit" style={s.askBtn}>Ask</button>
          </form>
        </div>
      </div>

      {/* Feed label */}
      <div style={s.feedLabel}>
        {loading ? "Loading…" : `${articles.length} questions answered`}
      </div>

      {/* Feed */}
      {!loading && articles.length === 0 ? (
        <div style={s.empty}>
          <div style={s.emptyIcon}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#cbd5e0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v16H4z"/><path d="M4 9h16M9 9v11"/></svg>
          </div>
          <div style={s.emptyText}>No questions answered yet.</div>
          <Link to="/ask" style={s.emptyLink}>Ask the first question →</Link>
        </div>
      ) : (
        <div style={s.feed}>
          {articles.map(a => <FeedCard key={a.id} article={a} />)}
        </div>
      )}

    </div>
  );
}

const s = {
  page: { paddingTop: 4 },

  /* Ask card */
  askCard: {
    background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8,
    padding: "14px 18px", marginBottom: 10,
  },
  askHeader: { display: "flex", alignItems: "center", gap: 12 },
  askAvatar: { width: 32, height: 32, borderRadius: "50%", background: "#16c784", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 },
  askForm:   { flex: 1, display: "flex", gap: 8 },
  askInput:  {
    flex: 1, border: "1.5px solid #e8e8e8", borderRadius: 24,
    padding: "9px 16px", fontSize: 14, color: "#282829", outline: "none",
    background: "#f9f9f9",
  },
  askBtn: {
    background: "#16c784", color: "#fff", border: "none",
    borderRadius: 20, padding: "9px 20px",
    fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
  },

  feedLabel: { fontSize: 12, color: "#939598", fontWeight: 600, marginBottom: 6, paddingLeft: 2 },
  feed: { display: "flex", flexDirection: "column", gap: 8 },

  /* Feed card */
  card: {
    background: "#fff", border: "1px solid #e8e8e8",
    borderRadius: 8,
    padding: "20px 24px",
    display: "flex", flexDirection: "column",
  },
  cardMeta: { display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 10 },
  catBadge: {
    fontSize: 11, fontWeight: 700, padding: "2px 8px",
    borderRadius: 20, textTransform: "uppercase", letterSpacing: ".3px",
  },
  tag: {
    fontSize: 11, color: "#718096", background: "#f7fafc",
    border: "1px solid #e2e8f0", padding: "1px 7px",
    borderRadius: 20,
  },
  cardTitle: {
    fontSize: 18, fontWeight: 700, color: "#282829",
    textDecoration: "none", lineHeight: 1.35,
    display: "block", marginBottom: 10,
  },
  "cardTitle:hover": { textDecoration: "underline" },

  authorLine: { display: "flex", alignItems: "center", gap: 8, marginBottom: 10 },
  authorAvatar: { width: 24, height: 24, borderRadius: "50%", background: "#16c784", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, flexShrink: 0 },
  authorMeta: { display: "flex", alignItems: "center", gap: 4 },
  authorName: { fontSize: 13, fontWeight: 700, color: "#282829" },
  authorDot:  { color: "#939598", fontSize: 13 },
  authorDate: { fontSize: 13, color: "#939598" },

  cardBody: {
    fontSize: 14, color: "#282829", lineHeight: 1.7,
    whiteSpace: "pre-wrap", marginBottom: 4,
  },
  moreBtn: {
    background: "none", border: "none", color: "#939598",
    fontSize: 13, cursor: "pointer",
    padding: "4px 0", textAlign: "left",
  },

  /* Engagement row */
  engage: {
    display: "flex", alignItems: "center", gap: 4,
    marginTop: 14, paddingTop: 12, borderTop: "1px solid #f2f2f0",
  },
  engBtn: {
    display: "flex", alignItems: "center", gap: 5,
    background: "none", border: "1px solid #e8e8e8",
    borderRadius: 20, padding: "5px 14px",
    fontSize: 13, fontWeight: 600, color: "#555", cursor: "pointer",
    transition: "border-color .15s, color .15s",
  },
  engBtnActive: {
    color: "#16c784", borderColor: "#16c784", background: "#f0fdf8",
  },
  engLink: {
    display: "flex", alignItems: "center", gap: 5,
    border: "1px solid #e8e8e8",
    borderRadius: 20, padding: "5px 14px",
    fontSize: 13, fontWeight: 600, color: "#555",
    textDecoration: "none",
  },
  engArrow: { fontSize: 11 },
  engSep:   { color: "#ccc" },
  engDots: {
    marginLeft: "auto", fontSize: 18, color: "#939598",
    textDecoration: "none", lineHeight: 1, padding: "0 4px",
  },

  empty: { textAlign: "center", padding: "60px 0" },
  emptyIcon: { fontSize: 36, marginBottom: 10 },
  emptyText: { fontSize: 16, color: "#939598", marginBottom: 12 },
  emptyLink: { color: "#16c784", fontWeight: 600, fontSize: 14, textDecoration: "none" },
};
