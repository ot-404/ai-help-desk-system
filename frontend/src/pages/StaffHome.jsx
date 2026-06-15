import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

const STATUS_COLOR = { open: "#3182ce", pending: "#d69e2e", resolved: "#16c784", closed: "#718096" };
const PRI_COLOR   = { low: "#48bb78", medium: "#ecc94b", high: "#ed8936", urgent: "#e53e3e" };

export default function StaffHome() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const firstName = user?.name?.split(" ")[0] || "there";

  const [tickets, setTickets] = useState([]);
  const [dashStats, setDashStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reqs = [api.get("/tickets/")];
    if (isAdmin) reqs.push(api.get("/dashboard/stats").catch(() => null));
    Promise.all(reqs).then(([t, d]) => {
      setTickets(t.data);
      if (d) setDashStats(d.data);
    }).finally(() => setLoading(false));
  }, [isAdmin]);

  const open    = tickets.filter(t => t.status === "open").length;
  const pending = tickets.filter(t => t.status === "pending").length;
  const urgent  = tickets.filter(t => t.priority === "urgent" && t.status !== "resolved" && t.status !== "closed").length;
  const recent  = tickets.filter(t => t.status === "open" || t.status === "pending").slice(0, 6);

  return (
    <div style={s.page}>
      {/* Hero — staff variant: indigo-tinted dark */}
      <div style={s.hero}>
        <div style={s.heroInner}>
          <div style={s.heroTag}>{isAdmin ? "Admin" : "Agent"} Dashboard</div>
          <h1 style={s.heroTitle}>Good to see you, {firstName}</h1>
          <p style={s.heroSub}>
            {open > 0
              ? `You have ${open} open ticket${open !== 1 ? "s" : ""} waiting for attention.`
              : "All caught up — no open tickets right now."}
          </p>

          {/* Queue stats */}
          <div style={s.statRow}>
            <div style={s.stat}>
              <div style={{ ...s.statNum, color: "#63b3ed" }}>{open}</div>
              <div style={s.statLabel}>Open</div>
            </div>
            <div style={s.statDivider} />
            <div style={s.stat}>
              <div style={{ ...s.statNum, color: "#f6e05e" }}>{pending}</div>
              <div style={s.statLabel}>Pending</div>
            </div>
            <div style={s.statDivider} />
            <div style={s.stat}>
              <div style={{ ...s.statNum, color: "#fc8181" }}>{urgent}</div>
              <div style={s.statLabel}>Urgent</div>
            </div>
            <div style={s.statDivider} />
            <div style={s.stat}>
              <div style={{ ...s.statNum, color: "#fff" }}>{tickets.length}</div>
              <div style={s.statLabel}>Total</div>
            </div>
            {isAdmin && dashStats && (
              <>
                <div style={s.statDivider} />
                <div style={s.stat}>
                  <div style={{ ...s.statNum, color: "#b794f4" }}>{dashStats.total_users ?? "—"}</div>
                  <div style={s.statLabel}>Users</div>
                </div>
                <div style={s.statDivider} />
                <div style={s.stat}>
                  <div style={{ ...s.statNum, color: "#76e4f7" }}>{dashStats.visits_today ?? "—"}</div>
                  <div style={s.statLabel}>Visits Today</div>
                </div>
              </>
            )}
          </div>

          <div style={s.heroBtns}>
            <Link to="/agent" style={s.btnPrimary}>View Full Queue</Link>
            <Link to="/admin/kb" style={s.btnOutline}>Knowledge Base</Link>
            {isAdmin && <Link to="/admin" style={s.btnOutlineAlt}>Analytics</Link>}
          </div>
        </div>
      </div>

      <div style={s.body}>
        <div style={s.inner}>
          {/* Active tickets */}
          <div style={s.sectionHeader}>
            <h2 style={s.sectionTitle}>
              {recent.length > 0 ? "Needs Attention" : "Queue"}
            </h2>
            <Link to="/agent" style={s.seeAll}>Full queue →</Link>
          </div>

          {loading ? (
            <div style={s.loading}>Loading…</div>
          ) : recent.length === 0 ? (
            <div style={s.empty}>
              <div style={s.emptyIcon}>✅</div>
              <h3 style={s.emptyTitle}>Queue is clear</h3>
              <p style={s.emptySub}>No open or pending tickets right now.</p>
            </div>
          ) : (
            <div style={s.grid}>
              {recent.map(t => (
                <Link key={t.id} to={`/ticket/${t.id}`} style={s.card}>
                  <div style={s.cardBadges}>
                    <span style={{ ...s.badge, background: STATUS_COLOR[t.status] + "22", color: STATUS_COLOR[t.status] }}>{t.status}</span>
                    <span style={{ ...s.badge, background: PRI_COLOR[t.priority] + "22", color: PRI_COLOR[t.priority] }}>{t.priority}</span>
                  </div>
                  <div style={s.cardTitle}>{t.subject}</div>
                  <div style={s.cardMeta}>
                    #{t.id}
                    {t.user_name ? ` · ${t.user_name}` : ""}
                    {" · "}{new Date(t.created_at).toLocaleDateString()}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Quick action cards */}
          <div style={{ ...s.sectionHeader, marginTop: 40 }}>
            <h2 style={s.sectionTitle}>Quick Actions</h2>
          </div>
          <div style={s.actionGrid}>
            <Link to="/agent" style={s.actionCard}>
              <div style={s.actionIcon}>📋</div>
              <div style={s.actionTitle}>Support Queue</div>
              <div style={s.actionSub}>View and manage all tickets</div>
            </Link>
            <Link to="/admin/kb" style={s.actionCard}>
              <div style={s.actionIcon}>📚</div>
              <div style={s.actionTitle}>Knowledge Base</div>
              <div style={s.actionSub}>Add and edit help articles</div>
            </Link>
            {isAdmin && (
              <>
                <Link to="/admin" style={s.actionCard}>
                  <div style={s.actionIcon}>📊</div>
                  <div style={s.actionTitle}>Analytics</div>
                  <div style={s.actionSub}>Stats, CSAT, SLA metrics</div>
                </Link>
                <Link to="/admin/users" style={s.actionCard}>
                  <div style={s.actionIcon}>👥</div>
                  <div style={s.actionTitle}>User Management</div>
                  <div style={s.actionSub}>Manage roles and accounts</div>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100%", background: "#eef1f4" },

  hero: { background: "linear-gradient(135deg, #1a202c 0%, #2d3748 60%, #3c366b 100%)", padding: "64px 20px 56px", textAlign: "center" },
  heroInner: { maxWidth: 700, margin: "0 auto" },
  heroTag: { display: "inline-block", background: "rgba(183,148,244,.18)", color: "#b794f4", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20, letterSpacing: ".5px", textTransform: "uppercase", marginBottom: 16 },
  heroTitle: { fontSize: 36, fontWeight: 800, color: "#fff", margin: "0 0 10px", lineHeight: 1.2 },
  heroSub: { fontSize: 15, color: "#a0aec0", margin: "0 0 28px" },

  statRow: { display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,.06)", borderRadius: 14, padding: "18px 28px", width: "fit-content", margin: "0 auto 28px", flexWrap: "wrap", gap: 0 },
  stat: { textAlign: "center", padding: "0 20px" },
  statNum: { fontSize: 28, fontWeight: 800, lineHeight: 1 },
  statLabel: { fontSize: 11, color: "#a0aec0", marginTop: 4, fontWeight: 500 },
  statDivider: { width: 1, height: 36, background: "rgba(255,255,255,.1)" },

  heroBtns: { display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" },
  btnPrimary: { background: "#805ad5", color: "#fff", borderRadius: 8, padding: "10px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none", display: "inline-block" },
  btnOutline: { border: "1.5px solid #4a5568", color: "#e2e8f0", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, textDecoration: "none", background: "transparent" },
  btnOutlineAlt: { border: "1.5px solid #553c9a", color: "#b794f4", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, textDecoration: "none", background: "transparent" },

  body: { padding: "40px 20px 56px" },
  inner: { maxWidth: 960, margin: "0 auto" },
  sectionHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
  sectionTitle: { fontSize: 18, fontWeight: 700, margin: 0, color: "#1f2a37" },
  seeAll: { color: "#805ad5", fontWeight: 600, fontSize: 13, textDecoration: "none" },

  loading: { textAlign: "center", color: "#7a8794", padding: "40px 0", fontSize: 14 },
  empty: { textAlign: "center", padding: "48px 0" },
  emptyIcon: { fontSize: 36, marginBottom: 10 },
  emptyTitle: { fontSize: 18, fontWeight: 700, color: "#1f2a37", marginBottom: 6, margin: "0 0 6px" },
  emptySub: { color: "#7a8794", fontSize: 14 },

  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14, marginBottom: 8 },
  card: { background: "#fff", borderRadius: 12, padding: "18px", boxShadow: "0 2px 10px rgba(0,0,0,.06)", textDecoration: "none", display: "block" },
  cardBadges: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 },
  badge: { fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20 },
  cardTitle: { fontSize: 14, fontWeight: 600, color: "#1f2a37", marginBottom: 6, lineHeight: 1.4 },
  cardMeta: { fontSize: 12, color: "#7a8794", lineHeight: 1.5 },

  actionGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 },
  actionCard: { background: "#fff", borderRadius: 14, padding: "22px 20px", boxShadow: "0 2px 10px rgba(0,0,0,.06)", textDecoration: "none", display: "block", transition: "box-shadow .2s" },
  actionIcon: { fontSize: 28, marginBottom: 10 },
  actionTitle: { fontSize: 15, fontWeight: 700, color: "#1f2a37", marginBottom: 4 },
  actionSub: { fontSize: 13, color: "#7a8794" },
};
