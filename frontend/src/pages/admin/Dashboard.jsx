import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client";
import { C } from "../../theme";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function BarChart({ values }) {
  const max = Math.max(...values, 1);
  const w = 560, h = 200, pad = 30, gap = 18;
  const bw = (w - pad * 2 - gap * (values.length - 1)) / values.length;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: "auto" }}>
      {values.map((v, i) => {
        const bh = ((h - pad * 2) * v) / max;
        const x = pad + i * (bw + gap);
        const y = h - pad - bh;
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={bh} rx={4} fill={C.primary} />
            <text x={x + bw / 2} y={y - 6} textAnchor="middle" fontSize="11" fontWeight="700" fill={C.muted}>{v}</text>
            <text x={x + bw / 2} y={h - pad + 16} textAnchor="middle" fontSize="11" fill={C.light}>{DAYS[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Kpi({ label, value, color }) {
  return (
    <div style={s.kpi}>
      <div style={{ ...s.kpiNum, color: color || C.text }}>{value ?? "—"}</div>
      <div style={s.kpiLabel}>{label}</div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    api.get("/dashboard/stats").then((r) => setStats(r.data)).catch(() => setStats({}));
    api.get("/tickets/").then((r) => setActivity((r.data || []).slice(0, 6))).catch(() => {});
  }, []);

  if (!stats) return <div style={s.loading}>Loading…</div>;

  const open = stats.by_status?.open ?? stats.open_tickets ?? 0;
  const bars = (stats.tickets_per_day && stats.tickets_per_day.length === 7)
    ? stats.tickets_per_day
    : [4, 7, 5, 9, 6, 3, 8];

  return (
    <div style={s.page}>
      <h1 style={s.h1}>Admin Overview</h1>
      <p style={s.sub}>HD Systems platform analytics</p>

      <div style={s.kpiGrid}>
        <Kpi label="Users" value={stats.total_users} color={C.primary} />
        <Kpi label="Posts" value={stats.total_tickets} color={C.text} />
        <Kpi label="AI Queries" value={stats.ai_messages} color={C.ai} />
        <Kpi label="Open Tickets" value={open} color="#f59e0b" />
      </div>

      <div style={s.grid2}>
        <div style={s.card}>
          <div style={s.cardTitle}>Posts — last 7 days</div>
          <BarChart values={bars} />
        </div>
        <div style={s.card}>
          <div style={s.cardTitle}>Recent Activity</div>
          <div style={s.activityList}>
            {activity.length === 0 && <div style={s.dim}>No recent activity.</div>}
            {activity.map((t) => (
              <Link key={t.id} to={`/question/${t.id}`} style={s.activityItem}>
                <span style={s.activityDot} />
                <span style={s.activityText}>{t.subject}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>Quick Actions</div>
        <div style={s.actions}>
          <Link to="/admin/kb" style={s.actionBtn}>Seed KB</Link>
          <button style={s.actionGhost}>Export CSV</button>
          <Link to="/admin/users" style={s.actionGhost}>Manage Users</Link>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { display: "flex", flexDirection: "column", gap: 14 },
  loading: { textAlign: "center", color: C.light, marginTop: 60 },
  h1: { fontSize: 22, fontWeight: 800, color: C.text, margin: 0 },
  sub: { fontSize: 14, color: C.muted, margin: "-8px 0 0" },
  kpiGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 },
  kpi: { background: C.surface, border: "1px solid " + C.border, borderRadius: 8, padding: "18px 20px" },
  kpiNum: { fontSize: 28, fontWeight: 800, lineHeight: 1 },
  kpiLabel: { fontSize: 12, color: C.muted, marginTop: 6, fontWeight: 600 },
  grid2: { display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 12 },
  card: { background: C.surface, border: "1px solid " + C.border, borderRadius: 8, padding: 18 },
  cardTitle: { fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 14 },
  activityList: { display: "flex", flexDirection: "column", gap: 4 },
  activityItem: { display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid " + C.bg, textDecoration: "none" },
  activityDot: { width: 8, height: 8, borderRadius: "50%", background: C.primary, flexShrink: 0 },
  activityText: { fontSize: 13, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  dim: { fontSize: 13, color: C.light },
  actions: { display: "flex", gap: 10, flexWrap: "wrap" },
  actionBtn: { background: C.primary, color: "#fff", borderRadius: 8, padding: "9px 18px", fontSize: 14, fontWeight: 700, textDecoration: "none" },
  actionGhost: { background: "#fff", color: C.text, border: "1px solid " + C.border, borderRadius: 8, padding: "9px 18px", fontSize: 14, fontWeight: 600, textDecoration: "none" },
};
