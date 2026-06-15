import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client";

const STATUS_COLOR = { open: "#3182ce", pending: "#d69e2e", resolved: "#16c784", closed: "#718096" };
const PRI_COLOR = { low: "#48bb78", medium: "#ecc94b", high: "#ed8936", urgent: "#e53e3e" };

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/tickets/").then(r => setTickets(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={s.loading}>Loading…</div>;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h2 style={s.title}>My Tickets</h2>
        <Link to="/new-ticket" style={s.newBtn}>+ New Ticket</Link>
      </div>
      {tickets.length === 0 && <div style={s.empty}>No tickets yet. <Link to="/new-ticket">Submit one</Link>.</div>}
      <div style={s.list}>
        {tickets.map(t => (
          <Link key={t.id} to={`/ticket/${t.id}`} style={s.row}>
            <div style={s.rowLeft}>
              <span style={{ ...s.dot, background: STATUS_COLOR[t.status] || "#718096" }} />
              <div>
                <div style={s.subject}>{t.subject}</div>
                <div style={s.meta}>{new Date(t.created_at).toLocaleDateString()}</div>
              </div>
            </div>
            <div style={s.rowRight}>
              <span style={{ ...s.badge, background: PRI_COLOR[t.priority] + "22", color: PRI_COLOR[t.priority] }}>{t.priority}</span>
              <span style={{ ...s.badge, background: STATUS_COLOR[t.status] + "22", color: STATUS_COLOR[t.status] }}>{t.status}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

const s = {
  page: { maxWidth: 760, margin: "32px auto", padding: "0 20px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 700, margin: 0 },
  newBtn: { background: "#16c784", color: "#fff", padding: "8px 18px", borderRadius: 8, textDecoration: "none", fontWeight: 600, fontSize: 14 },
  loading: { textAlign: "center", color: "#7a8794", marginTop: 60 },
  empty: { color: "#7a8794", textAlign: "center", marginTop: 40 },
  list: { display: "flex", flexDirection: "column", gap: 10 },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", borderRadius: 12, padding: "16px 20px", textDecoration: "none", color: "inherit", boxShadow: "0 2px 8px rgba(0,0,0,.05)" },
  rowLeft: { display: "flex", alignItems: "center", gap: 14 },
  dot: { width: 10, height: 10, borderRadius: "50%", flexShrink: 0 },
  subject: { fontWeight: 600, fontSize: 15 },
  meta: { fontSize: 12, color: "#7a8794", marginTop: 2 },
  rowRight: { display: "flex", gap: 8 },
  badge: { fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 10 },
};
