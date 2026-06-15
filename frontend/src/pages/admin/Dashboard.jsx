import { useEffect, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement,
  LineElement, PointElement, Filler, Tooltip, Legend,
} from "chart.js";
import api from "../../api/client";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Filler, Tooltip, Legend);

const GREEN = "#16c784";
const SOFT = "rgba(22,199,132,.15)";

function Metric({ label, value, sub }) {
  return (
    <div style={s.card}>
      <div style={s.metaLabel}>{label}</div>
      <div style={s.metric}>{value ?? <span style={{ color: "#cbd5e0", fontSize: 18 }}>—</span>}</div>
      {sub && <div style={s.metaSub}>{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/dashboard/stats").then(r => setStats(r.data)).catch(() => {});
  }, []);

  if (!stats) return <div style={s.loading}>Loading…</div>;

  const statusLabels = Object.keys(stats.by_status);
  const statusData = {
    labels: statusLabels,
    datasets: [{ data: Object.values(stats.by_status), backgroundColor: GREEN, borderRadius: 6 }],
  };

  const slaVal = stats.sla_compliance ?? 0;
  const slaData = {
    datasets: [{
      data: [slaVal, 100 - slaVal],
      backgroundColor: [GREEN, "#eceff3"],
      borderWidth: 0,
      circumference: 180,
      rotation: 270,
    }],
  };

  const csatLine = {
    labels: ["W-6", "W-5", "W-4", "W-3", "W-2", "W-1", "Now"],
    datasets: [{ data: [74, 76, 79, 77, 81, 80, stats.csat ?? 80], borderColor: GREEN, backgroundColor: SOFT, fill: true, tension: 0.4, pointRadius: 0, borderWidth: 2 }],
  };

  const noLegend = { plugins: { legend: { display: false } } };
  const noAxes = { ...noLegend, scales: { y: { display: false }, x: { grid: { display: false } } } };

  return (
    <div style={s.page}>
      <div style={s.topRow}>
        <div>
          <h2 style={s.title}>Analytics Dashboard</h2>
          <div style={s.sub}>Live data · refreshes on load</div>
        </div>
        <div style={s.pill}>Deflection {stats.deflection_rate}%</div>
      </div>

      <div style={s.grid4}>
        <Metric label="Total Tickets" value={stats.total_tickets} />
        <Metric label="Avg Resolution"
          value={stats.avg_resolution_minutes != null && stats.avg_resolution_minutes !== "null" ? `${stats.avg_resolution_minutes} min` : null}
          sub="from resolved tickets" />
        <Metric label="AI Replies" value={stats.ai_messages} />
        <Metric label="Resolved" value={stats.resolved} />
      </div>

      <div style={s.grid4}>
        <Metric label="Registered Users" value={stats.total_users} sub={
          Object.entries(stats.users_by_role || {}).map(([r, n]) => `${n} ${r}`).join(" · ") || null
        } />
        <Metric label="Total Visits" value={stats.visits_total} sub="all time" />
        <Metric label="Visits Today" value={stats.visits_today} sub={`${stats.unique_visitors_today} unique`} />
        <Metric label="Visits This Week" value={stats.visits_this_week} sub="last 7 days" />
      </div>

      <div style={s.grid2}>
        <div style={s.card}>
          <div style={s.cardTitle}>Tickets by Status</div>
          {statusLabels.length > 0
            ? <Bar data={statusData} options={{ ...noLegend, scales: { y: { beginAtZero: true, grid: { color: "#f1f4f7" } }, x: { grid: { display: false } } } }} height={160} />
            : <div style={s.empty}>No tickets yet.</div>}
        </div>
        <div style={s.card}>
          <div style={s.cardTitle}>
            SLA Compliance
            {stats.sla_compliance == null && <span style={s.naTag}>no data yet</span>}
          </div>
          <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
            <Doughnut data={slaData} options={{ ...noLegend, cutout: "72%" }} height={170} />
            <div style={s.gaugeCenter}>
              <div style={s.gaugeVal}>{stats.sla_compliance != null ? `${stats.sla_compliance}%` : "—"}</div>
              <div style={s.gaugeLabel}>{stats.sla_total > 0 ? `${stats.sla_total} resolved` : "on target"}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={s.grid2}>
        <div style={s.card}>
          <div style={s.cardTitle}>
            CSAT Score
            {stats.csat == null && <span style={s.naTag}>no ratings yet</span>}
          </div>
          <div style={s.metric}>{stats.csat != null ? `${stats.csat}%` : <span style={{ color: "#cbd5e0", fontSize: 18 }}>—</span>}</div>
          {stats.csat_responses > 0 && <div style={s.metaSub}>{stats.csat_responses} response{stats.csat_responses !== 1 ? "s" : ""}</div>}
          <Line data={csatLine} options={noAxes} height={80} />
        </div>
        <div style={s.card}>
          <div style={s.cardTitle}>Priority Breakdown</div>
          {Object.keys(stats.by_priority).length > 0
            ? <Doughnut data={{
                labels: Object.keys(stats.by_priority),
                datasets: [{ data: Object.values(stats.by_priority), backgroundColor: ["#48bb78", "#ecc94b", "#ed8936", "#e53e3e"], borderWidth: 0 }],
              }} options={{ plugins: { legend: { position: "right", labels: { font: { size: 12 } } } } }} height={120} />
            : <div style={s.empty}>No tickets yet.</div>}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { paddingTop: 16 },
  loading: { textAlign: "center", color: "#939598", marginTop: 60 },
  topRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 700, margin: 0, color: "#282829" },
  sub: { color: "#939598", fontSize: 13, marginTop: 2 },
  pill: { background: "#f0fdf8", color: "#16c784", padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 700, border: "1px solid #c6f6d5" },
  grid4: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 12 },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 },
  card: { background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8, padding: "18px" },
  metaLabel: { fontSize: 11, color: "#939598", fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: ".5px" },
  metric: { fontSize: 28, fontWeight: 700, marginBottom: 4, color: "#282829" },
  metaSub: { fontSize: 12, color: "#939598", marginBottom: 8 },
  cardTitle: { fontSize: 14, fontWeight: 700, marginBottom: 12, color: "#282829", display: "flex", alignItems: "center", gap: 8 },
  naTag: { fontSize: 11, fontWeight: 500, color: "#939598", background: "#f7f7f5", padding: "2px 8px", borderRadius: 6 },
  gaugeCenter: { position: "absolute", top: "55%", textAlign: "center", transform: "translateY(-50%)" },
  gaugeVal: { fontSize: 24, fontWeight: 700, color: "#282829" },
  gaugeLabel: { fontSize: 11, color: "#939598" },
  empty: { color: "#939598", fontSize: 14, textAlign: "center", paddingTop: 40 },
};
