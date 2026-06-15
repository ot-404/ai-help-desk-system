import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  function handleLogout() {
    logout();
    nav("/");
  }

  const links = {
    user:  [{ to: "/my-tickets", label: "My Tickets" }, { to: "/new-ticket", label: "New Ticket" }, { to: "/ask", label: "Ask AI" }],
    agent: [{ to: "/agent", label: "Queue" }, { to: "/admin/kb", label: "Knowledge Base" }, { to: "/ask", label: "Ask AI" }],
    admin: [{ to: "/agent", label: "Queue" }, { to: "/admin", label: "Dashboard" }, { to: "/admin/users", label: "Users" }, { to: "/admin/kb", label: "Knowledge Base" }, { to: "/ask", label: "Ask AI" }],
  };

  const roleLinks = links[user?.role] ?? [];

  function isActive(to) {
    return loc.pathname === to || (to !== "/" && loc.pathname.startsWith(to + "/"));
  }

  return (
    <nav style={s.nav}>
      <Link to="/" style={s.brandLink}>
        <span style={s.logo}>AI</span>
        <span style={s.name}>Help Desk</span>
      </Link>
      <div style={s.links}>
        {user ? (
          roleLinks.map(l => (
            <Link key={l.to} to={l.to} style={{ ...s.link, ...(isActive(l.to) ? s.linkActive : {}) }}>
              {l.label}
            </Link>
          ))
        ) : (
          <Link to="/help" style={{ ...s.link, ...(isActive("/help") ? s.linkActive : {}) }}>
            Help Center
          </Link>
        )}
      </div>
      <div style={s.right}>
        {user ? (
          <>
            <span style={s.roleBadge}>{user.role.toUpperCase()}</span>
            <span style={s.email}>{user.email}</span>
            <button onClick={handleLogout} style={s.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={s.logoutBtn}>Sign In</Link>
            <Link to="/register" style={s.getHelpBtn}>Get Help</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const s = {
  nav: { display: "flex", alignItems: "center", gap: 24, padding: "0 28px", height: 56, background: "#1f2a37", color: "#fff", position: "sticky", top: 0, zIndex: 100 },
  brandLink: { display: "flex", alignItems: "center", gap: 10, marginRight: 8, textDecoration: "none" },
  logo: { background: "#16c784", color: "#fff", fontWeight: 800, fontSize: 13, padding: "3px 8px", borderRadius: 6 },
  name: { fontWeight: 700, fontSize: 16, whiteSpace: "nowrap", color: "#fff" },
  links: { display: "flex", gap: 2, flex: 1 },
  link: { color: "#a0aec0", textDecoration: "none", padding: "6px 12px", borderRadius: 6, fontSize: 14, fontWeight: 500, transition: "color .15s" },
  linkActive: { color: "#fff", background: "rgba(255,255,255,.08)" },
  right: { display: "flex", alignItems: "center", gap: 12 },
  roleBadge: { background: "#2d3748", color: "#16c784", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10, letterSpacing: ".5px" },
  email: { color: "#a0aec0", fontSize: 13 },
  logoutBtn: { background: "transparent", color: "#a0aec0", border: "1px solid #4a5568", borderRadius: 6, padding: "4px 12px", cursor: "pointer", fontSize: 13, textDecoration: "none" },
  getHelpBtn: { background: "#16c784", color: "#fff", border: "none", borderRadius: 6, padding: "5px 14px", cursor: "pointer", fontSize: 13, fontWeight: 700, textDecoration: "none" },
};
