import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

const STATUS_COLOR = { open: "#3182ce", pending: "#d69e2e", resolved: "#16c784", closed: "#718096" };
const PRI_COLOR    = { low: "#48bb78", medium: "#ecc94b", high: "#ed8936", urgent: "#e53e3e" };

function TicketCard({ t }) {
  return (
    <Link to={`/ticket/${t.id}`} style={s.card}>
      <div style={s.cardMeta}>
        <span style={{ ...s.badge, background: STATUS_COLOR[t.status] + "18", color: STATUS_COLOR[t.status] }}>
          {t.status}
        </span>
        <span style={{ ...s.badge, background: PRI_COLOR[t.priority] + "18", color: PRI_COLOR[t.priority] }}>
          {t.priority}
        </span>
        {t.priority === "urgent" && <span style={s.urgentPing}>Urgent</span>}
      </div>
      <div style={s.cardTitle}>{t.subject}</div>
      {t.description && (
        <div style={s.cardBody}>
          {t.description.slice(0, 160)}{t.description.length > 160 ? "…" : ""}
        </div>
      )}
      <div style={s.cardFooter}>
        <span style={s.footerMeta}>
          #{t.id}{t.user_name ? ` · ${t.user_name}` : ""} · {new Date(t.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
        <span style={s.footerLink}>Open ↗</span>
      </div>
    </Link>
  );
}

export default function StaffHome() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const firstName = user?.name?.split(" ")[0] || "there";

  const [tickets,    setTickets]    = useState([]);
  const [dashStats,  setDashStats]  = useState(null);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    const reqs = [api.get("/tickets/")];
    if (isAdmin) reqs.push(api.get("/dashboard/stats").catch(() => null));
    Promise.all(reqs).then(([t, d]) => {
      setTickets(t.data || []);
      if (d) setDashStats(d.data);
    }).finally(() => setLoading(false));
  }, [isAdmin]);

  const open    = tickets.filter(t => t.status === "open").length;
  const pending = tickets.filter(t => t.status === "pending").length;
  const urgent  = tickets.filter(t => t.priority === "urgent" && !["resolved","closed"].includes(t.status)).length;
  const active  = tickets.filter(t => ["open","pending"].includes(t.status)).slice(0, 6);

  return (
    <div style={s.page}>

      {/* ── Welcome / stats bar ────────────────────── */}
      <div style={s.welcomeCard}>
        <div style={s.welcomeLeft}>
          <div style={{ ...s.avatar, background: isAdmin ? "#805ad5" : "#3182ce" }}>
            {user?.name?.[0]?.toUpperCase() ?? "S"}
          </div>
          <div>
            <div style={s.welcomeTitle}>
              Good to see you, {firstName}
              <span style={{ ...s.rolePill, background: isAdmin ? "#faf5ff" : "#ebf8ff", color: isAdmin ? "#805ad5" : "#2b6cb0" }}>
                {user?.role}
              </span>
            </div>
            <div style={s.welcomeSub}>
              {open > 0
                ? `${open} open · ${pending} pending · ${urgent > 0 ? `${urgent} urgent` : "no urgent"} questions`
                : "Queue is clear — no open questions."}
            </div>
          </div>
        </div>
        <div style={s.welcomeActions}>
          <Link to="/ask"   style={s.askBtn}>Ask AI</Link>
          <Link to="/agent" style={s.queueBtn}>View Queue →</Link>
        </div>
      </div>

      {/* ── Admin stats strip ──────────────────────── */}
      {isAdmin && dashStats && (
        <div style={s.statsStrip}>
          {[
            ["Tickets",       dashStats.total_tickets,    "#282829"],
            ["Resolved",      dashStats.resolved,         "#16c784"],
            ["AI Deflection", `${dashStats.deflection_rate}%`, "#805ad5"],
            ["Users",         dashStats.total_users,      "#3182ce"],
            ["Visits Today",  dashStats.visits_today,     "#d69e2e"],
          ].map(([label, val, color]) => (
            <div key={label} style={s.statItem}>
              <div style={{ ...s.statNum, color }}>{val ?? "—"}</div>
              <div style={s.statLabel}>{label}</div>
            </div>
          ))}
          <Link to="/admin" style={s.statsLink}>Full analytics →</Link>
        </div>
      )}

      {/* ── Needs attention ─────────────────────────── */}
      <div style={s.sectionRow}>
        <span style={s.sectionTitle}>
          {active.length > 0 ? "Needs Attention" : "Queue"}
        </span>
        <Link to="/agent" style={s.seeAll}>Full queue →</Link>
      </div>

      {loading ? (
        <div style={s.loadingCard}>Loading tickets…</div>
      ) : active.length === 0 ? (
        <div style={s.emptyCard}>
          <span style={s.emptyText}>Queue is clear — no open questions!</span>
        </div>
      ) : (
        <div style={s.feed}>
          {active.map(t => <TicketCard key={t.id} t={t} />)}
        </div>
      )}

      {/* ── Quick actions ───────────────────────────── */}
      <div style={{ ...s.sectionRow, marginTop: 16 }}>
        <span style={s.sectionTitle}>Quick Actions</span>
      </div>
      <div style={s.actionsGrid}>
        <Link to="/agent"    style={s.actionCard}><span style={s.actionLabel}>Queue</span><span style={s.actionSub}>All questions</span></Link>
        <Link to="/admin/kb" style={s.actionCard}><span style={s.actionLabel}>Knowledge Base</span><span style={s.actionSub}>Add &amp; edit articles</span></Link>
        <Link to="/ask"      style={s.actionCard}><span style={s.actionLabel}>Ask AI</span><span style={s.actionSub}>Generate articles</span></Link>
        {isAdmin && <Link to="/admin"       style={s.actionCard}><span style={s.actionLabel}>Dashboard</span><span style={s.actionSub}>Analytics &amp; metrics</span></Link>}
        {isAdmin && <Link to="/admin/users" style={s.actionCard}><span style={s.actionLabel}>Users</span><span style={s.actionSub}>Manage roles</span></Link>}
      </div>

    </div>
  );
}

const s = {
  page: { paddingTop: 4, display: "flex", flexDirection: "column", gap: 8 },

  /* Welcome */
  welcomeCard: {
    background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8,
    padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap",
  },
  welcomeLeft:    { display: "flex", alignItems: "center", gap: 12 },
  avatar: {
    width: 44, height: 44, borderRadius: "50%", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 18, fontWeight: 700, flexShrink: 0,
  },
  welcomeTitle: { fontSize: 16, fontWeight: 700, color: "#282829", display: "flex", alignItems: "center", gap: 8 },
  rolePill: { fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, textTransform: "uppercase", letterSpacing: ".4px" },
  welcomeSub: { fontSize: 13, color: "#939598", marginTop: 3 },
  welcomeActions: { display: "flex", gap: 8 },
  askBtn:  { background: "#f0fdf8", color: "#16c784", border: "1.5px solid #c6f6d5", padding: "7px 14px", borderRadius: 20, fontSize: 13, fontWeight: 700, textDecoration: "none" },
  queueBtn:{ background: "#16c784", color: "#fff", padding: "7px 16px", borderRadius: 20, fontSize: 13, fontWeight: 700, textDecoration: "none" },

  /* Admin stats strip */
  statsStrip: {
    background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8,
    padding: "14px 20px", display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap",
  },
  statItem:  { textAlign: "center", padding: "4px 20px", borderRight: "1px solid #f2f2f0" },
  statNum:   { fontSize: 22, fontWeight: 800, lineHeight: 1 },
  statLabel: { fontSize: 11, color: "#939598", marginTop: 2, fontWeight: 500 },
  statsLink: { marginLeft: "auto", fontSize: 12, color: "#16c784", fontWeight: 600, textDecoration: "none", paddingLeft: 20 },

  /* Section */
  sectionRow:   { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "2px 0" },
  sectionTitle: { fontSize: 12, fontWeight: 700, color: "#939598", textTransform: "uppercase", letterSpacing: ".6px" },
  seeAll:       { fontSize: 13, color: "#16c784", fontWeight: 600, textDecoration: "none" },

  /* Feed */
  feed: { display: "flex", flexDirection: "column", gap: 6 },
  loadingCard: { background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8, padding: "32px 20px", textAlign: "center", color: "#939598", fontSize: 14 },
  emptyCard:   { background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8, padding: "32px 20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 },
  emptyIcon:   { fontSize: 28 },
  emptyText:   { fontSize: 14, color: "#939598" },

  /* Ticket card */
  card: {
    background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8,
    padding: "14px 18px", textDecoration: "none", color: "inherit",
    display: "flex", flexDirection: "column", gap: 0,
  },
  cardMeta: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8, alignItems: "center" },
  badge: { fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20 },
  urgentPing: { fontSize: 11, fontWeight: 700, color: "#e53e3e", background: "#fff5f5", padding: "2px 8px", borderRadius: 20 },
  cardTitle:  { fontSize: 15, fontWeight: 700, color: "#282829", lineHeight: 1.35, marginBottom: 6 },
  cardBody:   { fontSize: 13, color: "#555", lineHeight: 1.55, marginBottom: 6 },
  cardFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, paddingTop: 8, borderTop: "1px solid #f2f2f0" },
  footerMeta: { fontSize: 12, color: "#939598" },
  footerLink: { fontSize: 12, color: "#16c784", fontWeight: 600 },

  /* Quick actions grid */
  actionsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 8 },
  actionCard:  { background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8, padding: "14px 16px", textDecoration: "none", display: "flex", flexDirection: "column", gap: 4 },
  actionLabel: { fontSize: 14, fontWeight: 700, color: "#282829" },
  actionSub:   { fontSize: 12, color: "#939598" },
};
