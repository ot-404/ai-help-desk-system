import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

export default function PublicHelp() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(params.get("q") || "");
  const [expanded, setExpanded] = useState(params.get("article") ? parseInt(params.get("article")) : null);

  useEffect(() => {
    setLoading(true);
    const q = params.get("q");
    const req = q ? api.get(`/kb/search?q=${encodeURIComponent(q)}`) : api.get("/kb/");
    req.then(r => setArticles(r.data)).catch(() => setArticles([])).finally(() => setLoading(false));
  }, [params]);

  useEffect(() => {
    const articleId = params.get("article");
    if (articleId) setExpanded(parseInt(articleId));
  }, [params]);

  function handleSearch(e) {
    e.preventDefault();
    const next = new URLSearchParams();
    if (query) next.set("q", query);
    setParams(next);
    setExpanded(null);
  }

  function openArticle(id) {
    setExpanded(id === expanded ? null : id);
  }

  const ticketLink = user?.role === "user" ? "/new-ticket" : "/login?next=/new-ticket";
  const expandedArticle = articles.find(a => a.id === expanded);

  return (
    <div style={s.page}>
      <div style={s.topBar}>
        <div style={s.topInner}>
          <Link to="/" style={s.backLink}>← Home</Link>
          <h1 style={s.pageTitle}>Help Center</h1>
          <p style={s.pageSub}>Browse our knowledge base for answers to common questions.</p>
          <form onSubmit={handleSearch} style={s.searchRow}>
            <input
              style={s.searchInput}
              placeholder="Search articles…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button type="submit" style={s.searchBtn}>Search</button>
            {params.get("q") && (
              <button type="button" style={s.clearBtn} onClick={() => { setQuery(""); setParams({}); }}>Clear</button>
            )}
          </form>
        </div>
      </div>

      <div style={s.body}>
        <div style={s.inner}>
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
              <p style={s.emptySub}>Try a different search term, or submit a ticket and we'll help you directly.</p>
              <Link to={user?.role === "user" ? "/new-ticket" : "/login?next=/new-ticket"} style={s.btnPrimary}>
                {user ? "Submit a Ticket" : "Sign In to Get Help"}
              </Link>
            </div>
          ) : (
            <div style={s.list}>
              {articles.map(a => (
                <div key={a.id} style={s.articleCard}>
                  <button style={s.articleHeader} onClick={() => openArticle(a.id)}>
                    <div style={s.articleLeft}>
                      {a.category && <span style={s.catTag}>{a.category}</span>}
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

          {/* Sticky CTA */}
          <div style={s.ctaBanner}>
            <div style={s.ctaLeft}>
              <strong style={s.ctaTitle}>Can't find what you need?</strong>
              <span style={s.ctaSub}>Our support team usually responds within a few hours.</span>
            </div>
            <Link
              to={ticketLink}
              style={s.btnPrimary}
            >
              {user?.role === "user" ? "Submit a Ticket" : user ? "Go to Queue" : "Sign In to Get Help"}
            </Link>
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
  searchRow: { display: "flex", gap: 10 },
  searchInput: { flex: 1, border: "none", borderRadius: 10, padding: "12px 16px", fontSize: 14, outline: "none", background: "#fff" },
  searchBtn: { background: "#16c784", color: "#fff", border: "none", borderRadius: 10, padding: "12px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  clearBtn: { background: "transparent", color: "#a0aec0", border: "1px solid #4a5568", borderRadius: 10, padding: "12px 16px", fontSize: 14, cursor: "pointer", whiteSpace: "nowrap" },

  body: { padding: "32px 20px 60px" },
  inner: { maxWidth: 760, margin: "0 auto" },
  resultNote: { fontSize: 13, color: "#7a8794", marginBottom: 16 },

  loading: { textAlign: "center", color: "#7a8794", padding: "60px 0", fontSize: 14 },
  empty: { textAlign: "center", padding: "60px 0" },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: 700, color: "#1f2a37", marginBottom: 8 },
  emptySub: { color: "#7a8794", fontSize: 14, marginBottom: 24 },
  btnPrimary: { background: "#16c784", color: "#fff", borderRadius: 8, padding: "11px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none", display: "inline-block" },

  list: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 },
  articleCard: { background: "#fff", borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,.06)", overflow: "hidden" },
  articleHeader: { width: "100%", background: "none", border: "none", cursor: "pointer", padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, textAlign: "left" },
  articleLeft: { display: "flex", alignItems: "center", gap: 10, flex: 1, flexWrap: "wrap" },
  catTag: { background: "#f0fff4", color: "#16a34a", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: ".3px", whiteSpace: "nowrap" },
  articleTitle: { fontSize: 15, fontWeight: 600, color: "#1f2a37" },
  chevron: { color: "#a0aec0", fontSize: 12, flexShrink: 0 },
  articleBody: { borderTop: "1px solid #f0f4f8", padding: "20px" },
  articleContent: { fontSize: 14, color: "#4a5568", lineHeight: 1.7, whiteSpace: "pre-wrap" },
  tags: { display: "flex", gap: 6, marginTop: 14, flexWrap: "wrap" },
  tag: { background: "#f7fafc", color: "#718096", fontSize: 12, padding: "3px 10px", borderRadius: 20, border: "1px solid #e2e8f0" },

  ctaBanner: { background: "#fff", borderRadius: 14, padding: "20px 24px", boxShadow: "0 2px 10px rgba(0,0,0,.06)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" },
  ctaLeft: { display: "flex", flexDirection: "column", gap: 2 },
  ctaTitle: { fontSize: 15, color: "#1f2a37" },
  ctaSub: { fontSize: 13, color: "#7a8794" },
};
