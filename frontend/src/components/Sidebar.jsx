import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useIsMobile } from "../hooks/useIsMobile";

const roleColor = (role) =>
  role === "admin" ? "#e53e3e" : role === "agent" ? "#805ad5" : "#16c784";

const roleBg = (role) =>
  role === "admin" ? "#fff5f5" : role === "agent" ? "#f5f0ff" : "#f0fdf8";

function NavItem({ to, icon, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      style={({ isActive }) => ({
        ...s.navLink,
        color: isActive ? "#16c784" : "#333",
        fontWeight: isActive ? 700 : 400,
        background: isActive ? "#f0fdf8" : "transparent",
      })}
    >
      <span style={s.navIcon}>{icon}</span>
      {label}
    </NavLink>
  );
}

const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const AskIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const HelpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const ListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);
const QueueIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);
const DashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const KBIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);
const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const TOPICS = [
  { label: "Password & Login", to: "/help?category=password" },
  { label: "Billing", to: "/help?category=billing" },
  { label: "Security", to: "/help?category=security" },
  { label: "Account", to: "/help?category=account" },
  { label: "Technical", to: "/help?category=technical" },
];

export default function Sidebar() {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  if (isMobile) return null;

  return (
    <aside style={s.sidebar}>
      {user ? (
        <>
          {/* Profile card */}
          <div style={s.profileCard}>
            <div style={{ ...s.bigAvatar, background: roleColor(user.role) }}>
              {(user.name || user.email || "?")[0].toUpperCase()}
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, marginTop: 8 }}>{user.name || "—"}</div>
            <div style={{ ...s.roleBadge, background: roleBg(user.role), color: roleColor(user.role) }}>
              {user.role}
            </div>
            <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>{user.email}</div>
          </div>

          <div style={s.divider} />

          {/* Nav links */}
          <nav style={s.nav}>
            <NavItem to="/" icon={<HomeIcon />} label="Home" end />
            <NavItem to="/ask" icon={<AskIcon />} label="Ask AI" />
            <NavItem to="/help" icon={<HelpIcon />} label="Help Center" />
            {user.role === "user" && (
              <NavItem to="/my-questions" icon={<ListIcon />} label="My Questions" />
            )}
            {(user.role === "agent" || user.role === "admin") && (
              <NavItem to="/agent" icon={<QueueIcon />} label="Queue" />
            )}
            {user.role === "admin" && (
              <>
                <NavItem to="/admin" icon={<DashIcon />} label="Dashboard" />
                <NavItem to="/admin/users" icon={<UsersIcon />} label="Users" />
              </>
            )}
            {(user.role === "agent" || user.role === "admin") && (
              <NavItem to="/kb" icon={<KBIcon />} label="Knowledge Base" />
            )}
          </nav>
        </>
      ) : (
        <>
          {/* Guest CTA */}
          <div style={s.guestCard}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Sign up to get answers</div>
            <div style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>
              Join AHD to ask questions and get expert answers.
            </div>
            <Link to="/login" style={s.outlineBtn}>Sign in</Link>
            <Link to="/register" style={s.greenBtn}>Sign up</Link>
          </div>

          <div style={s.divider} />

          <nav style={s.nav}>
            <NavItem to="/" icon={<HomeIcon />} label="Home" end />
            <NavItem to="/ask" icon={<AskIcon />} label="Ask AI" />
            <NavItem to="/help" icon={<HelpIcon />} label="Help Center" />
          </nav>
        </>
      )}

      <div style={s.divider} />

      {/* Topics */}
      <div style={s.sectionHeader}>Topics</div>
      <nav style={s.nav}>
        {TOPICS.map(t => (
          <Link key={t.label} to={t.to} style={s.topicLink}>{t.label}</Link>
        ))}
      </nav>
    </aside>
  );
}

const s = {
  sidebar: {
    width: 200, flexShrink: 0, paddingTop: 16,
    position: "sticky", top: 56, height: "calc(100vh - 56px)",
    overflowY: "auto",
  },
  profileCard: {
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "16px 12px 12px", textAlign: "center",
  },
  bigAvatar: {
    width: 52, height: 52, borderRadius: "50%", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: 22,
  },
  roleBadge: {
    fontSize: 11, fontWeight: 600, borderRadius: 10,
    padding: "2px 10px", marginTop: 4, textTransform: "capitalize",
  },
  divider: { borderTop: "1px solid #e8e8e8", margin: "8px 12px" },
  nav: { display: "flex", flexDirection: "column", padding: "4px 8px" },
  navLink: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "8px 10px", borderRadius: 8, fontSize: 14,
    textDecoration: "none", transition: "background 0.15s",
  },
  navIcon: { display: "flex", alignItems: "center", flexShrink: 0 },
  sectionHeader: {
    fontSize: 11, fontWeight: 700, color: "#999",
    textTransform: "uppercase", letterSpacing: 1,
    padding: "4px 18px 4px",
  },
  topicLink: {
    display: "block", padding: "7px 10px", borderRadius: 8,
    fontSize: 13, color: "#555", textDecoration: "none",
  },
  guestCard: {
    background: "#f7f7f5", borderRadius: 8, padding: 16,
    margin: "12px 12px 0", display: "flex", flexDirection: "column", gap: 8,
  },
  outlineBtn: {
    display: "block", textAlign: "center", padding: "8px 0",
    border: "1px solid #ccc", borderRadius: 20, fontSize: 14,
    color: "#333", textDecoration: "none", fontWeight: 500,
  },
  greenBtn: {
    display: "block", textAlign: "center", padding: "8px 0",
    background: "#16c784", borderRadius: 20, fontSize: 14,
    color: "#fff", textDecoration: "none", fontWeight: 600,
  },
};
