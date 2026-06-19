import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { C, ANDROID_APK_URL } from "../theme";

const ROLE_BG = { admin: C.primary, agent: C.blue, user: C.success };
const ROLE_LABEL = { admin: "Admin", agent: "Support Agent", user: "Member" };

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const initial = (user.name || user.email || "?")[0].toUpperCase();
  const handle = "u/" + (user.name || user.email || "user").replace(/\s+/g, "");
  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
    : "—";

  const isStaff = user.role === "admin" || user.role === "agent";

  const quickLinks = [
    { to: "/new-question", label: "Create a post", icon: "plus" },
    { to: "/ask", label: "Ask AI", icon: "sparkle" },
    { to: "/faq", label: "Browse FAQs", icon: "faq" },
    ...(user.role === "user" ? [{ to: "/my-questions", label: "My questions", icon: "list" }] : []),
    ...(isStaff ? [{ to: user.role === "admin" ? "/admin" : "/agent", label: user.role === "admin" ? "Admin dashboard" : "Agent queue", icon: "dash" }] : []),
  ];

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div>
      <div style={s.card}>
        <div style={{ ...s.banner, background: C.gradient }} />
        <div style={s.avatarRow}>
          <div style={{ ...s.avatar, background: C.gradient }}>{initial}</div>
          <span style={{ ...s.roleBadge, background: (ROLE_BG[user.role] || C.primary) + "1a", color: ROLE_BG[user.role] || C.primary }}>
            {ROLE_LABEL[user.role] || user.role}
          </span>
        </div>

        <div style={s.identity}>
          <h1 style={s.name}>{user.name || "User"}</h1>
          <div style={s.handle}>{handle}</div>
        </div>

        <div style={s.meta}>
          <div style={s.metaItem}><span style={s.metaLabel}>Email</span><span style={s.metaVal}>{user.email}</span></div>
          <div style={s.metaItem}><span style={s.metaLabel}>Role</span><span style={s.metaVal}>{ROLE_LABEL[user.role] || user.role}</span></div>
          <div style={s.metaItem}><span style={s.metaLabel}>Member since</span><span style={s.metaVal}>{memberSince}</span></div>
        </div>
      </div>

      <div style={s.section}>Quick actions</div>
      <div style={s.grid}>
        {quickLinks.map((q) => (
          <Link key={q.to} to={q.to} style={s.tile}>
            <Icon name={q.icon} />
            <span>{q.label}</span>
          </Link>
        ))}
        <a href={ANDROID_APK_URL} target="_blank" rel="noreferrer" style={s.tile}>
          <Icon name="android" />
          <span>Download Android app</span>
        </a>
      </div>

      <button style={s.logout} onClick={handleLogout}>Log out</button>
    </div>
  );
}

function Icon({ name }) {
  const p = (d) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      {[].concat(d).map((x, i) => <path key={i} d={x} />)}
    </svg>
  );
  switch (name) {
    case "plus": return p(["M12 5v14", "M5 12h14"]);
    case "sparkle": return p(["M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"]);
    case "faq": return p(["M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", "M12 17h.01", "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"]);
    case "list": return p(["M8 6h13", "M8 12h13", "M8 18h13", "M3 6h.01", "M3 12h.01", "M3 18h.01"]);
    case "dash": return p(["M3 3h7v9H3z", "M14 3h7v5h-7z", "M14 12h7v9h-7z", "M3 16h7v5H3z"]);
    case "android": return p(["M5 16V9a7 7 0 0 1 14 0v7", "M5 16h14a0 0 0 0 1 0 0v2a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z", "M9 7L7.5 4.5", "M15 7l1.5-2.5", "M9 12h.01", "M15 12h.01"]);
    default: return null;
  }
}

const s = {
  card: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden", marginBottom: 16 },
  banner: { height: 80 },
  avatarRow: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 20px", marginTop: -38 },
  avatar: { width: 76, height: 76, borderRadius: "50%", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 30, border: "4px solid #fff", flexShrink: 0 },
  identity: { padding: "12px 20px 0" },
  name: { fontSize: 21, fontWeight: 700, color: C.text, margin: 0, letterSpacing: -0.3 },
  handle: { fontSize: 13.5, color: C.muted, marginTop: 2 },
  roleBadge: { fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20, marginBottom: 6 },
  meta: { display: "flex", flexWrap: "wrap", gap: "16px 32px", padding: "18px 20px 20px" },
  metaItem: { display: "flex", flexDirection: "column", gap: 2 },
  metaLabel: { fontSize: 11, fontWeight: 700, color: C.light, textTransform: "uppercase", letterSpacing: 0.5 },
  metaVal: { fontSize: 14, color: C.text, fontWeight: 500 },
  section: { fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.6, margin: "0 0 10px 2px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10, marginBottom: 20 },
  tile: { display: "flex", alignItems: "center", gap: 10, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px", color: C.text, textDecoration: "none", fontSize: 14, fontWeight: 500 },
  logout: { width: "100%", background: C.surface, border: `1px solid ${C.border}`, color: C.danger, borderRadius: 12, padding: "13px 0", fontSize: 14, fontWeight: 600, cursor: "pointer" },
};
