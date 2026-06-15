import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function RightPanel() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [kb, setKb] = useState([]);

  useEffect(() => {
    api.get("/dashboard/stats").then(r => setStats(r.data)).catch(() => {});
    api.get("/kb/").then(r => setKb((r.data || []).slice(0, 4))).catch(() => {});
  }, []);

  return (
    <aside style={s.aside}>
      {/* Stats card */}
      {stats && (
        <div style={s.card}>
          <div style={s.cardTitle}>Help Desk Stats</div>
          {[
            ["Total Tickets", stats.total_tickets],
            ["Resolved",      stats.resolved],
            ["AI Deflection", `${stats.deflection_rate}%`],
            ["AI Replies",    stats.ai_messages],
          ].map(([label, val]) => (
            <div key={label} style={s.statRow}>
              <span style={s.statLabel}>{label}</span>
              <span style={s.statVal}>{val}</span>
            </div>
          ))}
        </div>
      )}

      {/* KB highlights */}
      {kb.length > 0 && (
        <div style={s.card}>
          <div style={s.cardTitle}>From the Knowledge Base</div>
          {kb.map(a => (
            <Link key={a.id} to="/admin/kb" style={s.kbLink}>{a.title}</Link>
          ))}
        </div>
      )}

      {/* CTA */}
      {user?.role === "user" && (
        <div style={{ ...s.card, background: "#f0fdf8", border: "1px solid #c6f6d5" }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Got an issue?</div>
          <div style={{ fontSize: 13, color: "#555", marginBottom: 12 }}>Submit a ticket and our AI + team will get you sorted.</div>
          <Link to="/new-ticket" style={s.ctaBtn}>Ask a Question</Link>
        </div>
      )}
    </aside>
  );
}

const s = {
  aside: { width: 280, flexShrink: 0, display: "flex", flexDirection: "column", gap: 16, paddingTop: 16 },
  card: { background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8, padding: "16px" },
  cardTitle: { fontWeight: 700, fontSize: 15, marginBottom: 12, color: "#282829" },
  statRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: "1px solid #f2f2f0", fontSize: 14 },
  statLabel: { color: "#555" },
  statVal: { fontWeight: 700, color: "#282829" },
  kbLink: { display: "block", fontSize: 14, color: "#16c784", padding: "5px 0", textDecoration: "none", borderBottom: "1px solid #f2f2f0" },
  ctaBtn: { display: "block", background: "#16c784", color: "#fff", textAlign: "center", padding: "9px 0", borderRadius: 20, fontWeight: 700, fontSize: 14, textDecoration: "none" },
};
