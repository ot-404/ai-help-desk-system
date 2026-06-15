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
        <span style={s.logoBox}>AHD</span>
      </Link>

      {/* Search — centered */}
      <form onSubmit={handleSearch} style={s.searchWrap}>
        <span style={s.searchIcon}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </span>
        <input
          style={s.searchInput}
          placeholder="Search AI Help Desk…"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </form>

      {/* Right actions */}
      <div style={s.right}>
        <Link to="/ask" style={s.addBtn}>Add Question</Link>

        {user ? (
          <>
            <div style={s.avatarWrap}>
              <div style={{ ...s.avatar, background: ROLE_BG[user.role] ?? "#16c784" }}>
                {user.name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <span style={s.userName}>{user.name?.split(" ")[0]}</span>
            </div>
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

const ROLE_BG = { admin: "#805ad5", agent: "#3182ce", user: "#16c784" };

const s = {
  bar: {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
    height: 56, display: "flex", alignItems: "center", gap: 12,
    padding: "0 20px",
    background: "#fff",
    borderBottom: "1px solid #e8e8e8",
    boxShadow: "0 1px 3px rgba(0,0,0,.06)",
  },
  brand: {
    display: "flex", alignItems: "center",
    textDecoration: "none", flexShrink: 0,
  },
  logoBox: {
    background: "#16c784", color: "#fff",
    fontWeight: 900, fontSize: 13, padding: "4px 10px", borderRadius: 6,
    letterSpacing: ".5px",
  },

  searchWrap: {
    flex: 1, maxWidth: 520,
    display: "flex", alignItems: "center", gap: 8,
    background: "#f2f2f0", borderRadius: 24,
    padding: "0 14px", height: 38,
    border: "1.5px solid transparent",
  },
  searchIcon: { fontSize: 14, lineHeight: 1, opacity: .5, userSelect: "none", display: "flex", alignItems: "center" },
  searchInput: {
    flex: 1, background: "none", border: "none", outline: "none",
    color: "#282829", fontSize: 14,
  },

  right: { display: "flex", alignItems: "center", gap: 10, marginLeft: "auto", flexShrink: 0 },

  addBtn: {
    background: "#16c784", color: "#fff",
    padding: "6px 16px", borderRadius: 20,
    fontSize: 13, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap",
  },

  avatarWrap: { display: "flex", alignItems: "center", gap: 7 },
  avatar: {
    width: 32, height: 32, borderRadius: "50%", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 13, fontWeight: 700, flexShrink: 0,
  },
  userName: { color: "#282829", fontSize: 13, fontWeight: 600 },

  ghostBtn: {
    background: "none", border: "1px solid #e8e8e8",
    color: "#555", padding: "5px 12px",
    borderRadius: 6, fontSize: 13, cursor: "pointer",
    textDecoration: "none", display: "inline-block",
  },
  signUpBtn: {
    border: "1.5px solid #16c784", color: "#16c784",
    padding: "5px 14px", borderRadius: 20,
    fontSize: 13, fontWeight: 700, textDecoration: "none",
    background: "transparent",
  },
};
