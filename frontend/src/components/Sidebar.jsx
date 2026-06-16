import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useIsMobile } from "../hooks/useIsMobile";
import { C } from "../theme";

function Item({ to, label, end, indent }) {
  return (
    <NavLink to={to} end={end} style={({ isActive }) => ({
      ...st.link,
      paddingLeft: indent ? 22 : 10,
      color: isActive ? C.primary : C.muted,
      fontWeight: isActive ? 600 : 400,
      background: isActive ? C.primaryBg : "transparent",
    })}>
      {label}
    </NavLink>
  );
}

export default function Sidebar() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  if (isMobile) return null;

  const isStaff = user?.role === "admin" || user?.role === "agent";

  return (
    <aside style={st.sidebar}>
      <nav style={st.nav}>
        <Item to="/" label="Home" end />
        <div style={st.group}>Questions</div>
        <Item to="/?tab=newest" label="Newest" indent />
        <Item to="/?tab=active" label="Active" indent />
        <Item to="/?tab=unanswered" label="Unanswered" indent />
        <div style={{ height: 12 }} />
        <Item to="/help" label="Knowledge Base" />
        <Item to="/ask" label="Ask AI" />

        {isStaff && (
          <>
            <div style={st.group}>Backend</div>
            <Item to="/admin" label="Dashboard" indent end />
            <Item to="/admin/users" label="Users" indent />
            <Item to="/admin/kb" label="KB Manager" indent />
          </>
        )}
      </nav>
    </aside>
  );
}

const st = {
  sidebar: { width: 200, flexShrink: 0, position: "sticky", top: 76, alignSelf: "flex-start" },
  nav: { display: "flex", flexDirection: "column", gap: 2 },
  link: { display: "block", padding: "6px 10px", borderRadius: 6, fontSize: 14, textDecoration: "none" },
  group: { fontSize: 12, fontWeight: 600, color: C.light, padding: "12px 10px 2px" },
};
