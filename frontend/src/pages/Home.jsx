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
  const [limit, setLimit] = useState(15);

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
    <div style={s.page}>
      <div style={s.head}>
        <h1 style={s.heading}>{heading || "All Questions"}</h1>
        <Link to="/new-question" style={s.askBtn}>Ask Question</Link>
      </div>

      <div style={s.subRow}>
        <span style={s.count}>{view.length} questions</span>
        <div style={s.tabs}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setLimit(15); }}
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
          <button style={s.loadMore} onClick={() => setLimit((l) => l + 15)}>Load more</button>
        </div>
      )}
    </div>
  );
}

const s = {
  page: { display: "flex", flexDirection: "column" },
  head: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  heading: { fontSize: 24, fontWeight: 500, color: C.text, margin: 0 },
  askBtn: { background: C.primary, color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 500, padding: "9px 12px", borderRadius: 4, whiteSpace: "nowrap" },
  subRow: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap", gap: 8 },
  count: { fontSize: 17, color: C.text },
  tabs: { display: "flex", border: `1px solid ${C.primary}`, borderRadius: 4, overflow: "hidden" },
  tab: { border: "none", background: C.surface, color: C.primary, padding: "8px 12px", fontSize: 13, cursor: "pointer", borderRight: `1px solid #cfe3f3` },
  tabActive: { background: "#e1ecf4", color: "#2c5777", fontWeight: 500 },
  loading: { textAlign: "center", color: C.light, padding: 32 },
  empty: { display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: 48, color: C.light },
  emptyTitle: { fontSize: 18, fontWeight: 600, color: C.muted },
  emptyLink: { color: C.primary, fontWeight: 600, textDecoration: "none" },
  feed: { display: "flex", flexDirection: "column", border: `1px solid ${C.border}`, borderBottom: "none", borderRadius: 4, overflow: "hidden" },
  loadMoreRow: { display: "flex", justifyContent: "center", padding: "16px 0 20px" },
  loadMore: { background: C.surface, border: `1px solid ${C.border}`, color: C.primary, fontWeight: 500, fontSize: 13, padding: "10px 28px", borderRadius: 4, cursor: "pointer" },
};
