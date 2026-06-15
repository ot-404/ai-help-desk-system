import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

const STATUS_COLOR = { open: "#3182ce", pending: "#d69e2e", resolved: "#16c784", closed: "#718096" };
const PRI_COLOR   = { low: "#48bb78", medium: "#ecc94b", high: "#ed8936", urgent: "#e53e3e" };

export default function UserHome() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/tickets/"), api.get("/kb/")])
      .then(([t, a]) => { setTickets(t.data); setArticles(a.data.slice(0, 3)); })
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    open:     tickets.filter(t => t.status === "open").length,
    pending:  tickets.filter(t => t.status === "pending").length,
    resolved: tickets.filter(t => t.status === "resolved" || t.status === "closed").length,
  };

  const recent = tickets.slice(0, 4);
  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div style={s.page}>
      {/* Hero — same layout as public Home */}
      <div style={s.hero}>
        <div style={s.heroInner}>
          <div style={s.heroTag}>Your support hub</div>
          <h1 style={s.heroTitle}>Hi, {firstName} 👋</h1>
          <p style={s.heroSub}>Here's a quick look at your support activity.</p>

          {!loading && (
            <div style={s.statRow}>
              <div style={s.stat}>
                <div style={{ ...s.statNum, color: "#63b3ed" }}>{stats.open}</div>
                <div style={s.statLabel}>Open</div>
              </div>
              <div style={s.statDivider} />
              <div style={s.stat}>
                <div style={{ ...s.statNum, color: "#f6e05e" }}>{stats.pending}</div>
                <div style={s.statLabel}>Pending</div>
              </div>
              <div style={s.statDivider} />
              <div style={s.stat}>
                <div style={{ ...s.statNum, color: "#68d391" }}>{stats.resolved}</div>
                <div style={s.statLabel}>Resolved</div>
              </div>
              <div style={s.statDivider} />
              <div style={s.stat}>
                <div style={{ ...s.statNum, color: "#fff" }}>{tickets.length}</div>
                <div style={s.statLabel}>Total</div>
              </div>
            </div>
          )}

          <div style={s.heroBtns}>
            <Link to="/new-ticket" style={s.btnPrimary}>+ New Ticket</Link>
            <Link to="/my-tickets" style={s.btnOutline}>View All Tickets</Link>
          </div>
        </div>
      </div>

      <div style={s.body}>
        <div style={s.inner}>
          {/* Recent Tickets */}
          {!loading && recent.length > 0 && (
            <>
              <div style={s.sectionHeader}>
                <h2 style={s.sectionTitle}>Recent Tickets</h2>
                <Link to="/my-tickets" style={s.seeAll}>View all →</Link>
              </div>
              <div style={s.grid}>
                {recent.map(t => (
                  <Link key={t.id} to={`/ticket/${t.id}`} style={s.card}>
                    <div style={s.cardBadges}>
                      <span style={{ ...s.badge, background: STATUS_COLOR[t.status] + "22", color: STATUS_COLOR[t.status] }}>{t.status}</span>
                      <span style={{ ...s.badge, background: PRI_COLOR[t.priority] + "22", color: PRI_COLOR[t.priority] }}>{t.priority}</span>
                    </div>
                    <div style={s.cardTitle}>{t.subject}</div>
                    <div style={s.cardMeta}>#{t.id} · {new Date(t.created_at).toLocaleDateString()}</div>
                  </Link>
                ))}
                <Link to="/new-ticket" style={{ ...s.card, ...s.newCard }}>
                  <div style={s.newCardIcon}>+</div>
                  <div style={s.newCardLabel}>New Ticket</div>
                </Link>
              </div>
            </>
          )}

          {/* Empty state */}
          {!loading && tickets.length === 0 && (
            <div style={s.empty}>
              <div style={s.emptyIcon}>🎫</div>
              <h3 style={s.emptyTitle}>No tickets yet</h3>
              <p style={s.emptySub}>Something not working? Let us know and we'll help right away.</p>
              <Link to="/new-ticket" style={s.btnPrimary}>Submit your first ticket</Link>
            </div>
          )}

          {/* Help Articles */}
          {!loading && articles.length > 0 && (
            <>
              <div style={{ ...s.sectionHeader, marginTop: 40 }}>
                <h2 style={s.sectionTitle}>Help Articles</h2>
                <Link to="/help" style={s.seeAll}>Browse all →</Link>
              </div>
              <div style={s.grid}>
                {articles.map(a => (
                  <Link key={a.id} to={`/help?article=${a.id}`} style={s.card}>
                    {a.category && <div style={s.cardTag}>{a.category}</div>}
                    <div style={s.cardTitle}>{a.title}</div>
                    <div style={s.cardMeta}>{(a.content || "").slice(0, 100)}{(a.content?.length ?? 0) > 100 ? "…" : ""}</div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* CTA band — same as public Home */}
      <div style={s.cta}>
        <div style={s.ctaInner}>
          <div style={s.ctaIcon}>💬</div>
          <h3 style={s.ctaTitle}>Need more help?</h3>
          <p style={s.ctaSub}>Our team responds quickly. Don't hesitate to open a new ticket.</p>
          <Link to="/new-ticket" style={s.btnWhite}>Submit a Ticket</Link>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100%", background: "#eef1f4" },

  hero: { background: "linear-gradient(135deg, #1f2a37 0%, #2d3748 100%)", padding: "64px 20px 56px", textAlign: "center" },
  heroInner: { maxWidth: 640, margin: "0 auto" },
  heroTag: { display: "inline-block", background: "#16c78422", color: "#16c784", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20, letterSpacing: ".5px", textTransform: "uppercase", marginBottom: 16 },
  heroTitle: { fontSize: 36, fontWeight: 800, color: "#fff", margin: "0 0 10px", lineHeight: 1.2 },
  heroSub: { fontSize: 15, color: "#a0aec0", margin: "0 0 28px" },
  statRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: 0, background: "rgba(255,255,255,.06)", borderRadius: 14, padding: "18px 32px", marginBottom: 28, width: "fit-content", margin: "0 auto 28px" },
  stat: { textAlign: "center", padding: "0 24px" },
  statNum: { fontSize: 28, fontWeight: 800, lineHeight: 1 },
  statLabel: { fontSize: 12, color: "#a0aec0", marginTop: 4, fontWeight: 500 },
  statDivider: { width: 1, height: 36, background: "rgba(255,255,255,.1)" },
  heroBtns: { display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 28 },
  btnPrimary: { background: "#16c784", color: "#fff", borderRadius: 8, padding: "10px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none", display: "inline-block" },
  btnOutline: { border: "1.5px solid #4a5568", color: "#e2e8f0", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, textDecoration: "none", background: "transparent" },

  body: { padding: "40px 20px 56px" },
  inner: { maxWidth: 900, margin: "0 auto" },
  sectionHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
  sectionTitle: { fontSize: 18, fontWeight: 700, margin: 0, color: "#1f2a37" },
  seeAll: { color: "#16c784", fontWeight: 600, fontSize: 13, textDecoration: "none" },

  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginBottom: 8 },
  card: { background: "#fff", borderRadius: 12, padding: "18px", boxShadow: "0 2px 10px rgba(0,0,0,.06)", textDecoration: "none", display: "block" },
  cardBadges: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 },
  badge: { fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20 },
  cardTag: { fontSize: 11, fontWeight: 700, color: "#16c784", textTransform: "uppercase", letterSpacing: ".4px", marginBottom: 8 },
  cardTitle: { fontSize: 14, fontWeight: 600, color: "#1f2a37", marginBottom: 6, lineHeight: 1.4 },
  cardMeta: { fontSize: 12, color: "#7a8794", lineHeight: 1.5 },
  newCard: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "2px dashed #e2e8f0", boxShadow: "none", background: "#fafbfc", minHeight: 100 },
  newCardIcon: { fontSize: 24, color: "#16c784", fontWeight: 700, lineHeight: 1 },
  newCardLabel: { fontSize: 13, fontWeight: 600, color: "#a0aec0", marginTop: 6 },

  empty: { textAlign: "center", padding: "60px 0" },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: 700, color: "#1f2a37", marginBottom: 8, margin: "0 0 8px" },
  emptySub: { color: "#7a8794", fontSize: 14, marginBottom: 24 },

  cta: { background: "#16c784", padding: "48px 20px" },
  ctaInner: { maxWidth: 480, margin: "0 auto", textAlign: "center" },
  ctaIcon: { fontSize: 32, marginBottom: 10 },
  ctaTitle: { fontSize: 22, fontWeight: 800, color: "#fff", margin: "0 0 8px" },
  ctaSub: { fontSize: 14, color: "rgba(255,255,255,.85)", margin: "0 0 24px" },
  btnWhite: { background: "#fff", color: "#16a34a", borderRadius: 8, padding: "11px 24px", fontSize: 14, fontWeight: 700, textDecoration: "none", display: "inline-block" },
};
