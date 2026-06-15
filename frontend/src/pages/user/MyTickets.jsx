import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client";

const STATUS_COLOR = { open: "#3182ce", pending: "#d69e2e", resolved: "#16c784", closed: "#718096" };
const PRI_COLOR   = { low: "#48bb78",  medium: "#ecc94b",  high: "#ed8936",    urgent: "#e53e3e" };

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
        <div>
          <h2 style={s.title}>My Tickets</h2>
          <div style={s.sub}>{tickets.length} ticket{tickets.length !== 1 ? "s" : ""}</div>
        </div>
        <Link to="/new-ticket" style={s.newBtn}>+ New Ticket</Link>
      </div>

      {tickets.length === 0 ? (
        <div style={s.empty}>
          <div style={s.emptyIcon}>🎫</div>
          <div style={s.emptyText}>No tickets yet</div>
          <Link to="/new-ticket" style={s.emptyLink}>Submit your first ticket →</Link>
        </div>
      ) : (
        <div style={s.list}>
          {tickets.map(t => (
            <Link key={t.id} to={`/ticket/${t.id}`} style={s.row}>
              <div style={s.rowLeft}>
                <span style={{ ...s.dot, background: STATUS_COLOR[t.status] || "#718096" }} />
                <div>
                  <div style={s.subject}>{t.subject}</div>
                  <div style={s.meta}>#{t.id} · {new Date(t.created_at).toLocaleDateString()}</div>
                </div>
              </div>
              <div style={s.rowRight}>
                <span style={{ ...s.badge, background: PRI_COLOR[t.priority] + "22", color: PRI_COLOR[t.priority] }}>
                  {t.priority}
                </span>
                <span style={{ ...s.badge, background: STATUS_COLOR[t.status] + "22", color: STATUS_COLOR[t.status] }}>
                  {t.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  page: { maxWidth: 760, margin: "32px auto", padding: "0 20px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  title: { fontSize: 20, fontWeight: 700, margin: 0 },
  sub: { fontSize: 13, color: "#7a8794", marginTop: 2 },
  newBtn: { background: "#16c784", color: "#fff", padding: "9px 18px", borderRadius: 8, textDecoration: "none", fontWeight: 600, fontSize: 14, whiteSpace: "nowrap" },
  loading: { textAlign: "center", color: "#7a8794", marginTop: 80, fontSize: 14 },
  empty: { textAlign: "center", marginTop: 80 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 16, fontWeight: 600, color: "#4a5568", marginBottom: 8 },
  emptyLink: { color: "#16c784", fontWeight: 600, textDecoration: "none", fontSize: 14 },
  list: { display: "flex", flexDirection: "column", gap: 10 },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", borderRadius: 12, padding: "16px 20px", textDecoration: "none", color: "inherit", boxShadow: "0 2px 8px rgba(0,0,0,.05)", transition: "box-shadow .15s" },
  rowLeft: { display: "flex", alignItems: "center", gap: 14 },
  dot: { width: 10, height: 10, borderRadius: "50%", flexShrink: 0 },
  subject: { fontWeight: 600, fontSize: 15 },
  meta: { fontSize: 12, color: "#7a8794", marginTop: 2 },
  rowRight: { display: "flex", gap: 8, flexShrink: 0 },
  badge: { fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20 },
};
