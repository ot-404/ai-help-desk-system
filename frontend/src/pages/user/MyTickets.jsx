import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client";
import { C, timeAgo } from "../../theme";

const STATUS_COLOR = { open: "#f59e0b", pending: "#3b82f6", resolved: "#1a7f45", closed: C.light };

function PostRow({ t }) {
  const sc = STATUS_COLOR[t.status] || C.light;
  return (
    <div style={s.card}>
      <div style={s.meta}>
        <span style={{ ...s.badge, background: sc + "22", color: sc }}>{t.status}</span>
        <span style={s.ts}>{t.created_at ? timeAgo(t.created_at) : ""}</span>
      </div>
      <Link to={`/question/${t.id}`} style={s.subject}>{t.subject}</Link>
      {t.description && <div style={s.preview}>{t.description.slice(0, 140)}{t.description.length > 140 ? "…" : ""}</div>}
      <div style={s.footer}>
        <span style={s.footItem}>{t.message_count ?? 0} answers</span>
        <Link to={`/question/${t.id}`} style={s.open}>View →</Link>
      </div>
    </div>
  );
}

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [tab, setTab] = useState("posts");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/tickets/").then((r) => setTickets(r.data || [])).finally(() => setLoading(false));
  }, []);

  return (
    <div style={s.wrap}>
      <div style={s.top}>
        <h1 style={s.h1}>My Posts</h1>
        <Link to="/new-question" style={s.newBtn}>+ Create Post</Link>
      </div>

      <div style={s.tabs}>
        <button style={{ ...s.tab, ...(tab === "posts" ? s.tabActive : {}) }} onClick={() => setTab("posts")}>My Posts</button>
        <button style={{ ...s.tab, ...(tab === "saved" ? s.tabActive : {}) }} onClick={() => setTab("saved")}>Saved</button>
      </div>

      {loading && <div style={s.empty}>Loading…</div>}

      {!loading && tab === "saved" && (
        <div style={s.empty}>
          <div style={s.emptyTitle}>No saved posts</div>
          <div style={s.emptySub}>Posts you save will show up here.</div>
          <Link to="/" style={s.newBtn}>Browse feed</Link>
        </div>
      )}

      {!loading && tab === "posts" && tickets.length === 0 && (
        <div style={s.empty}>
          <div style={s.emptyTitle}>No posts yet</div>
          <div style={s.emptySub}>Share a question or discussion with the community.</div>
          <Link to="/new-question" style={s.newBtn}>Create your first post</Link>
        </div>
      )}

      {!loading && tab === "posts" && (
        <div style={s.feed}>{tickets.map((t) => <PostRow key={t.id} t={t} />)}</div>
      )}
    </div>
  );
}

const s = {
  wrap: { display: "flex", flexDirection: "column", gap: 14 },
  top: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  h1: { fontSize: 22, fontWeight: 800, color: C.text, margin: 0 },
  newBtn: { background: C.primary, color: "#fff", borderRadius: 8, padding: "9px 18px", textDecoration: "none", fontWeight: 700, fontSize: 14 },
  tabs: { display: "flex", gap: 8, background: C.surface, border: "1px solid " + C.border, borderRadius: 8, padding: 6 },
  tab: { border: "none", background: C.bg, color: C.muted, padding: "7px 18px", borderRadius: 20, fontSize: 14, fontWeight: 600 },
  tabActive: { background: C.primary, color: "#fff" },
  feed: { display: "flex", flexDirection: "column", gap: 12 },
  card: { background: C.surface, border: "1px solid " + C.border, borderRadius: 8, padding: "14px 18px" },
  meta: { display: "flex", gap: 8, marginBottom: 8, alignItems: "center" },
  badge: { fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10, textTransform: "uppercase" },
  ts: { fontSize: 12, color: C.light, marginLeft: "auto" },
  subject: { display: "block", fontSize: 16, fontWeight: 700, color: C.text, textDecoration: "none", marginBottom: 6, lineHeight: 1.4 },
  preview: { fontSize: 13, color: C.muted, lineHeight: 1.5, marginBottom: 10 },
  footer: { display: "flex", gap: 16, alignItems: "center", borderTop: "1px solid " + C.bg, paddingTop: 8 },
  footItem: { fontSize: 13, color: C.light },
  open: { fontSize: 13, color: C.primary, textDecoration: "none", fontWeight: 700, marginLeft: "auto" },
  empty: { textAlign: "center", padding: "60px 20px", display: "flex", flexDirection: "column", gap: 10, alignItems: "center" },
  emptyTitle: { fontSize: 18, fontWeight: 700, color: C.text },
  emptySub: { fontSize: 14, color: C.muted },
};
