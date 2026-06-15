import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Icon({ name }) {
  const p = (d) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {[].concat(d).map((x, i) => <path key={i} d={x} />)}
    </svg>
  );
  switch (name) {
    case "home":      return p(["M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z","M9 22V12h6v10"]);
    case "ai":        return p(["M12 2a2 2 0 012 2v1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1v8a2 2 0 01-2 2H8a2 2 0 01-2-2V9H5a1 1 0 01-1-1V5a1 1 0 011-1h3V4a2 2 0 012-2z","M9 9h6M9 13h6M9 17h4"]);
    case "help":      return p(["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z","M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3","M12 17h.01"]);
    case "questions": return p(["M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"]);
    case "new":       return p(["M12 5v14","M5 12h14"]);
    case "queue":     return p(["M8 6h13","M8 12h13","M8 18h13","M3 6h.01","M3 12h.01","M3 18h.01"]);
    case "signin":    return p(["M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4","M10 17l5-5-5-5","M15 12H3"]);
    default:          return null;
  }
}

export default function BottomNav() {
  const { user } = useAuth();

  const tabs = [
    { to: "/",    icon: "home",  label: "Home",    end: true },
    { to: "/ask", icon: "ai",    label: "Ask AI"   },
    { to: "/help",icon: "help",  label: "Help"     },
    ...(user?.role === "user"
      ? [{ to: "/my-questions", icon: "questions", label: "Mine"  },
         { to: "/new-question", icon: "new",       label: "New"   }]
      : user?.role === "agent"
      ? [{ to: "/agent",    icon: "queue", label: "Queue" },
         { to: "/admin/kb", icon: "help",  label: "KB"    }]
      : user?.role === "admin"
      ? [{ to: "/agent", icon: "queue",     label: "Queue"     },
         { to: "/admin", icon: "questions", label: "Dashboard" }]
      : [{ to: "/login", icon: "signin", label: "Sign in" }]
    ),
  ];

  return (
    <nav style={s.bar}>
      {tabs.map(t => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.end}
          style={({ isActive }) => ({ ...s.tab, ...(isActive ? s.tabActive : {}) })}
        >
          {({ isActive }) => (
            <>
              <span style={{ color: isActive ? "#16c784" : "#939598" }}><Icon name={t.icon} /></span>
              <span style={{ ...s.label, color: isActive ? "#16c784" : "#939598" }}>{t.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

const s = {
  bar: {
    position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200,
    height: 58,
    background: "#fff",
    borderTop: "1px solid #e8e8e8",
    display: "flex",
    alignItems: "stretch",
  },
  tab: {
    flex: 1,
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    gap: 3,
    textDecoration: "none",
    paddingBottom: "env(safe-area-inset-bottom, 0px)",
  },
  tabActive: {},
  label: { fontSize: 10, fontWeight: 600, letterSpacing: ".2px" },
};
