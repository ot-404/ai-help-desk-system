import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useIsMobile } from "../hooks/useIsMobile";
import { C, TOPICS } from "../theme";

const DOT_COLORS = ["#ff4500", "#0079d3", "#46d160", "#8250df", "#ffb000", "#ff585b", "#00a3a3"];

function Icon({ name }) {
  const p = (d) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {[].concat(d).map((x, i) => <path key={i} d={x} />)}
    </svg>
  );
  switch (name) {
    case "home": return p(["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "M9 22V12h6v10"]);
    case "flame": return p(["M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"]);
    case "book": return p(["M4 19.5A2.5 2.5 0 0 1 6.5 17H20", "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"]);
    case "sparkle": return p(["M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z", "M19 15l.7 1.8L21.5 18l-1.8.7L19 21l-.7-1.8L16.5 18l1.8-.7z"]);
    case "dash": return p(["M3 3h7v9H3z", "M14 3h7v5h-7z", "M14 12h7v9h-7z", "M3 16h7v5H3z"]);
    case "users": return p(["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"]);
    case "kb": return p(["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6", "M9 13h6", "M9 17h6"]);
    default: return null;
  }
}

function Item({ to, label, icon, end, dot }) {
  return (
    <NavLink to={to} end={end} style={({ isActive }) => ({
      ...st.link,
      color: isActive ? C.primary : C.text,
      fontWeight: isActive ? 700 : 500,
      background: isActive ? "#ff45001a" : "transparent",
    })}>
      {dot ? <span style={{ ...st.dot, background: dot }} /> : icon && <Icon name={icon} />}
      <span>{label}</span>
    </NavLink>
  );
}

function Group({ title }) {
  return <div style={st.group}>{title}</div>;
}

export default function Sidebar() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  if (isMobile) return null;

  const isStaff = user?.role === "admin" || user?.role === "agent";

  return (
    <aside style={st.sidebar}>
      <nav style={st.nav}>
        <Item to="/" label="Home" icon="home" end />
        <Item to="/help" label="Popular" icon="flame" />

        <Group title="Topics" />
        {TOPICS.map((t, i) => (
          <Item key={t} to={`/help?topic=${encodeURIComponent(t)}`} label={t} dot={DOT_COLORS[i % DOT_COLORS.length]} />
        ))}

        <Group title="Resources" />
        <Item to="/help" label="Knowledge Base" icon="book" />
        <Item to="/ask" label="Ask AI" icon="sparkle" />

        {isStaff && (
          <>
            <Group title="Backend" />
            <Item to="/admin" label="Dashboard" icon="dash" end />
            <Item to="/admin/users" label="Users" icon="users" />
            <Item to="/admin/kb" label="KB Manager" icon="kb" />
          </>
        )}
      </nav>
      <div style={st.footer}>HD Systems · Tech Community</div>
    </aside>
  );
}

const st = {
  sidebar: { width: 270, flexShrink: 0, position: "sticky", top: 68, alignSelf: "flex-start", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: "8px 8px 0", maxHeight: "calc(100vh - 80px)", overflowY: "auto" },
  nav: { display: "flex", flexDirection: "column", gap: 2 },
  link: { display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 4, fontSize: 14, textDecoration: "none" },
  dot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
  group: { fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: 1, textTransform: "uppercase", padding: "12px 12px 4px" },
  footer: { fontSize: 11, color: C.light, padding: "12px", borderTop: `1px solid ${C.divider}`, marginTop: 8 },
};
