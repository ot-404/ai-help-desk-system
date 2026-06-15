import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useIsMobile } from "../hooks/useIsMobile";

const roleColor = (role) =>
  role === "admin" ? "#e53e3e" : role === "agent" ? "#805ad5" : "#16c784";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) navigate(`/help?q=${encodeURIComponent(searchVal.trim())}`);
  };

  return (
    <nav style={s.nav}>
      <div style={s.left}>
        <Link to="/" style={s.logo}>AHD</Link>
      </div>

      {!isMobile && (
        <form onSubmit={handleSearch} style={s.searchForm}>
          <span style={s.searchIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input
            style={s.searchInput}
            placeholder="Search AHD..."
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
          />
        </form>
      )}

      <div style={s.right}>
        {isMobile && (
          <button style={s.iconBtn} onClick={() => setSearchOpen(v => !v)} aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
        )}

        {user ? (
          <>
            {!isMobile && (
              <>
                <button style={s.iconBtn} onClick={() => navigate("/")} aria-label="Home">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </button>
                <button style={s.iconBtn} onClick={() => navigate("/ask")} aria-label="Ask AI">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </button>
                <button style={s.iconBtn} aria-label="Notifications">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                </button>
              </>
            )}
            <div style={{ ...s.avatar, background: roleColor(user.role) }} title={user.role}>
              {(user.name || user.email || "?")[0].toUpperCase()}
            </div>
            {!isMobile && <span style={s.username}>{user.name || user.email}</span>}
            <button style={s.addBtn} onClick={() => navigate("/ask")}>Add Question</button>
            <button style={s.signOutBtn} onClick={logout}>Sign out</button>
          </>
        ) : (
          <>
            <Link to="/login" style={s.ghostBtn}>Sign in</Link>
            <Link to="/register" style={s.addBtn}>Sign up</Link>
          </>
        )}
      </div>

      {isMobile && searchOpen && (
        <form onSubmit={handleSearch} style={s.mobileSearchOverlay}>
          <input
            autoFocus
            style={s.mobileSearchInput}
            placeholder="Search AHD..."
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
          />
          <button type="button" style={s.closeBtn} onClick={() => setSearchOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </form>
      )}
    </nav>
  );
}

const s = {
  nav: {
    position: "fixed", top: 0, left: 0, right: 0, height: 56,
    background: "#fff", borderBottom: "1px solid #e8e8e8",
    display: "flex", alignItems: "center", padding: "0 16px",
    gap: 12, zIndex: 100,
  },
  left: { display: "flex", alignItems: "center", flexShrink: 0 },
  logo: {
    background: "#16c784", color: "#fff", fontWeight: 800,
    fontSize: 18, borderRadius: 6, padding: "4px 10px",
    textDecoration: "none", letterSpacing: 1,
  },
  searchForm: {
    flex: 1, maxWidth: 520, position: "relative",
    display: "flex", alignItems: "center",
  },
  searchIcon: {
    position: "absolute", left: 10, display: "flex", alignItems: "center",
  },
  searchInput: {
    width: "100%", height: 36, borderRadius: 18,
    border: "1px solid #e8e8e8", background: "#f7f7f5",
    padding: "0 12px 0 34px", fontSize: 14, outline: "none",
    boxSizing: "border-box",
  },
  right: { display: "flex", alignItems: "center", gap: 8, marginLeft: "auto", flexShrink: 0 },
  iconBtn: {
    background: "none", border: "none", cursor: "pointer",
    padding: 6, borderRadius: "50%", display: "flex", alignItems: "center",
  },
  avatar: {
    width: 32, height: 32, borderRadius: "50%", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: 14, flexShrink: 0, cursor: "pointer",
  },
  username: {
    fontSize: 14, fontWeight: 500, color: "#333",
    maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
  },
  addBtn: {
    background: "#16c784", color: "#fff", border: "none",
    borderRadius: 20, padding: "7px 16px", fontSize: 14,
    fontWeight: 600, cursor: "pointer", textDecoration: "none",
    display: "inline-flex", alignItems: "center",
  },
  ghostBtn: {
    background: "none", color: "#333", border: "1px solid #ccc",
    borderRadius: 20, padding: "6px 16px", fontSize: 14,
    fontWeight: 500, cursor: "pointer", textDecoration: "none",
    display: "inline-flex", alignItems: "center",
  },
  signOutBtn: {
    background: "none", color: "#888", border: "1px solid #e8e8e8",
    borderRadius: 20, padding: "6px 14px", fontSize: 13, cursor: "pointer",
  },
  mobileSearchOverlay: {
    position: "absolute", top: 0, left: 0, right: 0, height: 56,
    background: "#fff", display: "flex", alignItems: "center",
    padding: "0 12px", gap: 8, zIndex: 101,
  },
  mobileSearchInput: {
    flex: 1, height: 36, borderRadius: 18, border: "1px solid #e8e8e8",
    background: "#f7f7f5", padding: "0 14px", fontSize: 14, outline: "none",
  },
  closeBtn: {
    background: "none", border: "none", cursor: "pointer",
    display: "flex", alignItems: "center",
  },
};
