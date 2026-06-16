import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useIsMobile } from "../hooks/useIsMobile";
import { C } from "../theme";

export default function RightPanel() {
  const isMobile = useIsMobile();
  const [articles, setArticles] = useState([]);
  const [hot, setHot] = useState([]);

  useEffect(() => {
    api.get("/kb/").then((r) => setArticles(r.data || [])).catch(() => {});
    api.get("/kb/?sort=views").then((r) => setHot((r.data || []).slice(0, 5))).catch(() => {});
  }, []);

  if (isMobile) return null;

  // Compute real top tags from KB articles
  const tagCounts = {};
  articles.forEach((a) => {
    (Array.isArray(a.tags) ? a.tags : []).forEach((t) => {
      const k = String(t).trim();
      if (k) tagCounts[k] = (tagCounts[k] || 0) + 1;
    });
  });
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return (
    <aside style={s.panel}>
      <div style={s.card}>
        <div style={s.title}>Ask a Question</div>
        <div style={s.ctaCol}>
          <Link to="/new-question" style={s.blueBtn}>Ask Question</Link>
          <Link to="/ask" style={s.purpleBtn}>Ask AI</Link>
        </div>
      </div>

      <div style={s.card}>
        <div style={s.title}>Top Tags</div>
        {topTags.length === 0 ? (
          <div style={s.muted}>No tags yet.</div>
        ) : (
          <div style={s.tags}>
            {topTags.map(([t, n]) => (
              <Link key={t} to={`/help?q=${encodeURIComponent(t)}`} style={s.tag}>
                {t} <span style={s.tagCount}>{n}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div style={s.card}>
        <div style={s.title}>Hot Questions</div>
        {hot.length === 0 ? (
          <div style={s.muted}>No questions yet.</div>
        ) : (
          <ul style={s.hotList}>
            {hot.map((a) => (
              <li key={a.id} style={s.hotItem}>
                <Link to={`/question/${a.id}`} style={s.hotLink}>{a.title}</Link>
                <span style={s.hotViews}>{a.views || 0} views</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={s.card}>
        <div style={s.title}>About HD Systems</div>
        <div style={s.about}>
          HD Systems is a community-driven help desk where you can ask questions,
          search the knowledge base, and get instant answers from our AI assistant.
        </div>
        <div style={s.statRow}>
          <span style={s.statLabel}>Articles</span>
          <span style={s.statVal}>{articles.length}</span>
        </div>
        <div style={s.statRow}>
          <span style={s.statLabel}>Tags</span>
          <span style={s.statVal}>{Object.keys(tagCounts).length}</span>
        </div>
      </div>
    </aside>
  );
}

const s = {
  panel: { width: 280, flexShrink: 0, paddingTop: 16, position: "sticky", top: 60, height: "calc(100vh - 60px)", overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 },
  card: { background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 6, padding: 14 },
  title: { fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 10 },
  ctaCol: { display: "flex", flexDirection: "column", gap: 8 },
  blueBtn: { background: C.primary, color: "#fff", textAlign: "center", padding: "9px 0", borderRadius: 4, fontSize: 13, fontWeight: 500, textDecoration: "none" },
  purpleBtn: { background: C.purple, color: "#fff", textAlign: "center", padding: "9px 0", borderRadius: 4, fontSize: 13, fontWeight: 500, textDecoration: "none" },
  tags: { display: "flex", flexWrap: "wrap", gap: 6 },
  tag: { background: C.tag, color: C.tagText, border: `1px solid #a4c2d9`, fontSize: 12, padding: "3px 8px", borderRadius: 3, textDecoration: "none" },
  tagCount: { color: C.muted, fontSize: 11 },
  hotList: { listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 },
  hotItem: { display: "flex", flexDirection: "column", gap: 2, borderTop: `1px solid ${C.border}`, paddingTop: 8 },
  hotLink: { fontSize: 13, color: C.primary, textDecoration: "none", lineHeight: 1.35, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" },
  hotViews: { fontSize: 11, color: C.muted },
  about: { fontSize: 13, color: C.muted, marginBottom: 12, lineHeight: 1.5 },
  statRow: { display: "flex", justifyContent: "space-between", padding: "5px 0", borderTop: `1px solid ${C.border}` },
  statLabel: { fontSize: 13, color: C.muted },
  statVal: { fontSize: 14, fontWeight: 600, color: C.text },
  muted: { fontSize: 13, color: C.muted },
};
