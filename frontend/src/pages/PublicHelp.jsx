import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/client";
import { C, TYPE_BADGE, deriveType, timeAgo } from "../theme";

const CATS = ["All", "Blog", "FAQ", "Technical", "Account", "Billing", "General"];

export default function PublicHelp() {
  const [params, setParams] = useSearchParams();
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(params.get("q") || "");
  const [cat, setCat] = useState("All");
  const [expanded, setExpanded] = useState(params.get("article") ? parseInt(params.get("article")) : null);

  useEffect(() => {
    setLoading(true);
    const q = params.get("q");
    const req = q ? api.get(`/kb/search?q=${encodeURIComponent(q)}`) : api.get("/kb/");
    req.then((r) => {
      const data = Array.isArray(r.data) ? r.data : (r.data.results || []);
      setAll(data);
    }).catch(() => setAll([])).finally(() => setLoading(false));
    const a = params.get("article");
    if (a) setExpanded(parseInt(a));
  }, [params]);

  function handleSearch(e) {
    e.preventDefault();
    const next = new URLSearchParams();
    if (query) next.set("q", query);
    setParams(next);
    setExpanded(null);
  }

  const articles = cat === "All" ? all : all.filter((a) => (a.category || "").toLowerCase() === cat.toLowerCase());

  return (
    <div style={s.page}>
      <h1 style={s.title}>Knowledge Base</h1>
      <p style={s.sub}>The hub for tech professionals — browse {all.length} articles and guides.</p>

      <form onSubmit={handleSearch} style={s.searchRow}>
        <span style={s.searchIcon}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.light} strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        </span>
        <input style={s.searchInput} placeholder="Search the knowledge base…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button type="submit" style={s.searchBtn}>Search</button>
      </form>

      <div style={s.pills}>
        {CATS.map((t) => (
          <button key={t} onClick={() => { setCat(t); setExpanded(null); }} style={{ ...s.pill, ...(cat === t ? s.pillActive : {}) }}>{t}</button>
        ))}
      </div>

      {loading ? (
        <div style={s.loading}>Loading…</div>
      ) : articles.length === 0 ? (
        <div style={s.empty}>
          <div style={s.emptyTitle}>No articles found</div>
          <Link to="/ask" style={s.emptyLink}>Ask AI instead →</Link>
        </div>
      ) : (
        <div style={s.grid}>
          {articles.map((a) => {
            const type = deriveType(a.category);
            const badge = TYPE_BADGE[type];
            const open = expanded === a.id;
            return (
              <div key={a.id} style={{ ...s.articleCard, gridColumn: open ? "1 / -1" : "auto" }}>
                <button style={s.cardHead} onClick={() => setExpanded(open ? null : a.id)}>
                  <span style={{ ...s.catBadge, background: badge.bg, color: badge.color }}>{a.category || type}</span>
                  <span style={s.artTitle}>{a.title}</span>
                </button>
                {!open && <div style={s.excerpt}>{(a.content || "").slice(0, 120)}…</div>}
                {open && (
                  <div style={s.fullBody}>
                    <div style={s.byline}>HDS Bot · {a.created_at ? timeAgo(a.created_at) : "recently"}</div>
                    <div style={s.content}>{a.content}</div>
                    {a.tags?.length > 0 && (
                      <div style={s.tags}>{a.tags.map((t) => <span key={t} style={s.tag}>#{String(t).replace(/^#/, "")}</span>)}</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const s = {
  page: { display: "flex", flexDirection: "column", gap: 14 },
  title: { fontSize: 24, fontWeight: 800, color: C.text, margin: 0 },
  sub: { fontSize: 14, color: C.muted, margin: "-8px 0 0" },
  searchRow: { display: "flex", alignItems: "center", gap: 8, position: "relative" },
  searchIcon: { position: "absolute", left: 12, display: "flex" },
  searchInput: { flex: 1, height: 42, border: "1px solid " + C.border, borderRadius: 8, padding: "0 14px 0 36px", fontSize: 14, background: "#fff", boxSizing: "border-box" },
  searchBtn: { background: C.primary, color: "#fff", border: "none", borderRadius: 8, padding: "0 20px", height: 42, fontSize: 14, fontWeight: 700 },
  pills: { display: "flex", gap: 8, flexWrap: "wrap" },
  pill: { background: C.surface, border: "1px solid " + C.border, borderRadius: 20, padding: "6px 14px", fontSize: 13, fontWeight: 600, color: C.muted },
  pillActive: { background: C.primary, color: "#fff", borderColor: C.primary },
  loading: { textAlign: "center", color: C.light, padding: 48 },
  empty: { textAlign: "center", padding: 48, display: "flex", flexDirection: "column", gap: 10, alignItems: "center" },
  emptyTitle: { fontSize: 18, fontWeight: 700, color: C.muted },
  emptyLink: { color: C.primary, fontWeight: 700, textDecoration: "none" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 },
  articleCard: { background: C.surface, border: "1px solid " + C.border, borderRadius: 8, padding: 16, display: "flex", flexDirection: "column", gap: 8 },
  cardHead: { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8, background: "none", border: "none", textAlign: "left", padding: 0, width: "100%" },
  catBadge: { fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4 },
  artTitle: { fontSize: 15, fontWeight: 700, color: C.text, lineHeight: 1.35 },
  excerpt: { fontSize: 13, color: C.muted, lineHeight: 1.5 },
  fullBody: { borderTop: "1px solid " + C.bg, paddingTop: 12 },
  byline: { fontSize: 12, color: C.light, marginBottom: 10 },
  content: { fontSize: 14, color: C.text, lineHeight: 1.75, whiteSpace: "pre-wrap" },
  tags: { display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 },
  tag: { background: C.tagBg, color: C.tagText, fontSize: 12, padding: "2px 8px", borderRadius: 4 },
};
