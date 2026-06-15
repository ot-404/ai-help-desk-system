import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const COMMON = [
  { to: "/",    icon: "⌂",  label: "Home"        },
  { to: "/ask", icon: "🤖", label: "Ask AI"       },
  { to: "/help",icon: "📚", label: "Help Center"  },
];

const ROLE_LINKS = {
  user: [
    { to: "/my-questions", icon: "❓", label: "My Questions"   },
    { to: "/new-question", icon: "✏️", label: "New Question"  },
  ],
  agent: [
    { to: "/agent",      icon: "📋", label: "Queue"          },
    { to: "/admin/kb",   icon: "📖", label: "Knowledge Base" },
  ],
  admin: [
    { to: "/agent",      icon: "📋", label: "Queue"          },
    { to: "/admin",      icon: "📊", label: "Dashboard"      },
    { to: "/admin/users",icon: "👥", label: "Users"          },
    { to: "/admin/kb",   icon: "📖", label: "Knowledge Base" },
  ],
};

const TOPICS = ["Password & Login", "Billing", "Security", "Account", "Technical"];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const roleLinks = ROLE_LINKS[user?.role] ?? [];

  function linkStyle({ isActive }) {
    return {
      ...s.link,
      ...(isActive ? s.linkActive : {}),
    };
  }

  return (
    <aside style={s.aside}>
      {/* Common nav */}
      <nav style={s.nav}>
        {COMMON.map(l => (
          <NavLink key={l.to} to={l.to} end={l.to === "/"} style={linkStyle}>
            <span style={s.icon}>{l.icon}</span>
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Role-specific nav */}
      {roleLinks.length > 0 && (
        <>
          <div style={s.divider} />
          <nav style={s.nav}>
            {roleLinks.map(l => (
              <NavLink key={l.to} to={l.to} style={linkStyle}>
                <span style={s.icon}>{l.icon}</span>
                <span>{l.label}</span>
              </NavLink>
            ))}
          </nav>
        </>
      )}

      {/* Topics */}
      <div style={s.divider} />
      <div style={s.sectionHead}>Topics</div>
      <nav style={s.nav}>
        {TOPICS.map(t => (
          <NavLink
            key={t}
            to={`/help?tab=${encodeURIComponent(t.split(" ")[0])}`}
            style={({ isActive }) => ({ ...s.link, ...(isActive ? s.linkActive : {}) })}
          >
            <span style={s.icon}>·</span>
            <span style={{ fontSize: 13 }}>{t}</span>
          </NavLink>
        ))}
      </nav>

      {/* Guest auth CTA */}
      {!user && (
        <>
          <div style={s.divider} />
          <div style={s.authBox}>
            <p style={s.authText}>Sign in to submit tickets and ask AI questions.</p>
            <Link to="/login"    style={s.loginBtn}>Sign in</Link>
            <Link to="/register" style={s.signUpBtn}>Sign up free</Link>
          </div>
        </>
      )}

      {/* Logged-in user footer */}
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
    color: "#282829", textDecoration: "none",
    transition: "background .1s, color .1s",
  },
  linkActive: { color: "#16c784", fontWeight: 700, background: "#f0fdf8" },
  icon: { fontSize: 15, width: 20, textAlign: "center", flexShrink: 0 },

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
