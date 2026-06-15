import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

const TABS = ["All", "Blog", "FAQ", "Technical", "Account", "Billing", "General"];

const CAT_COLOR = {
  Blog:      { bg: "#faf5ff", color: "#805ad5" },
  FAQ:       { bg: "#f0fff4", color: "#276749" },
  Technical: { bg: "#ebf8ff", color: "#2b6cb0" },
  Account:   { bg: "#fffff0", color: "#744210" },
  Billing:   { bg: "#fff5f5", color: "#c53030" },
  General:   { bg: "#f7fafc", color: "#4a5568" },
};

export default function PublicHelp() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const [allArticles, setAllArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(params.get("q") || "");
  const [tab, setTab] = useState(params.get("tab") || "All");
  const [expanded, setExpanded] = useState(params.get("article") ? parseInt(params.get("article")) : null);

  useEffect(() => {
    setLoading(true);
    const q = params.get("q");
    const req = q ? api.get(`/kb/search?q=${encodeURIComponent(q)}`) : api.get("/kb/");
    req.then(r => {
      const data = Array.isArray(r.data) ? r.data : (r.data.results || []);
      setAllArticles(data);
    }).catch(() => setAllArticles([])).finally(() => setLoading(false));
  }, [params]);

  useEffect(() => {
    const articleId = params.get("article");
    if (articleId) setExpanded(parseInt(articleId));
    const t = params.get("tab");
    if (t) setTab(t);
  }, [params]);

  function handleSearch(e) {
    e.preventDefault();
    const next = new URLSearchParams();
    if (query) next.set("q", query);
    if (tab !== "All") next.set("tab", tab);
    setParams(next);
    setExpanded(null);
  }

  function switchTab(t) {
    setTab(t);
    const next = new URLSearchParams(params);
    if (t === "All") next.delete("tab"); else next.set("tab", t);
    setParams(next);
    setExpanded(null);
  }

  function openArticle(id) {
    setExpanded(id === expanded ? null : id);
  }

  const articles = tab === "All"
    ? allArticles
    : allArticles.filter(a => (a.category || "").toLowerCase() === tab.toLowerCase());

  const ticketLink = user?.role === "user" ? "/new-question" : "/login?next=/new-question";

  return (
    <div style={s.page}>

      {/* ── Page header (Quora Topics style) ── */}
      <div style={s.header}>
        <div style={s.headerInner}>
          <div style={s.breadcrumb}>
            <Link to="/" style={s.breadLink}>Home</Link>
            <span style={s.breadSep}>/</span>
            <span style={s.breadCurrent}>Help Center</span>
          </div>
          <h1 style={s.pageTitle}>Help Center</h1>
          <p style={s.pageSub}>
            {allArticles.length > 0
              ? `${allArticles.length} questions answered · Browse or search below`
              : "Browse articles, guides, and AI-generated answers"}
          </p>
          <form onSubmit={handleSearch} style={s.searchRow}>
            <span style={s.searchIcon}>🔍</span>
            <input
              style={s.searchInput}
              placeholder="Search questions and articles…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button type="submit" style={s.searchBtn}>Search</button>
            {params.get("q") && (
              <button type="button" style={s.clearBtn}
                onClick={() => { setQuery(""); setParams(tab !== "All" ? { tab } : {}); }}>
                Clear
              </button>
            )}
          </form>
          <div style={s.askRow}>
            <span style={s.askHint}>Can't find what you're looking for?</span>
            <Link to="/ask" style={s.askLink}>🤖 Ask AI →</Link>
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────── */}
      <div style={s.body}>
        <div style={s.inner}>

          {/* Tabs */}
          <div style={s.tabs}>
            {TABS.map(t => {
              const count = t === "All"
                ? null
                : allArticles.filter(a => (a.category || "").toLowerCase() === t.toLowerCase()).length;
              return (
                <button
                  key={t}
                  style={{ ...s.tabBtn, ...(tab === t ? s.tabActive : {}) }}
                  onClick={() => switchTab(t)}
                >
                  {t === "Blog" ? "✍️ Blog" : t}
                  {count != null && count > 0 && (
                    <span style={{ ...s.tabCount, ...(tab === t ? s.tabCountActive : {}) }}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {params.get("q") && !loading && (
            <div style={s.resultNote}>
              {articles.length} result{articles.length !== 1 ? "s" : ""} for &ldquo;{params.get("q")}&rdquo;
            </div>
          )}

          {loading ? (
            <div style={s.loading}>Loading…</div>
          ) : articles.length === 0 ? (
            <div style={s.empty}>
              <div style={s.emptyIcon}>🔍</div>
              <div style={s.emptyTitle}>No articles found</div>
              <p style={s.emptySub}>Try a different search, or ask our AI to generate an answer.</p>
              <div style={s.emptyBtns}>
                <Link to="/ask"        style={s.btnPrimary}>Ask AI →</Link>
                <Link to={ticketLink}  style={s.btnOutline}>
                  {user ? "Ask a Question" : "Sign In to Get Help"}
                </Link>
              </div>
            </div>
          ) : (
            <div style={s.list}>
              {articles.map(a => {
                const cc = CAT_COLOR[a.category] || CAT_COLOR.General;
                return (
                  <div key={a.id} style={s.articleCard}>
                    <button style={s.articleHeader} onClick={() => openArticle(a.id)}>
                      <div style={s.articleLeft}>
                        {a.category && (
                          <span style={{ ...s.catTag, background: cc.bg, color: cc.color }}>
                            {a.category === "Blog" ? "✍️ Blog" : a.category}
                          </span>
                        )}
                        <span style={s.articleTitle}>{a.title}</span>
                      </div>
                      <span style={s.chevron}>{expanded === a.id ? "▲" : "▼"}</span>
                    </button>
                    {expanded === a.id && (
                      <div style={s.articleBody}>
                        <div style={s.authorLine}>
                          <span style={s.authorAvatar}>🤖</span>
                          <span style={s.authorName}>AI Help Desk</span>
                          {a.created_at && (
                            <span style={s.authorDate}>
                              · {new Date(a.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                          )}
                        </div>
                        <div style={s.articleContent}>{a.content}</div>
                        {a.tags?.length > 0 && (
                          <div style={s.tags}>
                            {a.tags.map(t => <span key={t} style={s.tag}>{t}</span>)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom CTA */}
          <div style={s.ctaBanner}>
            <div style={s.ctaLeft}>
              <strong style={s.ctaTitle}>Still need help?</strong>
              <span style={s.ctaSub}>Our support team usually responds within a few hours.</span>
            </div>
            <div style={s.ctaBtns}>
              <Link to="/ask"       style={s.btnPrimary}>Ask AI</Link>
              <Link to={ticketLink} style={s.btnOutline}>
                {user?.role === "user" ? "Ask a Question" : user ? "Go to Queue" : "Sign In to Get Help"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100%" },

  /* Quora-style white header */
  header: {
    background: "#fff",
    borderBottom: "1px solid #e8e8e8",
    padding: "24px 20px 20px",
    marginBottom: 20,
  },
  headerInner: { maxWidth: 720, margin: "0 auto" },
  breadcrumb: { display: "flex", alignItems: "center", gap: 6, marginBottom: 12 },
  breadLink:    { fontSize: 13, color: "#16c784", textDecoration: "none", fontWeight: 600 },
  breadSep:     { color: "#ccc", fontSize: 13 },
  breadCurrent: { fontSize: 13, color: "#939598" },
  pageTitle: { fontSize: 26, fontWeight: 800, margin: "0 0 6px", color: "#282829" },
  pageSub:   { color: "#939598", fontSize: 14, margin: "0 0 18px" },

  searchRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 12 },
  searchIcon: { color: "#939598", fontSize: 15, flexShrink: 0 },
  searchInput: {
    flex: 1, border: "1.5px solid #e8e8e8", borderRadius: 24,
    padding: "10px 16px", fontSize: 14, outline: "none", color: "#282829", background: "#f9f9f9",
  },
  searchBtn: {
    background: "#16c784", color: "#fff", border: "none",
    borderRadius: 20, padding: "10px 20px",
    fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
  },
  clearBtn: {
    background: "none", border: "1px solid #e8e8e8", color: "#939598",
    borderRadius: 20, padding: "10px 14px", fontSize: 13, cursor: "pointer",
  },
  askRow:  { display: "flex", alignItems: "center", gap: 10 },
  askHint: { fontSize: 13, color: "#939598" },
  askLink: { fontSize: 13, fontWeight: 700, color: "#16c784", textDecoration: "none" },

  body:  { padding: "0 20px 60px" },
  inner: { maxWidth: 720, margin: "0 auto" },

  /* Tabs */
  tabs: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 },
  tabBtn: {
    background: "#fff", border: "1.5px solid #e8e8e8",
    borderRadius: 20, padding: "6px 14px",
    fontSize: 13, fontWeight: 500, cursor: "pointer", color: "#555",
    display: "flex", alignItems: "center", gap: 6,
  },
  tabActive: { background: "#282829", color: "#fff", border: "1.5px solid #282829" },
  tabCount: {
    background: "#f2f2f0", color: "#939598",
    fontSize: 11, fontWeight: 700, padding: "1px 6px", borderRadius: 10,
  },
  tabCountActive: { background: "rgba(255,255,255,.2)", color: "#fff" },

  resultNote: { fontSize: 13, color: "#939598", marginBottom: 14 },
  loading:    { textAlign: "center", color: "#939598", padding: "60px 0", fontSize: 14 },

  empty:      { textAlign: "center", padding: "60px 0" },
  emptyIcon:  { fontSize: 40, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: 700, color: "#282829", marginBottom: 8 },
  emptySub:   { color: "#939598", fontSize: 14, marginBottom: 24 },
  emptyBtns:  { display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" },

  /* Article list */
  list: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 },
  articleCard: {
    background: "#fff", border: "1px solid #e8e8e8",
    borderRadius: 8, overflow: "hidden",
  },
  articleHeader: {
    width: "100%", background: "none", border: "none", cursor: "pointer",
    padding: "16px 20px", display: "flex", alignItems: "center",
    justifyContent: "space-between", gap: 12, textAlign: "left",
  },
  articleLeft: { display: "flex", alignItems: "center", gap: 10, flex: 1, flexWrap: "wrap" },
  catTag: {
    fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
    textTransform: "uppercase", letterSpacing: ".3px", whiteSpace: "nowrap",
  },
  articleTitle: { fontSize: 15, fontWeight: 600, color: "#282829" },
  chevron: { color: "#939598", fontSize: 12, flexShrink: 0 },

  articleBody: { borderTop: "1px solid #f2f2f0", padding: "16px 20px" },
  authorLine: { display: "flex", alignItems: "center", gap: 6, marginBottom: 12 },
  authorAvatar: { fontSize: 16 },
  authorName: { fontSize: 13, fontWeight: 700, color: "#282829" },
  authorDate: { fontSize: 13, color: "#939598" },
  articleContent: { fontSize: 14, color: "#282829", lineHeight: 1.75, whiteSpace: "pre-wrap" },
  tags: { display: "flex", gap: 6, marginTop: 14, flexWrap: "wrap" },
  tag:  { background: "#f7fafc", color: "#718096", fontSize: 12, padding: "3px 10px", borderRadius: 20, border: "1px solid #e2e8f0" },

  /* CTA Banner */
  ctaBanner: {
    background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8,
    padding: "20px 24px", display: "flex",
    alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap",
  },
  ctaLeft:  { display: "flex", flexDirection: "column", gap: 2 },
  ctaTitle: { fontSize: 15, color: "#282829" },
  ctaSub:   { fontSize: 13, color: "#939598" },
  ctaBtns:  { display: "flex", gap: 10, flexWrap: "wrap" },

  btnPrimary: {
    background: "#16c784", color: "#fff", borderRadius: 20,
    padding: "10px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none",
    display: "inline-block",
  },
  btnOutline: {
    background: "#fff", color: "#282829", border: "1.5px solid #e8e8e8",
    borderRadius: 20, padding: "10px 22px", fontSize: 14, fontWeight: 600,
    textDecoration: "none", display: "inline-block",
  },
};
