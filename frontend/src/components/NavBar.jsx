import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [q, setQ] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    if (q.trim()) nav(`/help?q=${encodeURIComponent(q.trim())}`);
  }

  function handleLogout() {
    logout();
    nav("/");
  }

  return (
    <header style={s.bar}>
      {/* Brand */}
      <Link to="/" style={s.brand}>
        <span style={s.logoBox}>AI</span>
        <span style={s.brandName}>Help Desk</span>
      </Link>

      {/* Search */}
      <form onSubmit={handleSearch} style={s.searchWrap}>
        <span style={s.searchIcon}>⌕</span>
        <input
          style={s.searchInput}
          placeholder="Search questions and articles…"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </form>

      {/* Right actions */}
      <div style={s.right}>
        <Link to="/ask" style={s.askBtn}>Ask Question</Link>

        {user ? (
          <>
            <span style={{ ...s.rolePill, ...ROLE_COLORS[user.role] }}>
              {user.role}
            </span>
            <span style={s.userName}>{user.name?.split(" ")[0]}</span>
            <button onClick={handleLogout} style={s.ghostBtn}>Sign out</button>
          </>
        ) : (
          <>
            <Link to="/login"    style={s.ghostBtn}>Sign in</Link>
            <Link to="/register" style={s.signUpBtn}>Sign up</Link>
          </>
        )}
      </div>
    </header>
  );
}

const ROLE_COLORS = {
  admin: { background: "#fff5f5", color: "#e53e3e" },
  agent: { background: "#faf5ff", color: "#805ad5" },
  user:  { background: "#f0fff4", color: "#276749" },
};

const s = {
  bar: {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
    height: 56, display: "flex", alignItems: "center", gap: 16,
    padding: "0 20px",
    background: "#1f2a37",
    boxShadow: "0 1px 4px rgba(0,0,0,.35)",
  },
  brand: {
    display: "flex", alignItems: "center", gap: 8,
    textDecoration: "none", flexShrink: 0,
  },
  logoBox: {
    background: "#16c784", color: "#fff",
    fontWeight: 800, fontSize: 13, padding: "3px 8px", borderRadius: 6,
  },
  brandName: { color: "#fff", fontWeight: 700, fontSize: 16, whiteSpace: "nowrap" },

  searchWrap: {
    flex: 1, maxWidth: 500,
    display: "flex", alignItems: "center", gap: 8,
    background: "#2d3a4a", borderRadius: 24,
    padding: "0 14px", height: 36,
  },
  searchIcon: { color: "#a0aec0", fontSize: 18, lineHeight: 1, userSelect: "none" },
  searchInput: {
    flex: 1, background: "none", border: "none", outline: "none",
    color: "#e2e8f0", fontSize: 14,
  },

  right: { display: "flex", alignItems: "center", gap: 10, marginLeft: "auto", flexShrink: 0 },

  askBtn: {
    background: "#16c784", color: "#fff",
    padding: "6px 16px", borderRadius: 20,
    fontSize: 13, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap",
  },
  rolePill: {
    fontSize: 11, fontWeight: 700, padding: "3px 9px",
    borderRadius: 20, textTransform: "uppercase", letterSpacing: ".4px",
  },
  userName: { color: "#cbd5e0", fontSize: 13, fontWeight: 500 },
  ghostBtn: {
    background: "none", border: "1px solid #4a5568",
    color: "#a0aec0", padding: "5px 12px",
    borderRadius: 6, fontSize: 13, cursor: "pointer",
    textDecoration: "none", display: "inline-block",
  },
  signUpBtn: {
    border: "1.5px solid #16c784", color: "#16c784",
    padding: "5px 13px", borderRadius: 20,
    fontSize: 13, fontWeight: 600, textDecoration: "none",
    background: "transparent",
  },
};
