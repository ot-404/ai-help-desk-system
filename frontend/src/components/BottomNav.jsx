import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { C } from "../theme";

function Icon({ name }) {
  const p = (d) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      {[].concat(d).map((x, i) => <path key={i} d={x} />)}
    </svg>
  );
  switch (name) {
    case "home": return p(["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "M9 22V12h6v10"]);
    case "flame": return p(["M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"]);
    case "plus": return p(["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 8v8", "M8 12h8"]);
    case "ai": return p(["M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z", "M19 15l.7 1.8L21.5 18l-1.8.7L19 21l-.7-1.8L16.5 18l1.8-.7z"]);
    case "profile": return p(["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"]);
    default: return null;
  }
}

export default function BottomNav() {
  const { user } = useAuth();
  const profileTo = user ? "/profile" : "/login";

  const tabs = [
    { to: "/", icon: "home", label: "Home", end: true },
    { to: "/popular", icon: "flame", label: "Popular" },
    { to: "/new-question", icon: "plus", label: "Post" },
    { to: "/ask", icon: "ai", label: "AI" },
    { to: profileTo, icon: "profile", label: "Profile" },
  ];

  return (
    <nav style={s.bar}>
      {tabs.map((t) => (
        <NavLink key={t.label} to={t.to} end={t.end} style={({ isActive }) => ({ ...s.tab, color: isActive ? C.primary : C.muted })}>
          <Icon name={t.icon} />
          <span style={{ ...s.label, fontWeight: 600 }}>{t.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

const s = {
  bar: { position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200, minHeight: 58, background: C.surface, borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "stretch", paddingBottom: "env(safe-area-inset-bottom, 0px)", boxShadow: "0 -1px 8px rgba(0,0,0,0.03)" },
  tab: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, textDecoration: "none", minHeight: 58 },
  label: { fontSize: 10.5, fontWeight: 600, letterSpacing: 0.1 },
};
