import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function RightPanel() {
  const { user } = useAuth();
  const [adminStats, setAdminStats] = useState(null);
  const [tickets, setTickets]       = useState([]);
  const [kb, setKb]                 = useState([]);

  useEffect(() => {
    api.get("/kb/").then(r => setKb((r.data || []).slice(0, 5))).catch(() => {});
    if (!user) return;
    if (user.role === "admin") {
      api.get("/dashboard/stats").then(r => setAdminStats(r.data)).catch(() => {});
    } else if (user.role === "user") {
      api.get("/tickets/").then(r => setTickets(r.data || [])).catch(() => {});
    }
  }, [user]);

  return (
    <aside style={s.aside}>

      {/* ── Add Question CTA ─────────────────── */}
      <div style={s.addCard}>
        <Link to="/ask" style={s.addBtn}>Add Question</Link>
        {user?.role === "user" && (
          <Link to="/new-question" style={s.ticketBtn}>Ask a Question</Link>
        )}
      </div>

      {/* ── Admin stats ─────────────────────── */}
      {user?.role === "admin" && adminStats && (
        <div style={s.card}>
          <div style={s.cardHead}>Platform Overview</div>
          {[
            ["Total Tickets",  adminStats.total_tickets],
            ["Resolved",       adminStats.resolved],
            ["AI Deflection",  `${adminStats.deflection_rate}%`],
            ["Users",          adminStats.total_users],
            ["Visits Today",   adminStats.visits_today],
          ].map(([label, val]) => (
            <div key={label} style={s.statRow}>
              <span style={s.statLabel}>{label}</span>
              <span style={s.statVal}>{val ?? "—"}</span>
            </div>
          ))}
          <Link to="/admin" style={s.moreLink}>Full dashboard →</Link>
        </div>
      )}

      {/* ── Agent quick links ────────────────── */}
      {user?.role === "agent" && (
        <div style={s.card}>
          <div style={s.cardHead}>Quick Links</div>
          <Link to="/agent"    style={s.actionLink}>View Queue</Link>
          <Link to="/admin/kb" style={s.actionLink}>Knowledge Base</Link>
          <Link to="/ask"      style={s.actionLink}>Ask AI</Link>
        </div>
      )}

      {/* ── User ticket summary ──────────────── */}
      {user?.role === "user" && (
        <div style={s.card}>
          <div style={s.cardHead}>My Questions</div>
          {tickets.length === 0 ? (
            <div style={s.empty}>No tickets yet.</div>
          ) : (
            [
              ["Open",     tickets.filter(t => t.status === "open").length,    "#3182ce"],
              ["Pending",  tickets.filter(t => t.status === "pending").length, "#d69e2e"],
              ["Answered", tickets.filter(t => ["resolved","closed"].includes(t.status)).length, "#16c784"],
            ].map(([label, count, color]) => (
              <div key={label} style={s.statRow}>
                <span style={s.statLabel}>{label}</span>
                <span style={{ ...s.statVal, color }}>{count}</span>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Guest CTA ────────────────────────── */}
      {!user && (
        <div style={s.card}>
          <div style={s.cardHead}>What is AI Help Desk?</div>
          <p style={s.guestText}>
            Ask questions and get instant AI-powered answers. Your questions and answers are shared to help everyone.
          </p>
          <Link to="/register" style={s.addBtn}>Sign up free</Link>
          <Link to="/login"    style={s.moreLink}>Have an account? Sign in →</Link>
        </div>
      )}

      {/* ── Topics ───────────────────────────── */}
      <div style={s.card}>
        <div style={s.cardHead}>Topics</div>
        {["Password & Login", "Billing", "Security", "Account", "Technical"].map(topic => (
          <Link
            key={topic}
            to={`/help?tab=${encodeURIComponent(topic.split(" ")[0])}`}
            style={s.topicLink}
          >
            {topic}
          </Link>
        ))}
      </div>

      {/* ── Related Questions / KB ───────────── */}
      {kb.length > 0 && (
        <div style={s.card}>
          <div style={s.cardHead}>Related Questions</div>
          {kb.map(a => (
            <Link key={a.id} to={`/help?article=${a.id}`} style={s.kbLink}>
              {a.title}
            </Link>
          ))}
          <Link to="/help" style={s.moreLink}>Browse all →</Link>
        </div>
      )}

    </aside>
  );
}

const s = {
  aside: { width: 260, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12 },

  addCard: {
    background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8,
    padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8,
  },
  addBtn: {
    display: "block", textAlign: "center",
    background: "#16c784", color: "#fff",
    padding: "9px 0", borderRadius: 20,
    fontWeight: 700, fontSize: 14, textDecoration: "none",
  },
  ticketBtn: {
    display: "block", textAlign: "center",
    background: "none", border: "1.5px solid #e8e8e8", color: "#282829",
    padding: "8px 0", borderRadius: 20,
    fontWeight: 600, fontSize: 13, textDecoration: "none",
  },

  card: {
    background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8,
    padding: "16px", display: "flex", flexDirection: "column", gap: 0,
  },
  cardHead: { fontWeight: 700, fontSize: 14, color: "#282829", marginBottom: 12 },

  statRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #f2f2f0" },
  statLabel: { fontSize: 13, color: "#555" },
  statVal:   { fontWeight: 700, fontSize: 13, color: "#282829" },

  empty: { fontSize: 13, color: "#939598", paddingBottom: 8 },

  moreLink: { display: "block", marginTop: 12, fontSize: 12, color: "#16c784", textDecoration: "none", fontWeight: 600 },

  actionLink: {
    display: "block", padding: "8px 0",
    fontSize: 14, color: "#282829", textDecoration: "none",
    borderBottom: "1px solid #f2f2f0", fontWeight: 500,
  },

  guestText: { fontSize: 13, color: "#555", lineHeight: 1.6, margin: "0 0 12px" },

  topicLink: {
    display: "block", padding: "7px 0",
    fontSize: 13, color: "#282829", fontWeight: 500, textDecoration: "none",
    borderBottom: "1px solid #f2f2f0",
  },

  kbLink: {
    display: "block", padding: "7px 0",
    fontSize: 13, color: "#282829", textDecoration: "none",
    borderBottom: "1px solid #f2f2f0", lineHeight: 1.4,
  },
};
