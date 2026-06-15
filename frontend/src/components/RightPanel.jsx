import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useIsMobile } from "../hooks/useIsMobile";

const TOPICS = [
  { label: "Password & Login", to: "/help?category=password" },
  { label: "Billing", to: "/help?category=billing" },
  { label: "Security", to: "/help?category=security" },
  { label: "Account", to: "/help?category=account" },
  { label: "Technical", to: "/help?category=technical" },
];

export default function RightPanel() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [kbArticles, setKbArticles] = useState([]);
  const [stats, setStats] = useState(null);
  const [myTickets, setMyTickets] = useState([]);

  useEffect(() => {
    api.get("/kb/").then(r => setKbArticles(r.data || [])).catch(() => {});
    if (user?.role === "admin") {
      api.get("/dashboard/stats").then(r => setStats(r.data)).catch(() => {});
    }
    if (user?.role === "user") {
      api.get("/tickets/").then(r => setMyTickets(r.data || [])).catch(() => {});
    }
  }, [user]);

  if (isMobile) return null;

  const open = myTickets.filter(t => t.status === "open").length;
  const pending = myTickets.filter(t => t.status === "pending").length;
  const resolved = myTickets.filter(t => ["resolved", "closed"].includes(t.status)).length;

  return (
    <aside style={s.panel}>
      {/* CTA buttons */}
      {user ? (
        <div style={s.card}>
          <Link to="/ask" style={s.greenBtn}>Add Question</Link>
          <Link to="/ask" style={s.outlineBtn}>Ask a Question</Link>
        </div>
      ) : (
        <div style={s.card}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>What is AHD?</div>
          <div style={{ fontSize: 13, color: "#666", marginBottom: 12, lineHeight: 1.5 }}>
            AI Help Desk — get instant answers from AI and expert support staff.
          </div>
          <Link to="/register" style={s.greenBtn}>Sign up — it's free</Link>
          <Link to="/login" style={s.outlineBtn}>Sign in</Link>
        </div>
      )}

      {/* Role-specific panel */}
      {user?.role === "admin" && stats && (
        <div style={s.card}>
          <div style={s.cardTitle}>Platform Overview</div>
          <div style={s.statRow}>
            <span style={s.statLabel}>Total Tickets</span>
            <span style={s.statVal}>{stats.total_tickets ?? "—"}</span>
          </div>
          <div style={s.statRow}>
            <span style={s.statLabel}>Resolved</span>
            <span style={{ ...s.statVal, color: "#16c784" }}>{stats.resolved_tickets ?? "—"}</span>
          </div>
          <div style={s.statRow}>
            <span style={s.statLabel}>Users</span>
            <span style={s.statVal}>{stats.total_users ?? "—"}</span>
          </div>
          <div style={s.statRow}>
            <span style={s.statLabel}>Visits Today</span>
            <span style={s.statVal}>{stats.visits_today ?? "—"}</span>
          </div>
        </div>
      )}

      {user?.role === "agent" && (
        <div style={s.card}>
          <div style={s.cardTitle}>Quick Links</div>
          <Link to="/agent" style={s.quickLink}>View Queue</Link>
          <Link to="/kb" style={s.quickLink}>Knowledge Base</Link>
          <Link to="/ask" style={s.quickLink}>Ask AI</Link>
        </div>
      )}

      {user?.role === "user" && (
        <div style={s.card}>
          <div style={s.cardTitle}>My Questions</div>
          <div style={s.statRow}>
            <span style={s.statLabel}>Open</span>
            <span style={{ ...s.statVal, color: "#3182ce" }}>{open}</span>
          </div>
          <div style={s.statRow}>
            <span style={s.statLabel}>Pending</span>
            <span style={{ ...s.statVal, color: "#d69e2e" }}>{pending}</span>
          </div>
          <div style={s.statRow}>
            <span style={s.statLabel}>Resolved</span>
            <span style={{ ...s.statVal, color: "#16c784" }}>{resolved}</span>
          </div>
          <Link to="/my-questions" style={{ ...s.quickLink, marginTop: 8, display: "block" }}>
            View all →
          </Link>
        </div>
      )}

      {/* Topics */}
      <div style={s.card}>
        <div style={s.cardTitle}>Topics</div>
        {TOPICS.map(t => (
          <Link key={t.label} to={t.to} style={s.topicLink}>{t.label}</Link>
        ))}
      </div>

      {/* Related questions */}
      {kbArticles.length > 0 && (
        <div style={s.card}>
          <div style={s.cardTitle}>Related Questions</div>
          {kbArticles.slice(0, 5).map(a => (
            <Link key={a.id} to={`/help?article=${a.id}`} style={s.relatedLink}>
              {a.title}
            </Link>
          ))}
        </div>
      )}
    </aside>
  );
}

const s = {
  panel: {
    width: 260, flexShrink: 0, paddingTop: 16,
    position: "sticky", top: 56, height: "calc(100vh - 56px)",
    overflowY: "auto", display: "flex", flexDirection: "column", gap: 12,
  },
  card: {
    background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8,
    padding: 16, display: "flex", flexDirection: "column", gap: 6,
  },
  cardTitle: { fontWeight: 700, fontSize: 14, marginBottom: 4, color: "#111" },
  greenBtn: {
    display: "block", textAlign: "center", padding: "9px 0",
    background: "#16c784", borderRadius: 20, fontSize: 14,
    color: "#fff", textDecoration: "none", fontWeight: 600,
  },
  outlineBtn: {
    display: "block", textAlign: "center", padding: "8px 0",
    border: "1px solid #ccc", borderRadius: 20, fontSize: 14,
    color: "#333", textDecoration: "none", fontWeight: 500,
  },
  statRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "4px 0", borderBottom: "1px solid #f0f0f0",
  },
  statLabel: { fontSize: 13, color: "#555" },
  statVal: { fontSize: 15, fontWeight: 700, color: "#111" },
  quickLink: {
    fontSize: 13, color: "#16c784", textDecoration: "none",
    fontWeight: 500, padding: "3px 0", display: "block",
  },
  topicLink: {
    fontSize: 13, color: "#555", textDecoration: "none",
    padding: "4px 0", display: "block",
  },
  relatedLink: {
    fontSize: 13, color: "#3182ce", textDecoration: "none",
    lineHeight: 1.4, display: "block", padding: "3px 0",
  },
};
