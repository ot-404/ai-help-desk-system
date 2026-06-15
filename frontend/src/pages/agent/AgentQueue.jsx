import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client";

const STATUS_COLOR = { open: "#3182ce", pending: "#d69e2e", resolved: "#16c784", closed: "#718096" };
const PRI_COLOR   = { low: "#48bb78",  medium: "#ecc94b",  high: "#ed8936",    urgent: "#e53e3e" };
const FILTERS = ["all", "open", "pending", "resolved", "closed"];

export default function AgentQueue() {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState("open");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const url = filter === "all" ? "/tickets/" : `/tickets/?status=${filter}`;
    api.get(url).then(r => setTickets(r.data)).finally(() => setLoading(false));
  }, [filter]);

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h2 style={s.title}>Support Queue</h2>
          <div style={s.sub}>{loading ? "Loading…" : `${tickets.length} ticket${tickets.length !== 1 ? "s" : ""}`}</div>
        </div>
        <div style={s.filters}>
          {FILTERS.map(st => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              style={{
                ...s.fBtn,
                ...(filter === st
                  ? st === "all"
                    ? { background: "#2d3748", color: "#fff", borderColor: "#2d3748" }
                    : { background: STATUS_COLOR[st], color: "#fff", borderColor: STATUS_COLOR[st] }
                  : {}),
              }}
            >
              {st.charAt(0).toUpperCase() + st.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr style={s.thead}>
              <th style={{ ...s.th, width: 48 }}>#</th>
              <th style={s.th}>Subject</th>
              <th style={s.th}>Submitted by</th>
              <th style={s.th}>Priority</th>
              <th style={s.th}>Status</th>
              <th style={s.th}>Created</th>
            </tr>
          </thead>
          <tbody>
            {!loading && tickets.map(t => (
              <tr key={t.id} style={s.tr}>
                <td style={{ ...s.td, color: "#a0aec0", fontSize: 13 }}>{t.id}</td>
                <td style={s.td}>
                  <Link to={`/ticket/${t.id}`} style={s.link}>{t.subject}</Link>
                </td>
                <td style={{ ...s.td, color: "#7a8794", fontSize: 13 }}>{t.user_name || `#${t.user_id}`}</td>
                <td style={s.td}>
                  <span style={{ ...s.badge, background: PRI_COLOR[t.priority] + "22", color: PRI_COLOR[t.priority] }}>
                    {t.priority}
                  </span>
                </td>
                <td style={s.td}>
                  <span style={{ ...s.badge, background: STATUS_COLOR[t.status] + "22", color: STATUS_COLOR[t.status] }}>
                    {t.status}
                  </span>
                </td>
                <td style={{ ...s.td, color: "#7a8794", fontSize: 13 }}>{new Date(t.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {!loading && tickets.length === 0 && (
              <tr>
                <td colSpan={6} style={{ ...s.td, textAlign: "center", color: "#a0aec0", padding: "40px 0" }}>
                  No tickets with status "{filter}".
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan={6} style={{ ...s.td, textAlign: "center", color: "#a0aec0", padding: "40px 0" }}>
                  Loading…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const s = {
  page: { maxWidth: 960, margin: "32px auto", padding: "0 20px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, gap: 16, flexWrap: "wrap" },
  title: { fontSize: 20, fontWeight: 700, margin: 0 },
  sub: { fontSize: 13, color: "#7a8794", marginTop: 2 },
  filters: { display: "flex", gap: 6, flexWrap: "wrap" },
  fBtn: { padding: "6px 14px", borderRadius: 20, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500, transition: "all .15s" },
  tableWrap: { background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,.06)" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#f7fafc" },
  th: { textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 700, color: "#a0aec0", textTransform: "uppercase", letterSpacing: ".5px" },
  tr: { borderTop: "1px solid #f0f4f8", transition: "background .12s" },
  td: { padding: "14px 16px", fontSize: 14 },
  link: { color: "#2b6cb0", textDecoration: "none", fontWeight: 500 },
  badge: { fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20 },
};
