import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client";

const STATUS_COLOR = { open: "#f59e0b", pending: "#3b82f6", resolved: "#16c784", closed: "#939598" };
const PRI_COLOR   = { low: "#939598", medium: "#3b82f6", high: "#f97316", urgent: "#ef4444" };
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
                ...(filter === st ? { background: "#f0fdf8", color: "#16c784", fontWeight: 700 } : {}),
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
  page: { paddingTop: 16 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, gap: 16, flexWrap: "wrap" },
  title: { fontSize: 22, fontWeight: 700, margin: 0, color: "#282829" },
  sub: { fontSize: 13, color: "#939598", marginTop: 2 },
  filters: { display: "flex", gap: 4, background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8, padding: 4 },
  fBtn: { padding: "6px 14px", borderRadius: 6, border: "none", background: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#555", transition: "all .15s" },
  tableWrap: { background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8, overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#f7f7f5" },
  th: { textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 700, color: "#939598", textTransform: "uppercase", letterSpacing: ".5px" },
  tr: { borderTop: "1px solid #f2f2f0" },
  td: { padding: "14px 16px", fontSize: 14 },
  link: { color: "#282829", textDecoration: "none", fontWeight: 600 },
  badge: { fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10, textTransform: "uppercase", letterSpacing: ".4px" },
};
