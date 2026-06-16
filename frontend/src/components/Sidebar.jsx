import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useIsMobile } from "../hooks/useIsMobile";
import { C } from "../theme";

const ic = (children) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

const ICONS = {
  home: ic(<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>),
  newest: ic(<><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 16 14" /></>),
  active: ic(<path d="M22 12h-4l-3 9L9 3l-3 9H2" />),
  unanswered: ic(<><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></>),
  tags: ic(<><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></>),
  kb: ic(<><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>),
  ai: ic(<><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></>),
  dashboard: ic(<><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></>),
  users: ic(<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /></>),
};

function Item({ to, icon, label, end }) {
  return (
    <NavLink to={to} end={end} style={({ isActive }) => ({
      ...st.link,
      color: isActive ? C.text : C.muted,
      fontWeight: isActive ? 700 : 400,
      background: isActive ? C.surface2 : "transparent",
      borderRight: isActive ? `3px solid ${C.rep}` : "3px solid transparent",
    })}>
      <span style={st.icon}>{icon}</span>{label}
    </NavLink>
  );
}

export default function Sidebar() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  if (isMobile) return null;

  const isAdmin = user?.role === "admin";

  return (
    <aside style={st.sidebar}>
      <div style={st.heading}>Questions</div>
      <nav style={st.nav}>
        <Item to="/" icon={ICONS.home} label="Home" end />
        <Item to="/?tab=newest" icon={ICONS.newest} label="Newest" />
        <Item to="/?tab=active" icon={ICONS.active} label="Active" />
        <Item to="/?tab=unanswered" icon={ICONS.unanswered} label="Unanswered" />
        <Item to="/help" icon={ICONS.tags} label="Tags" />
      </nav>

      <div style={st.heading}>Knowledge Base</div>
      <nav style={st.nav}>
        <Item to="/help" icon={ICONS.kb} label="Browse Articles" />
        <Item to="/ask" icon={ICONS.ai} label="Ask AI" />
      </nav>

      {isAdmin && (
        <>
          <div style={st.heading}>Backend</div>
          <nav style={st.nav}>
            <Item to="/admin" icon={ICONS.dashboard} label="Dashboard" end />
            <Item to="/admin/users" icon={ICONS.users} label="Users" />
            <Item to="/admin/kb" icon={ICONS.kb} label="Knowledge Base" />
          </nav>
        </>
      )}
    </aside>
  );
}

const st = {
  sidebar: { width: 200, flexShrink: 0, paddingTop: 16, position: "sticky", top: 60, height: "calc(100vh - 60px)", overflowY: "auto", borderRight: `1px solid ${C.border}` },
  nav: { display: "flex", flexDirection: "column", paddingBottom: 6 },
  link: { display: "flex", alignItems: "center", gap: 10, padding: "8px 12px 8px 16px", fontSize: 13, textDecoration: "none" },
  icon: { display: "flex", flexShrink: 0 },
  heading: { fontSize: 12, fontWeight: 700, color: C.muted, padding: "14px 12px 4px 16px" },
};
