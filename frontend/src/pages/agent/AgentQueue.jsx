import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client";

const STATUS_COLOR = { open: "#3182ce", pending: "#d69e2e", resolved: "#16c784", closed: "#718096" };
const PRI_COLOR = { low: "#48bb78", medium: "#ecc94b", high: "#ed8936", urgent: "#e53e3e" };

export default function AgentQueue() {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState("open");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/tickets/?status=${filter}`).then(r => setTickets(r.data)).finally(() => setLoading(false));
  }, [filter]);

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h2 style={s.title}>Support Queue</h2>
        <div style={s.filters}>
          {["open", "pending", "resolved", "closed"].map(st => (
            <button key={st} onClick={() => setFilter(st)}
              style={{ ...s.fBtn, ...(filter === st ? { background: STATUS_COLOR[st], color: "#fff", borderColor: STATUS_COLOR[st] } : {}) }}>
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? <div style={s.loading}>Loading…</div> : (
        <table style={s.table}>
          <thead>
            <tr style={s.thead}>
              <th style={s.th}>#</th>
              <th style={s.th}>Subject</th>
              <th style={s.th}>Priority</th>
              <th style={s.th}>Status</th>
              <th style={s.th}>Created</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(t => (
              <tr key={t.id} style={s.tr}>
                <td style={s.td}>{t.id}</td>
                <td style={s.td}>
                  <Link to={`/ticket/${t.id}`} style={s.link}>{t.subject}</Link>
                </td>
                <td style={s.td}>
                  <span style={{ ...s.badge, background: PRI_COLOR[t.priority] + "22", color: PRI_COLOR[t.priority] }}>{t.priority}</span>
                </td>
                <td style={s.td}>
                  <span style={{ ...s.badge, background: STATUS_COLOR[t.status] + "22", color: STATUS_COLOR[t.status] }}>{t.status}</span>
                </td>
                <td style={s.td}>{new Date(t.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr><td colSpan={5} style={{ ...s.td, textAlign: "center", color: "#7a8794" }}>No tickets in this state.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

const s = {
  page: { maxWidth: 900, margin: "32px auto", padding: "0 20px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 700, margin: 0 },
  filters: { display: "flex", gap: 6 },
  fBtn: { padding: "6px 14px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500 },
  loading: { textAlign: "center", color: "#7a8794", marginTop: 40 },
  table: { width: "100%", background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,.06)", borderCollapse: "collapse" },
  thead: { background: "#f7fafc" },
  th: { textAlign: "left", padding: "12px 16px", fontSize: 12, fontWeight: 700, color: "#7a8794", textTransform: "uppercase", letterSpacing: ".5px" },
  tr: { borderTop: "1px solid #f0f4f8" },
  td: { padding: "14px 16px", fontSize: 14 },
  link: { color: "#2b6cb0", textDecoration: "none", fontWeight: 500 },
  badge: { fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 10 },
};
