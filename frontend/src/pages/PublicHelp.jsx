import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/client";
import PostCard from "../components/PostCard";
import { C } from "../theme";

const TABS = ["Newest", "Active", "Votes"];

export default function PublicHelp() {
  const [params, setParams] = useSearchParams();
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(params.get("q") || "");
  const [tab, setTab] = useState("Newest");

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
  if (tab === "Votes") articles.sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));

  return (
    <div>
      <h1 style={s.title}>Knowledge Base</h1>

      <form onSubmit={handleSearch} style={s.searchRow}>
        <input style={s.searchInput} placeholder="Search the knowledge base…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button type="submit" style={s.searchBtn}>Search</button>
      </form>

      <div style={s.subRow}>
        <span style={s.count}>{articles.length} articles</span>
        <div style={s.tabs}>
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{ ...s.tab, ...(tab === t ? s.tabActive : {}) }}>{t}</button>
          ))}
        </div>
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
  title: { fontSize: 20, fontWeight: 600, color: C.text, margin: "0 0 16px" },
  searchRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 16 },
  searchInput: { flex: 1, minWidth: 0, height: 40, border: `1px solid ${C.border}`, borderRadius: 6, padding: "0 12px", fontSize: 16, background: C.surface, boxSizing: "border-box" },
  searchBtn: { background: C.primary, color: "#fff", border: "none", borderRadius: 6, padding: "0 18px", height: 40, fontSize: 14, fontWeight: 600, cursor: "pointer" },
  subRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  count: { fontSize: 14, color: C.muted },
  tabs: { display: "flex", gap: 0 },
  tab: { border: "none", background: "none", color: C.muted, padding: "6px 10px", fontSize: 14, cursor: "pointer", borderBottom: "2px solid transparent" },
  tabActive: { color: C.primary, fontWeight: 600, borderBottom: `2px solid ${C.primary}` },
  loading: { textAlign: "center", color: C.light, padding: 48 },
  empty: { textAlign: "center", padding: 48, display: "flex", flexDirection: "column", gap: 10, alignItems: "center" },
  emptyTitle: { fontSize: 16, fontWeight: 600, color: C.muted },
  emptyLink: { color: C.primary, fontWeight: 600, textDecoration: "none" },
  feed: { display: "flex", flexDirection: "column", gap: 8 },
};
