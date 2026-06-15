import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

const STATUS_COLOR = { open: "#3182ce", pending: "#d69e2e", resolved: "#16c784", closed: "#718096" };
const PRI_COLOR    = { low: "#48bb78", medium: "#ecc94b", high: "#ed8936", urgent: "#e53e3e" };

function TicketCard({ t }) {
  return (
    <Link to={`/ticket/${t.id}`} style={s.card}>
      {/* Badges */}
      <div style={s.cardMeta}>
        <span style={{ ...s.badge, background: STATUS_COLOR[t.status] + "18", color: STATUS_COLOR[t.status] }}>
          {t.status}
        </span>
        <span style={{ ...s.badge, background: PRI_COLOR[t.priority] + "18", color: PRI_COLOR[t.priority] }}>
          {t.priority}
        </span>
      </div>

      {/* Subject */}
      <div style={s.cardTitle}>{t.subject}</div>

      {/* Description preview */}
      {t.description && (
        <div style={s.cardBody}>
          {(t.description).slice(0, 180)}{t.description.length > 180 ? "…" : ""}
        </div>
      )}

      {/* Footer */}
      <div style={s.cardFooter}>
        <span style={s.footerMeta}>Ticket #{t.id} · {new Date(t.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
        <span style={s.footerLink}>View question ↗</span>
      </div>
    </Link>
  );
}

function KbCard({ a }) {
  const [open, setOpen] = useState(false);
  const PREVIEW = 180;
  const needsMore = (a.content || "").length > PREVIEW;

  return (
    <div style={s.card}>
      <div style={s.cardMeta}>
        {a.category && <span style={s.catBadge}>{a.category}</span>}
      </div>
      <div style={s.cardTitle}>{a.title}</div>
      <div style={s.cardBody}>
        {open ? a.content : (a.content || "").slice(0, PREVIEW) + (needsMore ? "…" : "")}
      </div>
      {needsMore && (
        <button style={s.moreBtn} onClick={() => setOpen(o => !o)}>
          {open ? "Show less ▲" : "Read more ▼"}
        </button>
      )}
      <div style={s.cardFooter}>
        <span style={s.footerMeta}>AI Help Desk</span>
        <Link to={`/help?article=${a.id}`} style={s.footerLink}>Open ↗</Link>
      </div>
    </div>
  );
}

export default function UserHome() {
  const { user } = useAuth();
  const [tickets,  setTickets]  = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([api.get("/tickets/"), api.get("/kb/")])
      .then(([t, a]) => { setTickets(t.data || []); setArticles((a.data || []).slice(0, 4)); })
      .finally(() => setLoading(false));
  }, []);

  const firstName = user?.name?.split(" ")[0] || "there";
  const open     = tickets.filter(t => t.status === "open").length;
  const pending  = tickets.filter(t => t.status === "pending").length;

  return (
    <div style={s.page}>

      {/* ── Welcome bar ─────────────────────────────── */}
      <div style={s.welcomeCard}>
        <div style={s.welcomeLeft}>
          <div style={s.avatar}>{user?.name?.[0]?.toUpperCase() ?? "U"}</div>
          <div>
            <div style={s.welcomeTitle}>Welcome back, {firstName}</div>
            <div style={s.welcomeSub}>
              {open > 0
                ? `You have ${open} open question${open !== 1 ? "s" : ""}${pending > 0 ? ` and ${pending} pending` : ""}.`
                : "You're all caught up — no open questions."}
            </div>
          </div>
        </div>
        <Link to="/new-question" style={s.newTicketBtn}>+ New Question</Link>
      </div>

      {/* ── Ask AI box ──────────────────────────────── */}
      <div style={s.askCard}>
        <div style={s.askText}>
          <strong>Got a question?</strong> Ask our AI — your answer is saved to help others too.
        </div>
        <Link to="/ask" style={s.askBtn}>Ask AI →</Link>
      </div>

      {/* ── My Tickets feed ─────────────────────────── */}
      {!loading && (
        <>
          <div style={s.sectionRow}>
            <span style={s.sectionTitle}>My Recent Questions</span>
            <Link to="/my-questions" style={s.seeAll}>See all →</Link>
          </div>

          {tickets.length === 0 ? (
            <div style={s.emptyCard}>
              <span style={s.emptyIcon}>
              <span style={s.emptyText}>No questions yet.</span>
              <Link to="/new-question" style={s.emptyLink}>Ask your first question →</Link>
            </div>
          ) : (
            <div style={s.feed}>
              {tickets.slice(0, 4).map(t => <TicketCard key={t.id} t={t} />)}
            </div>
          )}
        </>
      )}

      {/* ── Help Articles ───────────────────────────── */}
      {!loading && articles.length > 0 && (
        <>
          <div style={{ ...s.sectionRow, marginTop: 20 }}>
            <span style={s.sectionTitle}>From the Help Center</span>
            <Link to="/help" style={s.seeAll}>Browse all →</Link>
          </div>
          <div style={s.feed}>
            {articles.map(a => <KbCard key={a.id} a={a} />)}
          </div>
        </>
      )}

    </div>
  );
}

const s = {
  page: { paddingTop: 4, display: "flex", flexDirection: "column", gap: 8 },

  /* Welcome bar */
  welcomeCard: {
    background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8,
    padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
  },
  welcomeLeft:  { display: "flex", alignItems: "center", gap: 12 },
  avatar: {
    width: 42, height: 42, borderRadius: "50%",
    background: "#16c784", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 18, fontWeight: 700, flexShrink: 0,
  },
  welcomeTitle: { fontSize: 16, fontWeight: 700, color: "#282829" },
  welcomeSub:   { fontSize: 13, color: "#939598", marginTop: 2 },
  newTicketBtn: {
    background: "#16c784", color: "#fff",
    padding: "8px 18px", borderRadius: 20,
    fontSize: 13, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0,
  },

  /* Ask AI strip */
  askCard: {
    background: "#f0fdf8", border: "1.5px solid #c6f6d5", borderRadius: 8,
    padding: "14px 18px", display: "flex", alignItems: "center", gap: 12,
  },
  askIcon: { fontSize: 22, flexShrink: 0 },
  askText: { flex: 1, fontSize: 13, color: "#276749", lineHeight: 1.4 },
  askBtn: {
    background: "#16c784", color: "#fff",
    padding: "7px 16px", borderRadius: 20,
    fontSize: 13, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0,
  },

  /* Section row */
  sectionRow:  { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 0" },
  sectionTitle:{ fontSize: 13, fontWeight: 700, color: "#939598", textTransform: "uppercase", letterSpacing: ".6px" },
  seeAll:      { fontSize: 13, color: "#16c784", fontWeight: 600, textDecoration: "none" },

  /* Feed */
  feed: { display: "flex", flexDirection: "column", gap: 6 },

  /* Card (shared between ticket + KB) */
  card: {
    background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8,
    padding: "16px 18px", textDecoration: "none", color: "inherit",
    display: "flex", flexDirection: "column", gap: 0,
  },
  cardMeta:   { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 },
  badge: { fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20 },
  catBadge: {
    fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
    background: "#f0fff4", color: "#276749", textTransform: "uppercase", letterSpacing: ".3px",
  },
  cardTitle:  { fontSize: 15, fontWeight: 700, color: "#282829", lineHeight: 1.35, marginBottom: 6 },
  cardBody:   { fontSize: 13, color: "#555", lineHeight: 1.6, marginBottom: 6 },
  moreBtn: {
    background: "none", border: "none", color: "#16c784",
    fontSize: 12, fontWeight: 600, cursor: "pointer", padding: "2px 0", textAlign: "left",
  },
  cardFooter: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    marginTop: 10, paddingTop: 8, borderTop: "1px solid #f2f2f0",
  },
  footerMeta: { fontSize: 12, color: "#939598" },
  footerLink: { fontSize: 12, color: "#16c784", fontWeight: 600, textDecoration: "none" },

  /* Empty */
  emptyCard: {
    background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8,
    padding: "32px 20px", textAlign: "center",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
  },
  emptyIcon: { fontSize: 32 },
  emptyText: { fontSize: 14, color: "#939598" },
  emptyLink: { fontSize: 13, color: "#16c784", fontWeight: 600, textDecoration: "none" },
};
