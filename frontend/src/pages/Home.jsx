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

function FeedCard({ article }) {
  const [open, setOpen] = useState(false);
  const PREVIEW = 220;
  const needsMore = (article.content || "").length > PREVIEW;
  const cc = CAT_COLOR[article.category] || CAT_COLOR.General;

  return (
    <div style={s.card}>
      {/* Category + tags */}
      <div style={s.cardMeta}>
        {article.category && (
          <span style={{ ...s.catBadge, background: cc.bg, color: cc.color }}>
            {article.category === "Blog" ? "✍️ Blog" : article.category}
          </span>
        )}
        {(article.tags || []).slice(0, 3).map((t, i) => (
          <span key={`${t}-${i}`} style={s.tag}>{t}</span>
        ))}
      </div>

      {/* Title */}
      <Link to={`/help?article=${article.id}`} style={s.cardTitle}>
        {article.title}
      </Link>

      {/* Content preview */}
      <div style={s.cardBody}>
        {open
          ? article.content
          : (article.content || "").slice(0, PREVIEW) + (needsMore ? "…" : "")}
      </div>
      {needsMore && (
        <button style={s.moreBtn} onClick={() => setOpen(o => !o)}>
          {open ? "Show less ▲" : "Read more ▼"}
        </button>
      )}

      {/* Footer */}
      <div style={s.cardFooter}>
        <span style={s.footerMeta}>
          🤖 AI Help Desk
          {article.created_at && ` · ${new Date(article.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
        </span>
        <Link to={`/help?article=${article.id}`} style={s.footerLink}>Open ↗</Link>
      </div>
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
    nav(q.trim() ? `/ask` : "/ask");
  }

  function handleSearch(e) {
    e.preventDefault();
    if (q.trim()) nav(`/help?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <div style={s.page}>

      {/* ── Ask box (Quora "What do you want to know?") ─── */}
      <div style={s.askCard}>
        <div style={s.askHeader}>
          <span style={s.askIcon}>🤖</span>
          <div>
            <div style={s.askTitle}>What do you want to know?</div>
            <div style={s.askSub}>Ask our AI — your question and its answer are published to help everyone.</div>
          </div>
        </div>
        <form onSubmit={handleAsk} style={s.askForm}>
          <input
            style={s.askInput}
            placeholder="e.g. How do I reset my password?"
            value={q}
            onChange={e => setQ(e.target.value)}
          />
          <button type="submit" style={s.askBtn}>Ask AI</button>
        </form>
        <div style={s.askFooterRow}>
          <span style={s.askHint}>or</span>
          <form onSubmit={handleSearch}>
            <button
              type="submit"
              style={s.searchHintBtn}
              disabled={!q.trim()}
            >
              Search the Help Center →
            </button>
          </form>
        </div>
      </div>

      {/* ── Feed label ─────────────────────────────────── */}
      <div style={s.feedLabel}>
        {loading ? "Loading…" : `${articles.length} articles in the Help Center`}
      </div>

      {/* ── Feed ───────────────────────────────────────── */}
      {!loading && articles.length === 0 ? (
        <div style={s.empty}>
          <div style={s.emptyIcon}>📭</div>
          <div style={s.emptyText}>No articles yet.</div>
          <Link to="/ask" style={s.emptyLink}>Be the first to ask a question →</Link>
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
    padding: "20px", marginBottom: 12,
  },
  askHeader: { display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 },
  askIcon:   { fontSize: 28, lineHeight: 1, flexShrink: 0, marginTop: 2 },
  askTitle:  { fontWeight: 700, fontSize: 16, color: "#282829", marginBottom: 2 },
  askSub:    { fontSize: 13, color: "#939598", lineHeight: 1.4 },
  askForm:   { display: "flex", gap: 8 },
  askInput:  {
    flex: 1, border: "1.5px solid #e8e8e8", borderRadius: 20,
    padding: "9px 16px", fontSize: 14, outline: "none",
    color: "#282829",
  },
  askBtn: {
    background: "#16c784", color: "#fff", border: "none",
    borderRadius: 20, padding: "9px 20px",
    fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
  },
  askFooterRow: { display: "flex", alignItems: "center", gap: 10, marginTop: 10 },
  askHint:      { fontSize: 12, color: "#939598" },
  searchHintBtn:{
    background: "none", border: "none", color: "#16c784",
    fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0,
  },

  feedLabel: { fontSize: 12, color: "#939598", fontWeight: 600, marginBottom: 8, paddingLeft: 2 },

  feed: { display: "flex", flexDirection: "column", gap: 8 },

  /* Feed card */
  card: {
    background: "#fff", border: "1px solid #e8e8e8",
    borderRadius: 8, padding: "18px 20px",
    display: "flex", flexDirection: "column", gap: 0,
  },
  cardMeta: { display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 8 },
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
    fontSize: 17, fontWeight: 700, color: "#282829",
    textDecoration: "none", lineHeight: 1.35,
    display: "block", marginBottom: 8,
  },
  cardBody: {
    fontSize: 14, color: "#4e4e4e", lineHeight: 1.65,
    whiteSpace: "pre-wrap", marginBottom: 6,
  },
  moreBtn: {
    background: "none", border: "none", color: "#16c784",
    fontSize: 13, fontWeight: 600, cursor: "pointer",
    padding: "4px 0", textAlign: "left",
  },
  cardFooter: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    marginTop: 12, paddingTop: 10, borderTop: "1px solid #f2f2f0",
  },
  footerMeta: { fontSize: 12, color: "#939598" },
  footerLink: { fontSize: 12, color: "#16c784", fontWeight: 600, textDecoration: "none" },

  empty: { textAlign: "center", padding: "60px 0" },
  emptyIcon: { fontSize: 36, marginBottom: 10 },
  emptyText: { fontSize: 16, color: "#939598", marginBottom: 12 },
  emptyLink: { color: "#16c784", fontWeight: 600, fontSize: 14, textDecoration: "none" },
};
