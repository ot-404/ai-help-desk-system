import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import PostCard from "../components/PostCard";
import PostComposer from "../components/PostComposer";
import { C } from "../theme";

function TabIcon({ name }) {
  const p = (d) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {[].concat(d).map((x, i) => <path key={i} d={x} />)}
    </svg>
  );
  switch (name) {
    case "Hot": return p(["M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"]);
    case "Best": return p(["M12 2l2.4 7.4H22l-6 4.6 2.3 7.4-6.3-4.6L5.7 21.4 8 14 2 9.4h7.6z"]);
    case "New": return p(["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 6v6l4 2"]);
    case "Top": return p(["M23 6l-9.5 9.5-5-5L1 18", "M17 6h6v6"]);
    case "Rising": return p(["M4 17l6-6 4 4 8-8", "M14 7h7v7"]);
    default: return null;
  }
}

const TABS = [
  { key: "Hot", sort: "votes" },
  { key: "Best", sort: "votes" },
  { key: "New", sort: "newest" },
  { key: "Top", sort: "views" },
  { key: "Rising", sort: "newest" },
];

export default function Home({ heading }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("Hot");
  const [limit, setLimit] = useState(10);

  const current = TABS.find((t) => t.key === tab) || TABS[0];

  useEffect(() => {
    setLoading(true);
    api.get(`/tickets/feed`)
      .then((r) => setArticles(r.data || []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const onVoteSuccess = (updated) => {
    setArticles((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

  const view = [...articles];
  const shown = view.slice(0, limit);

  const onCreated = (ticket) => {
    setArticles((prev) => [ticket, ...prev]);
    setTab("New");
  };

  return (
    <div>
      <h1 style={s.heading}>{heading || "HD Systems Feed"}</h1>

      <PostComposer onCreated={onCreated} />

      <div style={s.tabsCard}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setLimit(10); }}
            style={{ ...s.tab, ...(tab === t.key ? s.tabActive : {}) }}
          >
            <TabIcon name={t.key} />
            {t.key}
          </button>
        ))}
      </div>

      {loading && <div style={s.loading}>Loading posts…</div>}

      {!loading && view.length === 0 && (
        <div style={s.empty}>
          <div style={s.emptyTitle}>No posts yet</div>
          <div style={s.emptySub}>Be the first to share something with the community.</div>
          <Link to="/new-question" style={s.emptyBtn}>Create the first post</Link>
        </div>
      )}

      <div style={s.feed}>
        {shown.map((a) => (
          <PostCard key={a.id} article={a} onVoteSuccess={onVoteSuccess} />
        ))}
      </div>

      {!loading && limit < view.length && (
        <div style={s.loadMoreRow}>
          <button style={s.loadMore} onClick={() => setLimit((l) => l + 10)}>View more posts</button>
        </div>
      )}
    </div>
  );
}

const s = {
  heading: { fontSize: 20, fontWeight: 700, color: C.text, margin: "0 0 14px", letterSpacing: -0.3 },
  tabsCard: { display: "flex", gap: 4, background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 5, marginBottom: 14, overflowX: "auto" },
  tab: { display: "inline-flex", alignItems: "center", gap: 6, border: "none", background: "none", color: C.muted, padding: "8px 15px", fontSize: 14, fontWeight: 500, cursor: "pointer", borderRadius: 8, whiteSpace: "nowrap", minHeight: 36 },
  tabActive: { background: C.gradient, color: "#fff", fontWeight: 600 },
  loading: { textAlign: "center", color: C.light, padding: 32 },
  empty: { display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: 48, color: C.light, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12 },
  emptyTitle: { fontSize: 16, fontWeight: 700, color: C.muted },
  emptySub: { fontSize: 14, color: C.light },
  emptyBtn: { background: C.gradient, color: "#fff", borderRadius: 10, padding: "9px 22px", fontWeight: 600, fontSize: 14, textDecoration: "none", marginTop: 4 },
  feed: { display: "flex", flexDirection: "column", gap: 10 },
  loadMoreRow: { display: "flex", justifyContent: "center", padding: "14px 0" },
  loadMore: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, color: C.primary, fontWeight: 600, fontSize: 14, cursor: "pointer", padding: "12px 24px", width: "100%" },
};
