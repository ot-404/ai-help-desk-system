import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client";

const STATUS_COLOR = { open: "#f59e0b", pending: "#3b82f6", resolved: "#16c784", closed: "#939598" };
const PRI_COLOR   = { low: "#939598", medium: "#3b82f6", high: "#f97316", urgent: "#ef4444" };

function TicketCard({ t }) {
  return (
    <div style={s.card}>
      <div style={s.cardMeta}>
        <span style={{ ...s.badge, background: STATUS_COLOR[t.status] + "22", color: STATUS_COLOR[t.status] }}>{t.status}</span>
        <span style={{ ...s.badge, background: PRI_COLOR[t.priority] + "22", color: PRI_COLOR[t.priority] }}>{t.priority}</span>
        <span style={s.ts}>{new Date(t.created_at).toLocaleDateString()}</span>
      </div>
      <Link to={`/question/${t.id}`} style={s.subject}>{t.subject}</Link>
      <div style={s.preview}>{t.description?.slice(0, 140)}{t.description?.length > 140 ? "…" : ""}</div>
      <div style={s.cardFooter}>
        <span style={s.footItem}>💬 {t.message_count ?? 0} responses</span>
        {t.csat_rating && <span style={s.footItem}>⭐ {t.csat_rating}/5</span>}
        {(t.status === "resolved" || t.status === "closed") && !t.csat_rating && (
          <Link to={`/question/${t.id}`} style={s.rateLink}>Rate this response</Link>
        )}
      </div>
    </div>
  );
}

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/tickets/").then(r => setTickets(r.data || [])).finally(() => setLoading(false));
  }, []);

  const shown = filter === "all" ? tickets : tickets.filter(t => t.status === filter);

  return (
    <div style={s.wrap}>
      <div style={s.topBar}>
        <h1 style={s.h1}>My Questions</h1>
        <Link to="/new-question" style={s.askBtn}>+ Ask a Question</Link>
      </div>

      <div style={s.tabs}>
        {["all", "open", "pending", "resolved", "closed"].map(f => (
          <button key={f} style={{ ...s.tab, ...(filter === f ? s.tabActive : {}) }} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading && <div style={s.empty}>Loading…</div>}
      {!loading && shown.length === 0 && (
        <div style={s.empty}>
          <div style={{ fontSize: 40, marginBottom: 12 }}></div>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>No questions yet</div>
          <div style={{ color: "#939598", marginBottom: 20 }}>Have a question? Ask it below.</div>
          <Link to="/new-question" style={s.askBtn}>Ask a Question</Link>
        </div>
      )}

      <div style={s.feed}>
        {shown.map(t => <TicketCard key={t.id} t={t} />)}
      </div>
    </div>
  );
}

const s = {
  wrap: { paddingTop: 16 },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  h1: { fontSize: 22, fontWeight: 700, margin: 0, color: "#282829" },
  askBtn: { background: "#16c784", color: "#fff", borderRadius: 20, padding: "8px 20px", textDecoration: "none", fontWeight: 700, fontSize: 14 },
  tabs: { display: "flex", gap: 4, marginBottom: 16, background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8, padding: 4 },
  tab: { border: "none", background: "none", padding: "6px 16px", borderRadius: 6, fontSize: 14, cursor: "pointer", color: "#555", fontWeight: 500 },
  tabActive: { background: "#f0fdf8", color: "#16c784", fontWeight: 700 },
  feed: { display: "flex", flexDirection: "column", gap: 12 },
  card: { background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8, padding: "16px 20px" },
  cardMeta: { display: "flex", gap: 8, marginBottom: 8, alignItems: "center" },
  badge: { fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10, textTransform: "uppercase", letterSpacing: ".4px" },
  ts: { fontSize: 12, color: "#939598", marginLeft: "auto" },
  subject: { display: "block", fontSize: 17, fontWeight: 700, color: "#282829", textDecoration: "none", marginBottom: 6, lineHeight: 1.4 },
  preview: { fontSize: 14, color: "#555", lineHeight: 1.5, marginBottom: 10 },
  cardFooter: { display: "flex", gap: 16, alignItems: "center", borderTop: "1px solid #f2f2f0", paddingTop: 8 },
  footItem: { fontSize: 13, color: "#939598" },
  rateLink: { fontSize: 13, color: "#16c784", textDecoration: "none", fontWeight: 600, marginLeft: "auto" },
  empty: { textAlign: "center", padding: "60px 20px", color: "#282829" },
};
