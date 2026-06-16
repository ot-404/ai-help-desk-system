import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import PostComposer from "../components/PostComposer";
import { C } from "../theme";

const STATUS_COLOR = { open: C.warning, pending: C.primary, resolved: C.success, closed: C.light };

export default function StaffHome() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/tickets/").then((r) => setTickets(r.data || [])).finally(() => setLoading(false));
  }, []);

  const open = tickets.filter((t) => t.status === "open").length;
  const pending = tickets.filter((t) => t.status === "pending").length;
  const today = new Date().toDateString();
  const resolvedToday = tickets.filter((t) => ["resolved", "closed"].includes(t.status) && t.created_at && new Date(t.created_at).toDateString() === today).length;
  const active = tickets.filter((t) => ["open", "pending"].includes(t.status));

  const stats = [
    { label: "Open", value: open, color: C.warning },
    { label: "Pending", value: pending, color: C.primary },
    { label: "Resolved", value: resolvedToday, color: C.success },
  ];

  return (
    <div style={s.page}>
      <h1 style={s.h1}>Agent Dashboard</h1>
      <p style={s.sub}>Welcome back, {user?.name?.split(" ")[0] || "agent"}.</p>

      <PostComposer />

      <div style={s.statGrid}>
        {stats.map((st) => (
          <div key={st.label} style={s.statCard}>
            <div style={{ ...s.statNum, color: st.color }}>{st.value}</div>
            <div style={s.statLabel}>{st.label}</div>
          </div>
        ))}
      </div>

      <div style={s.sectionRow}>
        <span style={s.sectionTitle}>Needs Attention</span>
        <Link to="/agent" style={s.seeAll}>Full queue →</Link>
      </div>

      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr style={s.thead}>
              <th style={s.th}>#</th><th style={s.th}>Subject</th><th style={s.th}>By</th><th style={s.th}>Status</th><th style={s.th}></th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} style={s.center}>Loading…</td></tr>}
            {!loading && active.length === 0 && <tr><td colSpan={5} style={s.center}>Queue is clear.</td></tr>}
            {!loading && active.map((t) => {
              const sc = STATUS_COLOR[t.status] || C.light;
              return (
                <tr key={t.id} style={s.tr}>
                  <td style={{ ...s.td, color: C.light }}>{t.id}</td>
                  <td style={s.td}><Link to={`/question/${t.id}`} style={s.link}>{t.subject}</Link></td>
                  <td style={{ ...s.td, color: C.muted, fontSize: 13 }}>{t.user_name || `#${t.user_id}`}</td>
                  <td style={s.td}><span style={{ ...s.badge, background: sc + "22", color: sc }}>{t.status}</span></td>
                  <td style={s.td}><Link to={`/question/${t.id}`} style={s.actionBtn}>Open</Link></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const s = {
  page: { display: "flex", flexDirection: "column", gap: 14 },
  h1: { fontSize: 20, fontWeight: 600, color: C.text, margin: 0 },
  sub: { fontSize: 14, color: C.muted, margin: "-8px 0 0" },
  statGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 },
  statCard: { background: C.surface, border: "1px solid " + C.border, borderRadius: 4, padding: "16px 18px" },
  statNum: { fontSize: 28, fontWeight: 700, lineHeight: 1 },
  statLabel: { fontSize: 12, color: C.muted, marginTop: 6, fontWeight: 600 },
  sectionRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { fontSize: 13, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".6px" },
  seeAll: { fontSize: 13, color: C.primary, fontWeight: 700, textDecoration: "none" },
  tableWrap: { background: C.surface, border: "1px solid " + C.border, borderRadius: 4, overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", minWidth: 480 },
  thead: { background: C.bg },
  th: { textAlign: "left", padding: "10px 14px", fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".5px" },
  tr: { borderTop: "1px solid " + C.bg },
  td: { padding: "13px 14px", fontSize: 14 },
  center: { padding: "32px 0", textAlign: "center", color: C.light },
  link: { color: C.text, textDecoration: "none", fontWeight: 600 },
  badge: { fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10, textTransform: "uppercase" },
  actionBtn: { background: C.primary, color: "#fff", borderRadius: 6, padding: "5px 12px", fontSize: 12, fontWeight: 700, textDecoration: "none" },
};
