import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import PostCard from "../components/PostCard";
import { C } from "../theme";

const TABS = [
  { key: "Top", desc: "Most answered" },
  { key: "Trending", desc: "Active recently" },
  { key: "New", desc: "Newest first" },
];

const score = (p) => (p.answer_count || 0) * 3 + (p.vote_count || 0);

function sortPosts(posts, tab) {
  const list = [...posts];
  if (tab === "New") {
    return list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  }
  if (tab === "Trending") {
    // engagement weighted by recency (last 7 days get a boost)
    const now = Date.now();
    const weight = (p) => {
      const ageDays = (now - new Date(p.created_at || 0)) / 86400000;
      const recency = Math.max(0, 7 - ageDays) / 7;
      return score(p) + recency * 5;
    };
    return list.sort((a, b) => weight(b) - weight(a));
  }
  // Top
  return list.sort((a, b) => score(b) - score(a) || new Date(b.created_at || 0) - new Date(a.created_at || 0));
}

export default function Popular() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("Top");

  useEffect(() => {
    setLoading(true);
    api.get("/tickets/feed")
      .then((r) => setPosts(r.data || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const onVoteSuccess = (updated) =>
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));

  const view = sortPosts(posts, tab);

  return (
    <div>
      <h1 style={s.heading}>Popular</h1>
      <p style={s.sub}>Trending questions and discussions from the community.</p>

      <div style={s.tabsCard}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{ ...s.tab, ...(tab === t.key ? s.tabActive : {}) }}
            title={t.desc}
          >
            {t.key}
          </button>
        ))}
      </div>

      {loading && <div style={s.loading}>Loading posts…</div>}

      {!loading && view.length === 0 && (
        <div style={s.empty}>
          <div style={s.emptyTitle}>No posts yet</div>
          <div style={s.emptySub}>Be the first to start a discussion.</div>
          <Link to="/new-question" style={s.emptyBtn}>Create a post</Link>
        </div>
      )}

      <div style={s.feed}>
        {view.map((p) => (
          <PostCard key={p.id} article={p} onVoteSuccess={onVoteSuccess} />
        ))}
      </div>
    </div>
  );
}

const s = {
  heading: { fontSize: 20, fontWeight: 700, color: C.text, margin: "0 0 4px", letterSpacing: -0.3 },
  sub: { fontSize: 14, color: C.muted, margin: "0 0 14px" },
  tabsCard: { display: "flex", gap: 4, background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 5, marginBottom: 14, overflowX: "auto" },
  tab: { display: "inline-flex", alignItems: "center", gap: 6, border: "none", background: "none", color: C.muted, padding: "8px 15px", fontSize: 14, fontWeight: 500, cursor: "pointer", borderRadius: 8, whiteSpace: "nowrap", minHeight: 36 },
  tabActive: { background: C.gradient, color: "#fff", fontWeight: 600 },
  loading: { textAlign: "center", color: C.light, padding: 32 },
  empty: { display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: 48, color: C.light, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12 },
  emptyTitle: { fontSize: 16, fontWeight: 700, color: C.muted },
  emptySub: { fontSize: 14, color: C.light },
  emptyBtn: { background: C.gradient, color: "#fff", borderRadius: 10, padding: "9px 22px", fontWeight: 600, fontSize: 14, textDecoration: "none", marginTop: 4 },
  feed: { display: "flex", flexDirection: "column", gap: 10 },
};
