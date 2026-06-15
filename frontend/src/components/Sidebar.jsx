import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV = {
  user:  [
    { to: "/my-tickets",  icon: "🎫", label: "My Tickets" },
    { to: "/new-ticket",  icon: "✏️", label: "Ask a Question" },
  ],
  agent: [
    { to: "/agent",       icon: "📋", label: "Queue" },
    { to: "/admin/kb",    icon: "📚", label: "Knowledge Base" },
  ],
  admin: [
    { to: "/agent",       icon: "📋", label: "Queue" },
    { to: "/admin",       icon: "📊", label: "Dashboard" },
    { to: "/admin/users", icon: "👥", label: "Users" },
    { to: "/admin/kb",    icon: "📚", label: "Knowledge Base" },
  ],
};

export default function Sidebar() {
  const { user } = useAuth();
  const links = NAV[user?.role] ?? [];

  return (
    <aside style={s.aside}>
      <nav style={s.nav}>
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            style={({ isActive }) => ({ ...s.link, ...(isActive ? s.active : {}) })}
          >
            <span style={s.icon}>{l.icon}</span>
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={s.section}>
        <div style={s.sectionTitle}>Topics</div>
        {["Password & Login", "Billing", "Security", "Account"].map(t => (
          <div key={t} style={s.topic}>{t}</div>
        ))}
      </div>
    </aside>
  );
}

const s = {
  aside: { width: 180, flexShrink: 0, paddingTop: 16 },
  nav: { display: "flex", flexDirection: "column", gap: 2 },
  link: { display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 6, fontSize: 15, color: "#282829", textDecoration: "none", fontWeight: 500, transition: "background .1s" },
  active: { color: "#16c784", fontWeight: 700, background: "#f0fdf8" },
  icon: { fontSize: 16, width: 22, textAlign: "center" },
  section: { marginTop: 24, paddingTop: 16, borderTop: "1px solid #e8e8e8" },
  sectionTitle: { fontSize: 12, fontWeight: 700, color: "#939598", textTransform: "uppercase", letterSpacing: ".8px", padding: "0 12px", marginBottom: 8 },
  topic: { padding: "7px 12px", fontSize: 14, color: "#555", borderRadius: 6, cursor: "pointer" },
};
