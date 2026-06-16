import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import PostCard from "../components/PostCard";
import { C } from "../theme";

const TABS = [
  { key: "Newest", sort: "newest" },
  { key: "Active", sort: "newest" },
  { key: "Votes", sort: "votes" },
  { key: "Unanswered", sort: "newest" },
];

export default function Home({ heading }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("Newest");
  const [limit, setLimit] = useState(10);

  const current = TABS.find((t) => t.key === tab) || TABS[0];

  useEffect(() => {
    setLoading(true);
    api.get(`/kb/?sort=${current.sort}`)
      .then((r) => setArticles(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const onVoteSuccess = (updated) => {
    setArticles((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

  let view = [...articles];
  if (tab === "Unanswered") view = view.filter((a) => (a.answer_count || 0) === 0);
  const shown = view.slice(0, limit);

  return (
    <div>
      {heading && <h1 style={s.heading}>{heading}</h1>}

      <div style={s.subRow}>
        <span style={s.count}>{view.length} questions</span>
        <div style={s.tabs}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setLimit(10); }}
              style={{ ...s.tab, ...(tab === t.key ? s.tabActive : {}) }}
            >
              {t.key}
            </button>
          ))}
        </div>
      </div>

      {loading && <div style={s.loading}>Loading questions…</div>}

      {!loading && view.length === 0 && (
        <div style={s.empty}>
          <div style={s.emptyTitle}>No questions yet</div>
          <Link to="/new-question" style={s.emptyLink}>Ask the first question →</Link>
        </div>
      )}

      <div style={s.feed}>
        {shown.map((a) => (
          <PostCard key={a.id} article={a} onVoteSuccess={onVoteSuccess} />
        ))}
      </div>

      {!loading && limit < view.length && (
        <div style={s.loadMoreRow}>
          <button style={s.loadMore} onClick={() => setLimit((l) => l + 10)}>Load 10 more ↓</button>
        </div>
      )}
    </div>
  );
}

const s = {
  heading: { fontSize: 20, fontWeight: 600, color: C.text, margin: "0 0 16px" },
  subRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  count: { fontSize: 14, color: C.muted },
  tabs: { display: "flex", gap: 0 },
  tab: { border: "none", background: "none", color: C.muted, padding: "6px 10px", fontSize: 14, cursor: "pointer", borderBottom: "2px solid transparent" },
  tabActive: { color: C.primary, fontWeight: 600, borderBottom: `2px solid ${C.primary}` },
  loading: { textAlign: "center", color: C.light, padding: 32 },
  empty: { display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: 48, color: C.light },
  emptyTitle: { fontSize: 16, fontWeight: 600, color: C.muted },
  emptyLink: { color: C.primary, fontWeight: 600, textDecoration: "none" },
  feed: { display: "flex", flexDirection: "column", gap: 8 },
  loadMoreRow: { display: "flex", justifyContent: "center", padding: "20px 0" },
  loadMore: { background: "none", border: "none", color: C.primary, fontWeight: 500, fontSize: 14, cursor: "pointer" },
};
