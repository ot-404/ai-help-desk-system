import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { C } from "../theme";

const ROLE_BG = { admin: C.primary, agent: C.blue, user: C.success };
const ROLE_LABEL = { admin: "Admin", agent: "Support Agent", user: "Member" };

function Icon({ name }) {
  const p = (d) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {[].concat(d).map((x, i) => <path key={i} d={x} />)}
    </svg>
  );
  switch (name) {
    case "user": return p(["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"]);
    case "plus": return p(["M12 5v14", "M5 12h14"]);
    case "sparkle": return p(["M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"]);
    case "faq": return p(["M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", "M12 17h.01", "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"]);
    case "list": return p(["M8 6h13", "M8 12h13", "M8 18h13", "M3 6h.01", "M3 12h.01", "M3 18h.01"]);
    case "dash": return p(["M3 3h7v9H3z", "M14 3h7v5h-7z", "M14 12h7v9h-7z", "M3 16h7v5H3z"]);
    case "users": return p(["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"]);
    case "kb": return p(["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6", "M9 13h6", "M9 17h6"]);
    case "book": return p(["M4 19.5A2.5 2.5 0 0 1 6.5 17H20", "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"]);
    case "logout": return p(["M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", "M16 17l5-5-5-5", "M21 12H9"]);
    default: return null;
  }
}

export default function ProfileMenu({ user, logout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const initial = (user.name || user.email || "?")[0].toUpperCase();
  const avatarBg = ROLE_BG[user.role] || C.blue;
  const isStaff = user.role === "admin" || user.role === "agent";

  // Close on outside click, Escape, or navigation.
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const items = [
    { to: "/profile", label: "View Profile", icon: "user" },
    { to: "/new-question", label: "Create a post", icon: "plus" },
    { to: "/ask", label: "Ask AI", icon: "sparkle" },
    { to: "/faq", label: "FAQs", icon: "faq" },
    ...(user.role === "user" ? [{ to: "/my-questions", label: "My questions", icon: "list" }] : []),
  ];

  const staffItems = isStaff ? [
    ...(user.role === "admin" ? [{ to: "/admin", label: "Dashboard", icon: "dash" }] : []),
    { to: "/agent", label: "Agent queue", icon: "list" },
    ...(user.role === "admin" ? [{ to: "/admin/users", label: "Manage users", icon: "users" }] : []),
    { to: "/admin/kb", label: "KB Manager", icon: "kb" },
    { to: "/help", label: "Knowledge Base", icon: "book" },
  ] : [];

  const doLogout = () => {
    setOpen(false);
    logout();
    navigate("/");
  };

  return (
    <div ref={ref} style={s.wrap}>
      <button
        style={{ ...s.avatar, background: avatarBg }}
        onClick={() => setOpen((v) => !v)}
        aria-label="Profile menu"
        aria-expanded={open}
        title={user.name || user.email}
      >
        {initial}
      </button>

      {open && (
        <div style={s.menu} role="menu">
          <Link to="/profile" style={s.header}>
            <div style={{ ...s.headerAvatar, background: avatarBg }}>{initial}</div>
            <div style={{ minWidth: 0 }}>
              <div style={s.headerName}>{user.name || "User"}</div>
              <div style={s.headerRole}>{ROLE_LABEL[user.role] || user.role}</div>
            </div>
          </Link>

          <div style={s.divider} />

          {items.map((it) => (
            <Link key={it.to} to={it.to} style={s.item} role="menuitem">
              <Icon name={it.icon} /><span>{it.label}</span>
            </Link>
          ))}

          {staffItems.length > 0 && (
            <>
              <div style={s.divider} />
              <div style={s.group}>Staff</div>
              {staffItems.map((it) => (
                <Link key={it.to + it.label} to={it.to} style={s.item} role="menuitem">
                  <Icon name={it.icon} /><span>{it.label}</span>
                </Link>
              ))}
            </>
          )}

          <div style={s.divider} />
          <button style={{ ...s.item, ...s.logout }} onClick={doLogout} role="menuitem">
            <Icon name="logout" /><span>Log out</span>
          </button>
        </div>
      )}
    </div>
  );
}

const s = {
  wrap: { position: "relative", display: "flex" },
  avatar: { width: 32, height: 32, borderRadius: "50%", color: "#fff", border: "none", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, cursor: "pointer", flexShrink: 0 },
  menu: {
    position: "absolute", top: "calc(100% + 10px)", right: 0, width: 244,
    background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12,
    boxShadow: "0 8px 28px rgba(0,0,0,0.14)", padding: 6, zIndex: 300,
  },
  header: { display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8, textDecoration: "none" },
  headerAvatar: { width: 38, height: 38, borderRadius: "50%", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, flexShrink: 0 },
  headerName: { fontSize: 14, fontWeight: 700, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  headerRole: { fontSize: 12, color: C.muted },
  divider: { height: 1, background: C.divider, margin: "6px 4px" },
  group: { fontSize: 10.5, fontWeight: 700, color: C.light, letterSpacing: 0.6, textTransform: "uppercase", padding: "4px 12px 4px" },
  item: { display: "flex", alignItems: "center", gap: 11, width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 14, color: C.text, textDecoration: "none", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontWeight: 500 },
  logout: { color: C.danger },
};
