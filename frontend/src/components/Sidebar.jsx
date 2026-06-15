import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ─── SVG icon set ──────────────────────────────────────────── */
function Icon({ name, size = 16 }) {
  const style = { display: "block", flexShrink: 0 };
  const p = (d, extra = {}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
      strokeLinejoin="round" style={style} {...extra}>
      {[].concat(d).map((x, i) => <path key={i} d={x} />)}
    </svg>
  );

  switch (name) {
    case "home":
      return p(["M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z", "M9 22V12h6v10"]);
    case "ai":
      return p(["M12 2a2 2 0 012 2v1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1v8a2 2 0 01-2 2H8a2 2 0 01-2-2V9H5a1 1 0 01-1-1V5a1 1 0 011-1h3V4a2 2 0 012-2z",
        "M9 9h6M9 13h6M9 17h4"]);
    case "help":
      return p(["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z",
        "M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3", "M12 17h.01"]);
    case "questions":
      return p(["M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"]);
    case "new":
      return p(["M12 5v14", "M5 12h14"]);
    case "queue":
      return p(["M8 6h13", "M8 12h13", "M8 18h13", "M3 6h.01", "M3 12h.01", "M3 18h.01"]);
    case "dashboard":
      return p(["M18 20V10", "M12 20V4", "M6 20v-6"]);
    case "users":
      return p(["M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2",
        "M9 11a4 4 0 100-8 4 4 0 000 8z",
        "M23 21v-2a4 4 0 00-3-3.87",
        "M16 3.13a4 4 0 010 7.75"]);
    case "kb":
      return p(["M4 19.5A2.5 2.5 0 016.5 17H20",
        "M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"]);
    case "dot":
      return <span style={{ display:"block", width: size, height: size, display:"flex", alignItems:"center", justifyContent:"center", color:"currentColor", fontSize: 18, lineHeight:1 }}>·</span>;
    default:
      return null;
  }
}

const COMMON = [
  { to: "/",    icon: "home",      label: "Home"        },
  { to: "/ask", icon: "ai",        label: "Ask AI"       },
  { to: "/help",icon: "help",      label: "Help Center"  },
];

const ROLE_LINKS = {
  user: [
    { to: "/my-questions", icon: "questions", label: "My Questions" },
    { to: "/new-question", icon: "new",        label: "New Question" },
  ],
  agent: [
    { to: "/agent",      icon: "queue",     label: "Queue"          },
    { to: "/admin/kb",   icon: "kb",        label: "Knowledge Base" },
  ],
  admin: [
    { to: "/agent",       icon: "queue",     label: "Queue"          },
    { to: "/admin",       icon: "dashboard", label: "Dashboard"      },
    { to: "/admin/users", icon: "users",     label: "Users"          },
    { to: "/admin/kb",    icon: "kb",        label: "Knowledge Base" },
  ],
};

const TOPICS = ["Password & Login", "Billing", "Security", "Account", "Technical"];

export default function Sidebar() {
  const { user } = useAuth();
  const roleLinks = ROLE_LINKS[user?.role] ?? [];

  function linkStyle({ isActive }) {
    return { ...s.link, ...(isActive ? s.linkActive : {}) };
  }

  return (
    <aside style={s.aside}>
      <nav style={s.nav}>
        {COMMON.map(l => (
          <NavLink key={l.to} to={l.to} end={l.to === "/"} style={linkStyle}>
            <Icon name={l.icon} />
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>

      {roleLinks.length > 0 && (
        <>
          <div style={s.divider} />
          <nav style={s.nav}>
            {roleLinks.map(l => (
              <NavLink key={l.to} to={l.to} style={linkStyle}>
                <Icon name={l.icon} />
                <span>{l.label}</span>
              </NavLink>
            ))}
          </nav>
        </>
      )}

      <div style={s.divider} />
      <div style={s.sectionHead}>Topics</div>
      <nav style={s.nav}>
        {TOPICS.map(t => (
          <NavLink
            key={t}
            to={`/help?tab=${encodeURIComponent(t.split(" ")[0])}`}
            style={({ isActive }) => ({ ...s.link, ...(isActive ? s.linkActive : {}) })}
          >
            <span style={s.topicDot} />
            <span style={{ fontSize: 13 }}>{t}</span>
          </NavLink>
        ))}
      </nav>

      {!user && (
        <>
          <div style={s.divider} />
          <div style={s.authBox}>
            <p style={s.authText}>Sign in to ask questions and track responses.</p>
            <Link to="/login"    style={s.loginBtn}>Sign in</Link>
            <Link to="/register" style={s.signUpBtn}>Sign up free</Link>
          </div>
        </>
      )}

      {user && (
        <>
          <div style={s.divider} />
          <div style={s.userRow}>
            <div style={s.avatar}>{user.name?.[0]?.toUpperCase() ?? "?"}</div>
            <div style={s.userInfo}>
              <div style={s.userName}>{user.name}</div>
              <div style={s.userEmail}>{user.email}</div>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}

const s = {
  aside: {
    width: 200, flexShrink: 0,
    position: "sticky", top: 76,
    height: "calc(100vh - 76px)",
    overflowY: "auto",
    paddingBottom: 20,
  },
  nav:  { display: "flex", flexDirection: "column", gap: 1 },
  link: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "9px 10px", borderRadius: 6,
    fontSize: 14, fontWeight: 500,
    color: "#636466", textDecoration: "none",
    transition: "background .1s, color .1s",
  },
  linkActive: { color: "#16c784", fontWeight: 700, background: "#f0fdf8" },

  topicDot: {
    width: 5, height: 5, borderRadius: "50%",
    background: "currentColor", flexShrink: 0, opacity: .4,
  },

  divider:    { height: 1, background: "#e8e8e8", margin: "10px 8px" },
  sectionHead:{ fontSize: 11, fontWeight: 700, color: "#939598", textTransform: "uppercase", letterSpacing: ".8px", padding: "4px 10px 6px" },

  authBox:  { padding: "0 8px", display: "flex", flexDirection: "column", gap: 8 },
  authText: { fontSize: 13, color: "#555", lineHeight: 1.5, margin: "0 0 4px" },
  loginBtn: {
    display: "block", textAlign: "center",
    padding: "8px", borderRadius: 20,
    border: "1.5px solid #16c784", color: "#16c784",
    fontWeight: 600, fontSize: 13, textDecoration: "none",
  },
  signUpBtn: {
    display: "block", textAlign: "center",
    padding: "8px", borderRadius: 20,
    background: "#16c784", color: "#fff",
    fontWeight: 700, fontSize: 13, textDecoration: "none",
  },

  userRow:  { display: "flex", alignItems: "center", gap: 10, padding: "4px 10px" },
  avatar:   {
    width: 32, height: 32, borderRadius: "50%",
    background: "#16c784", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 14, fontWeight: 700, flexShrink: 0,
  },
  userInfo: { minWidth: 0 },
  userName: { fontSize: 13, fontWeight: 600, color: "#282829", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  userEmail:{ fontSize: 11, color: "#939598", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
};
