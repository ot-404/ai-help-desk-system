import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/client";
import PostCard from "../components/PostCard";
import { C } from "../theme";

const TABS = [
  { key: "Hot", sort: "votes" },
  { key: "New", sort: "newest" },
  { key: "Top", sort: "votes" },
];

export default function PublicHelp() {
  const [params, setParams] = useSearchParams();
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(params.get("q") || "");
  const [tab, setTab] = useState("Hot");

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
  }

  const onVoteSuccess = (updated) => {
    setAll((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

  let articles = [...all];
  if (tab === "Top" || tab === "Hot") articles.sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));

  return (
    <div>
      <h1 style={s.title}>Knowledge Base</h1>

      <form onSubmit={handleSearch} style={s.searchCard}>
        <span style={s.searchIcon}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        </span>
        <input style={s.searchInput} placeholder="Search the knowledge base…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button type="submit" style={s.searchBtn}>Search</button>
      </form>

      <div style={s.tabsCard}>
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{ ...s.tab, ...(tab === t.key ? s.tabActive : {}) }}>{t.key}</button>
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
        <div style={s.feed}>
          {articles.map((a) => (
            <PostCard key={a.id} article={a} onVoteSuccess={onVoteSuccess} />
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  title: { fontSize: 20, fontWeight: 700, color: C.text, margin: "0 0 12px" },
  searchCard: { display: "flex", alignItems: "center", gap: 8, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: 8, marginBottom: 12, position: "relative" },
  searchIcon: { position: "absolute", left: 18, display: "flex", pointerEvents: "none" },
  searchInput: { flex: 1, minWidth: 0, height: 40, border: `1px solid ${C.border}`, borderRadius: 20, padding: "0 14px 0 38px", fontSize: 16, background: C.surfaceHover, boxSizing: "border-box" },
  searchBtn: { background: C.primary, color: "#fff", border: "none", borderRadius: 20, padding: "0 20px", height: 40, fontSize: 14, fontWeight: 700, cursor: "pointer", flexShrink: 0 },
  tabsCard: { display: "flex", gap: 4, background: C.surface, borderRadius: 4, border: `1px solid ${C.border}`, padding: 4, marginBottom: 12 },
  tab: { border: "none", background: "none", color: C.muted, padding: "8px 14px", fontSize: 14, fontWeight: 600, cursor: "pointer", borderRadius: 20, minHeight: 36 },
  tabActive: { background: C.border, color: C.text, fontWeight: 700 },
  loading: { textAlign: "center", color: C.light, padding: 48 },
  empty: { textAlign: "center", padding: 48, display: "flex", flexDirection: "column", gap: 10, alignItems: "center", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4 },
  emptyTitle: { fontSize: 16, fontWeight: 700, color: C.muted },
  emptyLink: { color: C.blue, fontWeight: 700, textDecoration: "none" },
  feed: { display: "flex", flexDirection: "column", gap: 4 },
};
