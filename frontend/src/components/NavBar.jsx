import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar({ onSearch }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() { logout(); nav("/login"); }

  function handleSearch(e) {
    e.preventDefault();
    if (onSearch) onSearch(q);
  }

  const initials = user?.name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?";

  return (
    <header style={s.bar}>
      <div style={s.inner}>
        {/* Logo */}
        <Link to="/" style={s.logo}>
          <span style={s.logoBox}>AI</span>
          <span style={s.logoText}>HelpDesk</span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} style={s.searchWrap}>
          <span style={s.searchIcon}>🔍</span>
          <input
            style={s.searchInput}
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search tickets, knowledge base…"
          />
        </form>

        {/* Right actions */}
        <div style={s.actions}>
          {user && (
            <Link
              to={user.role === "user" ? "/new-ticket" : "/agent"}
              style={s.addBtn}
            >
              + {user.role === "user" ? "Ask" : "Queue"}
            </Link>
          )}

          {/* Avatar + dropdown */}
          <div style={s.avatarWrap} onClick={() => setMenuOpen(o => !o)}>
            <div style={s.avatar}>{initials}</div>
            {menuOpen && (
              <div style={s.dropdown}>
                <div style={s.dropName}>{user?.name}</div>
                <div style={s.dropRole}>{user?.role}</div>
                <hr style={s.dropDivider} />
                <Link to="/profile" style={s.dropItem} onClick={() => setMenuOpen(false)}>Profile</Link>
                <button style={s.dropItem} onClick={handleLogout}>Sign out</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

const s = {
  bar: { position: "fixed", top: 0, left: 0, right: 0, height: 50, background: "#fff", borderBottom: "1px solid #e8e8e8", zIndex: 100 },
  inner: { maxWidth: 1200, margin: "0 auto", height: "100%", display: "flex", alignItems: "center", gap: 16, padding: "0 16px" },
  logo: { display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0 },
  logoBox: { background: "#16c784", color: "#fff", fontWeight: 800, fontSize: 13, padding: "3px 7px", borderRadius: 5 },
  logoText: { fontWeight: 700, fontSize: 17, color: "#282829" },
  searchWrap: { flex: 1, position: "relative", maxWidth: 520 },
  searchIcon: { position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, pointerEvents: "none" },
  searchInput: { width: "100%", background: "#f2f2f0", border: "1px solid #e8e8e8", borderRadius: 20, padding: "7px 14px 7px 34px", fontSize: 14, color: "#282829", transition: "border-color .15s" },
  actions: { display: "flex", alignItems: "center", gap: 12, marginLeft: "auto" },
  addBtn: { background: "#16c784", color: "#fff", border: "none", borderRadius: 20, padding: "6px 18px", fontSize: 14, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" },
  avatarWrap: { position: "relative", cursor: "pointer" },
  avatar: { width: 34, height: 34, borderRadius: "50%", background: "#16c784", color: "#fff", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", userSelect: "none" },
  dropdown: { position: "absolute", top: 40, right: 0, width: 200, background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8, boxShadow: "0 4px 20px rgba(0,0,0,.12)", padding: "10px 0", zIndex: 200 },
  dropName: { padding: "4px 16px 2px", fontWeight: 700, fontSize: 14, color: "#282829" },
  dropRole: { padding: "0 16px 8px", fontSize: 12, color: "#939598", textTransform: "uppercase", letterSpacing: ".5px" },
  dropDivider: { border: "none", borderTop: "1px solid #e8e8e8", margin: "4px 0" },
  dropItem: { display: "block", width: "100%", textAlign: "left", padding: "8px 16px", fontSize: 14, color: "#282829", background: "none", border: "none", textDecoration: "none", cursor: "pointer" },
};
