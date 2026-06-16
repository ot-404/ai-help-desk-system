import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import PostCard from "../components/PostCard";
import { C } from "../theme";

const TABS = ["Hot", "New", "Top", "Rising"];

export default function Home({ heading }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("Hot");
  const [votes, setVotes] = useState({});
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    api.get("/kb/")
      .then((r) => {
        const data = r.data || [];
        setArticles(data);
        const init = {};
        data.forEach((a) => { init[a.id] = { up: false, down: false, count: Math.floor(Math.random() * 490) + 10 }; });
        setVotes(init);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const onVote = (id, dir) => {
    setVotes((prev) => {
      const cur = prev[id] || { up: false, down: false, count: 0 };
      if (dir === "up") {
        const was = cur.up;
        return { ...prev, [id]: { up: !was, down: false, count: cur.count + (was ? -1 : 1) + (cur.down ? 1 : 0) } };
      }
      const was = cur.down;
      return { ...prev, [id]: { down: !was, up: false, count: cur.count + (was ? 1 : -1) + (cur.up ? -1 : 0) } };
    });
  };

  const sorted = [...articles].sort((a, b) => {
    if (tab === "New") return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    if (tab === "Top" || tab === "Hot") return (votes[b.id]?.count || 0) - (votes[a.id]?.count || 0);
    return (a.id || 0) - (b.id || 0);
  });
  const shown = sorted.slice(0, limit);

  return (
    <div style={s.page}>
      {heading && <h1 style={s.heading}>{heading}</h1>}

      <div style={s.tabs}>
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ ...s.tab, ...(tab === t ? s.tabActive : {}) }}>{t}</button>
        ))}
      </div>

      {loading && <div style={s.loading}>Loading posts…</div>}

      {!loading && articles.length === 0 && (
        <div style={s.empty}>
          <div style={s.emptyTitle}>No posts yet</div>
          <Link to="/new-question" style={s.emptyLink}>Create the first post →</Link>
        </div>
      )}

      <div style={s.feed}>
        {shown.map((a) => (
          <PostCard key={a.id} article={a} vote={votes[a.id]} onVote={onVote} />
        ))}
      </div>

      {!loading && limit < sorted.length && (
        <div style={s.loadMoreRow}>
          <button style={s.loadMore} onClick={() => setLimit((l) => l + 10)}>Load more</button>
        </div>
      )}
    </div>
  );
}

const s = {
  page: { display: "flex", flexDirection: "column", gap: 12 },
  heading: { fontSize: 22, fontWeight: 800, color: C.text, margin: "0 0 2px" },
  tabs: { display: "flex", gap: 8, background: C.surface, border: "1px solid " + C.border, borderRadius: 8, padding: 6 },
  tab: { border: "none", background: C.bg, color: C.muted, padding: "7px 16px", borderRadius: 20, fontSize: 14, fontWeight: 600 },
  tabActive: { background: C.primary, color: "#fff" },
  loading: { textAlign: "center", color: C.light, padding: 32 },
  empty: { display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: 48, color: C.light },
  emptyTitle: { fontSize: 18, fontWeight: 700, color: C.muted },
  emptyLink: { color: C.primary, fontWeight: 700, textDecoration: "none" },
  feed: { display: "flex", flexDirection: "column", gap: 12 },
  loadMoreRow: { display: "flex", justifyContent: "center", padding: "8px 0 20px" },
  loadMore: { background: C.surface, border: "1px solid " + C.border, color: C.primary, fontWeight: 700, fontSize: 14, padding: "10px 28px", borderRadius: 20 },
};
