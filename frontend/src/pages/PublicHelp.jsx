import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

const TABS = ["All", "Blog", "FAQ", "Technical", "Account", "Billing", "General"];

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

  // Filter by selected tab
  const articles = tab === "All"
    ? allArticles
    : allArticles.filter(a => (a.category || "").toLowerCase() === tab.toLowerCase());

  const ticketLink = user?.role === "user" ? "/new-ticket" : "/login?next=/new-ticket";

  return (
    <div style={s.page}>
      <div style={s.topBar}>
        <div style={s.topInner}>
          <Link to="/" style={s.backLink}>← Home</Link>
          <h1 style={s.pageTitle}>Help Center</h1>
          <p style={s.pageSub}>Browse articles, blog posts, and AI-generated guides.</p>
          <form onSubmit={handleSearch} style={s.searchRow}>
            <input
              style={s.searchInput}
              placeholder="Search articles…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button type="submit" style={s.searchBtn}>Search</button>
            {params.get("q") && (
              <button type="button" style={s.clearBtn} onClick={() => { setQuery(""); setParams(tab !== "All" ? { tab } : {}); }}>
                Clear
              </button>
            )}
          </form>

          {/* Ask AI inline CTA */}
          <div style={s.askRow}>
            <span style={s.askText}>Can't find what you're looking for?</span>
            <Link to="/ask" style={s.askBtn}>🤖 Ask AI →</Link>
          </div>
        </div>
      </div>

      <div style={s.body}>
        <div style={s.inner}>
          {/* Tabs */}
          <div style={s.tabs}>
            {TABS.map(t => (
              <button
                key={t}
                style={{ ...s.tabBtn, ...(tab === t ? s.tabActive : {}) }}
                onClick={() => switchTab(t)}
              >
                {t === "Blog" ? "✍️ Blog" : t}
                {t !== "All" && (
                  <span style={s.tabCount}>
                    {allArticles.filter(a => t === "All" || (a.category || "").toLowerCase() === t.toLowerCase()).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {params.get("q") && (
            <div style={s.resultNote}>
              {loading ? "Searching…" : `${articles.length} result${articles.length !== 1 ? "s" : ""} for "${params.get("q")}"`}
            </div>
          )}

          {loading ? (
            <div style={s.loading}>Loading articles…</div>
          ) : articles.length === 0 ? (
            <div style={s.empty}>
              <div style={s.emptyIcon}>🔍</div>
              <div style={s.emptyTitle}>No articles found</div>
              <p style={s.emptySub}>Try a different search term, or ask our AI to generate an answer.</p>
              <div style={s.emptyBtns}>
                <Link to="/ask" style={s.btnPrimary}>Ask AI →</Link>
                <Link to={ticketLink} style={s.btnOutline}>
                  {user ? "Submit a Ticket" : "Sign In to Get Help"}
                </Link>
              </div>
            </div>
          ) : (
            <div style={s.list}>
              {articles.map(a => (
                <div key={a.id} style={{ ...s.articleCard, ...(a.category === "Blog" ? s.blogCard : {}) }}>
                  <button style={s.articleHeader} onClick={() => openArticle(a.id)}>
                    <div style={s.articleLeft}>
                      {a.category && (
                        <span style={{
                          ...s.catTag,
                          ...(a.category === "Blog" ? s.blogTag : {}),
                        }}>
                          {a.category === "Blog" ? "✍️ Blog" : a.category}
                        </span>
                      )}
                      <span style={s.articleTitle}>{a.title}</span>
                    </div>
                    <span style={s.chevron}>{expanded === a.id ? "▲" : "▼"}</span>
                  </button>
                  {expanded === a.id && (
                    <div style={s.articleBody}>
                      <div style={s.articleContent}>{a.content}</div>
                      {a.tags?.length > 0 && (
                        <div style={s.tags}>
                          {a.tags.map(t => <span key={t} style={s.tag}>{t}</span>)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Bottom CTA */}
          <div style={s.ctaBanner}>
            <div style={s.ctaLeft}>
              <strong style={s.ctaTitle}>Still need help?</strong>
              <span style={s.ctaSub}>Our support team usually responds within a few hours.</span>
            </div>
            <div style={s.ctaBtns}>
              <Link to="/ask" style={s.btnPrimary}>Ask AI</Link>
              <Link to={ticketLink} style={s.btnOutline}>
                {user?.role === "user" ? "Submit a Ticket" : user ? "Go to Queue" : "Sign In to Get Help"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100%", background: "#eef1f4" },

  topBar: { background: "#1f2a37", padding: "36px 20px 40px", color: "#fff" },
  topInner: { maxWidth: 760, margin: "0 auto" },
  backLink: { color: "#a0aec0", fontSize: 13, textDecoration: "none", display: "inline-block", marginBottom: 12 },
  pageTitle: { fontSize: 28, fontWeight: 800, margin: "0 0 8px", color: "#fff" },
  pageSub: { color: "#a0aec0", fontSize: 15, margin: "0 0 24px" },
  searchRow: { display: "flex", gap: 10, marginBottom: 16 },
  searchInput: { flex: 1, border: "none", borderRadius: 10, padding: "12px 16px", fontSize: 14, outline: "none", background: "#fff" },
  searchBtn: { background: "#16c784", color: "#fff", border: "none", borderRadius: 10, padding: "12px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  clearBtn: { background: "transparent", color: "#a0aec0", border: "1px solid #4a5568", borderRadius: 10, padding: "12px 16px", fontSize: 14, cursor: "pointer", whiteSpace: "nowrap" },
  askRow: { display: "flex", alignItems: "center", gap: 12 },
  askText: { color: "#a0aec0", fontSize: 13 },
  askBtn: { background: "rgba(22,199,132,.15)", color: "#16c784", borderRadius: 8, padding: "6px 14px", fontSize: 13, fontWeight: 700, textDecoration: "none", border: "1px solid rgba(22,199,132,.3)" },

  body: { padding: "28px 20px 60px" },
  inner: { maxWidth: 760, margin: "0 auto" },

  tabs: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 },
  tabBtn: { background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 20, padding: "6px 14px", fontSize: 13, fontWeight: 500, cursor: "pointer", color: "#4a5568", display: "flex", alignItems: "center", gap: 6 },
  tabActive: { background: "#1f2a37", color: "#fff", border: "1.5px solid #1f2a37" },
  tabCount: { background: "rgba(255,255,255,.2)", color: "inherit", fontSize: 11, fontWeight: 700, padding: "1px 6px", borderRadius: 10 },

  resultNote: { fontSize: 13, color: "#7a8794", marginBottom: 16 },
  loading: { textAlign: "center", color: "#7a8794", padding: "60px 0", fontSize: 14 },
  empty: { textAlign: "center", padding: "60px 0" },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: 700, color: "#1f2a37", marginBottom: 8 },
  emptySub: { color: "#7a8794", fontSize: 14, marginBottom: 24 },
  emptyBtns: { display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" },
  btnPrimary: { background: "#16c784", color: "#fff", borderRadius: 8, padding: "11px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none", display: "inline-block" },
  btnOutline: { background: "#fff", color: "#4a5568", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "11px 22px", fontSize: 14, fontWeight: 600, textDecoration: "none", display: "inline-block" },

  list: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 },
  articleCard: { background: "#fff", borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,.06)", overflow: "hidden" },
  blogCard: { border: "1.5px solid #e9d8fd" },
  articleHeader: { width: "100%", background: "none", border: "none", cursor: "pointer", padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, textAlign: "left" },
  articleLeft: { display: "flex", alignItems: "center", gap: 10, flex: 1, flexWrap: "wrap" },
  catTag: { background: "#f0fff4", color: "#16a34a", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: ".3px", whiteSpace: "nowrap" },
  blogTag: { background: "#faf5ff", color: "#7c3aed" },
  articleTitle: { fontSize: 15, fontWeight: 600, color: "#1f2a37" },
  chevron: { color: "#a0aec0", fontSize: 12, flexShrink: 0 },
  articleBody: { borderTop: "1px solid #f0f4f8", padding: "20px" },
  articleContent: { fontSize: 14, color: "#4a5568", lineHeight: 1.75, whiteSpace: "pre-wrap" },
  tags: { display: "flex", gap: 6, marginTop: 14, flexWrap: "wrap" },
  tag: { background: "#f7fafc", color: "#718096", fontSize: 12, padding: "3px 10px", borderRadius: 20, border: "1px solid #e2e8f0" },

  ctaBanner: { background: "#fff", borderRadius: 14, padding: "20px 24px", boxShadow: "0 2px 10px rgba(0,0,0,.06)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" },
  ctaLeft: { display: "flex", flexDirection: "column", gap: 2 },
  ctaTitle: { fontSize: 15, color: "#1f2a37" },
  ctaSub: { fontSize: 13, color: "#7a8794" },
  ctaBtns: { display: "flex", gap: 10, flexWrap: "wrap" },
};
