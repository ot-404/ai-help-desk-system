import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/client";
import PostCard from "../components/PostCard";
import { C } from "../theme";

export default function PublicHelp() {
  const [params, setParams] = useSearchParams();
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(params.get("q") || "");
  const [activeTag, setActiveTag] = useState("");

  useEffect(() => {
    setLoading(true);
    const q = params.get("q");
    const req = q ? api.get(`/kb/search?q=${encodeURIComponent(q)}`) : api.get("/kb/");
    req.then((r) => {
      const data = Array.isArray(r.data) ? r.data : (r.data.results || []);
      setAll(data);
    }).catch(() => setAll([])).finally(() => setLoading(false));
  }, [params]);

  function handleSearch(e) {
    e.preventDefault();
    const next = new URLSearchParams();
    if (query) next.set("q", query);
    setParams(next);
    setActiveTag("");
  }

  const onVoteSuccess = (updated) => {
    setAll((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

  // Build tag list from articles
  const tagCounts = {};
  all.forEach((a) => (Array.isArray(a.tags) ? a.tags : []).forEach((t) => {
    const k = String(t).trim();
    if (k) tagCounts[k] = (tagCounts[k] || 0) + 1;
  }));
  const tags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

  const articles = activeTag
    ? all.filter((a) => (a.tags || []).includes(activeTag))
    : all;

  return (
    <div style={s.page}>
      <h1 style={s.title}>Knowledge Base</h1>

      <form onSubmit={handleSearch} style={s.searchRow}>
        <span style={s.searchIcon}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.light} strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        </span>
        <input style={s.searchInput} placeholder="Search the knowledge base…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button type="submit" style={s.searchBtn}>Search</button>
      </form>

      <div style={s.layout}>
        <aside style={s.tagSide}>
          <div style={s.tagHead}>Filter by tag</div>
          <div style={s.tagList}>
            <button
              style={{ ...s.tagLink, ...(activeTag === "" ? s.tagActive : {}) }}
              onClick={() => setActiveTag("")}
            >
              All ({all.length})
            </button>
            {tags.map(([t, n]) => (
              <button
                key={t}
                style={{ ...s.tagLink, ...(activeTag === t ? s.tagActive : {}) }}
                onClick={() => setActiveTag(t)}
              >
                {t} ({n})
              </button>
            ))}
          </div>
        </aside>

        <main style={s.main}>
          <div style={s.count}>{articles.length} articles</div>
          {loading ? (
            <div style={s.loading}>Loading…</div>
          ) : articles.length === 0 ? (
            <div style={s.empty}>
              <div style={s.emptyTitle}>No articles found</div>
              <Link to="/ask" style={s.emptyLink}>Ask AI instead →</Link>
            </div>
          ) : (
            <div style={s.feed}>
              {articles.map((a) => (
                <PostCard key={a.id} article={a} onVoteSuccess={onVoteSuccess} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const s = {
  page: { display: "flex", flexDirection: "column", gap: 14 },
  title: { fontSize: 24, fontWeight: 500, color: C.text, margin: 0 },
  searchRow: { display: "flex", alignItems: "center", gap: 8, position: "relative" },
  searchIcon: { position: "absolute", left: 12, display: "flex" },
  searchInput: { flex: 1, height: 40, border: `1px solid #babfc4`, borderRadius: 4, padding: "0 14px 0 36px", fontSize: 14, background: "#fff", boxSizing: "border-box" },
  searchBtn: { background: C.primary, color: "#fff", border: "none", borderRadius: 4, padding: "0 20px", height: 40, fontSize: 14, fontWeight: 500, cursor: "pointer" },
  layout: { display: "flex", gap: 20, alignItems: "flex-start" },
  tagSide: { width: 200, flexShrink: 0 },
  tagHead: { fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 8 },
  tagList: { display: "flex", flexDirection: "column", gap: 2 },
  tagLink: { background: "none", border: "none", textAlign: "left", padding: "6px 8px", fontSize: 13, color: C.tagText, borderRadius: 3, cursor: "pointer" },
  tagActive: { background: C.tag, fontWeight: 600 },
  main: { flex: 1, minWidth: 0 },
  count: { fontSize: 14, color: C.muted, marginBottom: 8 },
  loading: { textAlign: "center", color: C.light, padding: 48 },
  empty: { textAlign: "center", padding: 48, display: "flex", flexDirection: "column", gap: 10, alignItems: "center" },
  emptyTitle: { fontSize: 18, fontWeight: 600, color: C.muted },
  emptyLink: { color: C.primary, fontWeight: 600, textDecoration: "none" },
  feed: { display: "flex", flexDirection: "column", border: `1px solid ${C.border}`, borderBottom: "none", borderRadius: 4, overflow: "hidden" },
};
