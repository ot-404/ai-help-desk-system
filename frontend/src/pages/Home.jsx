import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

export default function Home() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [articles, setArticles] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    api.get("/kb/").then(r => setArticles(r.data.slice(0, 6))).catch(() => {});
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    nav(`/help${query ? `?q=${encodeURIComponent(query)}` : ""}`);
  }

  const ticketHref = user?.role === "user" ? "/new-ticket" : user ? "/" : "/login?next=/new-ticket";

  return (
    <div style={s.page}>
      {/* Hero */}
      <div style={s.hero}>
        <div style={s.heroInner}>
          <div style={s.heroTag}>AI-Powered Support</div>
          <h1 style={s.heroTitle}>How can we help you today?</h1>
          <p style={s.heroSub}>Search our knowledge base or submit a ticket and we'll get back to you quickly.</p>
          <form onSubmit={handleSearch} style={s.searchRow}>
            <input
              style={s.searchInput}
              placeholder="Search help articles…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button type="submit" style={s.searchBtn}>Search</button>
          </form>
          <div style={s.heroBtns}>
            <Link to="/help" style={s.btnOutline}>Browse Help Center</Link>
            {!user && <Link to="/register" style={s.btnPrimary}>Get Started Free</Link>}
          </div>
        </div>
      </div>

      {/* Featured Articles */}
      {articles.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionInner}>
            <div style={s.sectionHeader}>
              <h2 style={s.sectionTitle}>Popular Articles</h2>
              <Link to="/help" style={s.seeAll}>View all →</Link>
            </div>
            <div style={s.grid}>
              {articles.map(a => (
                <Link key={a.id} to={`/help?article=${a.id}`} style={s.card}>
                  {a.category && <div style={s.cardTag}>{a.category}</div>}
                  <div style={s.cardTitle}>{a.title}</div>
                  <div style={s.cardExcerpt}>{(a.content || "").slice(0, 120)}{a.content?.length > 120 ? "…" : ""}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Ask AI band */}
      <div style={s.askBand}>
        <div style={s.askBandInner}>
          <div style={s.askBandLeft}>
            <div style={s.askBandIcon}>🤖</div>
            <div>
              <div style={s.askBandTitle}>Ask our AI a question</div>
              <div style={s.askBandSub}>Get an instant answer — and it's automatically published as a help article for everyone.</div>
            </div>
          </div>
          <Link to="/ask" style={s.btnPrimary}>Ask AI →</Link>
        </div>
      </div>

      {/* CTA Band */}
      <div style={s.cta}>
        <div style={s.ctaInner}>
          <div style={s.ctaIcon}>💬</div>
          <h3 style={s.ctaTitle}>Still need help?</h3>
          <p style={s.ctaSub}>Our support team is ready to assist you. Submit a ticket and get a response fast.</p>
          {user?.role === "user" ? (
            <Link to="/new-ticket" style={s.btnPrimary}>Submit a Ticket</Link>
          ) : user ? (
            <span style={{ ...s.btnPrimary, opacity: 0.6, cursor: "default" }}>Agents & Admins manage tickets via Queue</span>
          ) : (
            <div style={s.ctaBtnRow}>
              <Link to="/login?next=/new-ticket" style={s.btnPrimary}>Sign In to Get Help</Link>
              <Link to="/register" style={s.btnOutlineWhite}>Create an Account</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100%", background: "#eef1f4" },

  hero: { background: "linear-gradient(135deg, #1f2a37 0%, #2d3748 100%)", padding: "72px 20px 64px", textAlign: "center" },
  heroInner: { maxWidth: 640, margin: "0 auto" },
  heroTag: { display: "inline-block", background: "#16c78422", color: "#16c784", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20, letterSpacing: ".5px", textTransform: "uppercase", marginBottom: 18 },
  heroTitle: { fontSize: 38, fontWeight: 800, color: "#fff", margin: "0 0 14px", lineHeight: 1.2 },
  heroSub: { fontSize: 16, color: "#a0aec0", margin: "0 0 32px", lineHeight: 1.6 },
  searchRow: { display: "flex", gap: 10, maxWidth: 500, margin: "0 auto 24px" },
  searchInput: { flex: 1, border: "none", borderRadius: 10, padding: "13px 16px", fontSize: 15, outline: "none", background: "#fff" },
  searchBtn: { background: "#16c784", color: "#fff", border: "none", borderRadius: 10, padding: "13px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  heroBtns: { display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" },
  btnOutline: { border: "1.5px solid #4a5568", color: "#e2e8f0", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, textDecoration: "none", background: "transparent" },
  btnPrimary: { background: "#16c784", color: "#fff", borderRadius: 8, padding: "10px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none", display: "inline-block" },

  section: { padding: "48px 20px" },
  sectionInner: { maxWidth: 900, margin: "0 auto" },
  sectionHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: 700, margin: 0, color: "#1f2a37" },
  seeAll: { color: "#16c784", fontWeight: 600, fontSize: 14, textDecoration: "none" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 },
  card: { background: "#fff", borderRadius: 12, padding: "20px", boxShadow: "0 2px 10px rgba(0,0,0,.06)", textDecoration: "none", display: "block", transition: "box-shadow .2s" },
  cardTag: { fontSize: 11, fontWeight: 700, color: "#16c784", textTransform: "uppercase", letterSpacing: ".4px", marginBottom: 8 },
  cardTitle: { fontSize: 15, fontWeight: 600, color: "#1f2a37", marginBottom: 8, lineHeight: 1.4 },
  cardExcerpt: { fontSize: 13, color: "#7a8794", lineHeight: 1.55 },

  cta: { background: "#16c784", padding: "56px 20px" },
  ctaInner: { maxWidth: 560, margin: "0 auto", textAlign: "center" },
  ctaIcon: { fontSize: 36, marginBottom: 12 },
  ctaTitle: { fontSize: 24, fontWeight: 800, color: "#fff", margin: "0 0 10px" },
  ctaSub: { fontSize: 15, color: "rgba(255,255,255,.85)", margin: "0 0 28px", lineHeight: 1.6 },
  ctaBtnRow: { display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" },
  btnOutlineWhite: { border: "1.5px solid rgba(255,255,255,.6)", color: "#fff", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, textDecoration: "none", background: "transparent" },

  askBand: { background: "#fff", borderTop: "1px solid #e8edf2", borderBottom: "1px solid #e8edf2", padding: "24px 20px" },
  askBandInner: { maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" },
  askBandLeft: { display: "flex", alignItems: "center", gap: 16 },
  askBandIcon: { fontSize: 32, flexShrink: 0 },
  askBandTitle: { fontSize: 15, fontWeight: 700, color: "#1f2a37", marginBottom: 3 },
  askBandSub: { fontSize: 13, color: "#7a8794" },
};
