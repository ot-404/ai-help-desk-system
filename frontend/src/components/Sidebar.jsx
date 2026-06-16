import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useIsMobile } from "../hooks/useIsMobile";
import { C, COMMUNITIES } from "../theme";

const ic = (children) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

const ICONS = {
  home: ic(<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>),
  hot: ic(<path d="M8.5 14.5A4.5 4.5 0 0 0 13 19c2.5 0 4-2 4-4.5 0-2-1-3.5-2-5-.5 1.5-1.5 2-2.5 2 0-2-1-4-3-5 .5 3-2 4-2 7.5 0 .5 0 1 .5 1.5z" />),
  top: ic(<><polyline points="6 15 12 9 18 15" /><line x1="12" y1="9" x2="12" y2="20" /></>),
  community: ic(<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" /></>),
  kb: ic(<><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>),
  ai: ic(<><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></>),
  backend: ic(<><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></>),
};

function Item({ to, icon, label, end }) {
  return (
    <NavLink to={to} end={end} style={({ isActive }) => ({
      ...st.link,
      color: isActive ? C.primary : C.text,
      fontWeight: isActive ? 700 : 500,
      background: isActive ? C.tagBg : "transparent",
    })}>
      <span style={st.icon}>{icon}</span>{label}
    </NavLink>
  );
}

export default function Sidebar() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  if (isMobile) return null;

  const backendLink = user?.role === "admin" ? "/admin" : null;

  return (
    <aside style={st.sidebar}>
      <nav style={st.nav}>
        <Item to="/" icon={ICONS.home} label="Home" end />
        <Item to="/help?tab=hot" icon={ICONS.hot} label="Hot" />
        <Item to="/help?tab=top" icon={ICONS.top} label="Top" />
      </nav>

      <div style={st.heading}>COMMUNITIES</div>
      <nav style={st.nav}>
        {COMMUNITIES.map((c) => (
          <Item key={c} to={`/help?community=${encodeURIComponent(c)}`} icon={ICONS.community} label={c} />
        ))}
      </nav>

      <div style={st.heading}>RESOURCES</div>
      <nav style={st.nav}>
        <Item to="/help" icon={ICONS.kb} label="Knowledge Base" />
        <Item to="/ask" icon={ICONS.ai} label="Ask AI" />
        {backendLink && <Item to={backendLink} icon={ICONS.backend} label="Backend" />}
      </nav>
    </aside>
  );
}

const st = {
  sidebar: { width: 220, flexShrink: 0, paddingTop: 16, position: "sticky", top: 60, height: "calc(100vh - 60px)", overflowY: "auto" },
  nav: { display: "flex", flexDirection: "column", padding: "2px 8px", gap: 1 },
  link: { display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 20, fontSize: 14, textDecoration: "none" },
  icon: { display: "flex", flexShrink: 0 },
  heading: { fontSize: 11, fontWeight: 700, color: C.light, letterSpacing: 1, padding: "14px 18px 4px" },
};
