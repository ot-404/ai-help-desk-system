import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { C } from "../theme";

function Icon({ name }) {
  const p = (d) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      {[].concat(d).map((x, i) => <path key={i} d={x} />)}
    </svg>
  );
  switch (name) {
    case "home": return p(["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "M9 22V12h6v10"]);
    case "questions": return p(["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"]);
    case "ask": return p(["M12 5v14", "M5 12h14"]);
    case "ai": return p(["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", "M12 17h.01"]);
    case "profile": return p(["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"]);
    default: return null;
  }
}

export default function BottomNav() {
  const { user } = useAuth();
  const profileTo = user ? (user.role === "user" ? "/my-questions" : user.role === "admin" ? "/admin" : "/agent") : "/login";

  const tabs = [
    { to: "/", icon: "home", label: "Home", end: true },
    { to: "/help", icon: "questions", label: "Questions" },
    { to: "/new-question", icon: "ask", label: "Ask", big: true },
    { to: "/ask", icon: "ai", label: "AI" },
    { to: profileTo, icon: "profile", label: "Profile" },
  ];

  return (
    <nav style={s.bar}>
      {tabs.map((t) => (
        <NavLink key={t.label} to={t.to} end={t.end} style={({ isActive }) => ({ ...s.tab, color: isActive ? C.primary : C.light })}>
          {t.big ? (
            <span style={s.plus}><Icon name={t.icon} /></span>
          ) : (
            <><Icon name={t.icon} /><span style={s.label}>{t.label}</span></>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

const s = {
  bar: { position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200, height: 58, background: C.surface, borderTop: "1px solid " + C.border, display: "flex", alignItems: "stretch" },
  tab: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, textDecoration: "none", paddingBottom: "env(safe-area-inset-bottom, 0px)" },
  label: { fontSize: 10, fontWeight: 600 },
  plus: { width: 40, height: 40, borderRadius: "50%", background: C.primary, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" },
};
