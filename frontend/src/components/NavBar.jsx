import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useIsMobile } from "../hooks/useIsMobile";
import { C } from "../theme";

const ROLE_BG = { admin: "#ff4500", agent: "#0079d3", user: "#46d160" };

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/help?q=${encodeURIComponent(q.trim())}`);
    setSearchOpen(false);
  };

  const avatarChar = user ? (user.name || user.email || "?")[0].toUpperCase() : "?";
  const avatarBg = user ? (ROLE_BG[user.role] || "#0079d3") : "#0079d3";

  const Logo = (
    <Link to="/" style={s.logo}>
      <span style={s.logoBadge}>HD</span>
      {!isMobile && <span style={s.logoText}>Systems</span>}
    </Link>
  );

  return (
    <nav style={s.nav}>
      {Logo}

      {!isMobile && (
        <form onSubmit={submit} style={s.searchForm}>
          <span style={s.searchIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#878a8c" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          </span>
          <input style={s.searchInput} placeholder="Search HD Systems" value={q} onChange={(e) => setQ(e.target.value)} />
        </form>
      )}

      <div style={s.right}>
        {isMobile && (
          <button style={s.iconBtn} onClick={() => setSearchOpen((v) => !v)} aria-label="Search">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.navText} strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          </button>
        )}

        {user ? (
          <>
            {!isMobile && <Link to="/new-question" style={s.createBtn}>Create Post</Link>}
            <Link to="/my-questions" aria-label="Profile">
              <div style={{ ...s.avatar, background: avatarBg }} title={user.role}>{avatarChar}</div>
            </Link>
            {!isMobile && <button style={s.signOut} onClick={logout}>Sign out</button>}
          </>
        ) : (
          <>
            <Link to="/login" style={s.loginBtn}>Log In</Link>
            {!isMobile && <Link to="/register" style={s.signupBtn}>Sign Up</Link>}
          </>
        )}
      </div>

      {isMobile && searchOpen && (
        <form onSubmit={submit} style={s.mobileSearch}>
          <input autoFocus style={s.mobileInput} placeholder="Search HD Systems" value={q} onChange={(e) => setQ(e.target.value)} />
          <button type="button" style={s.iconBtn} onClick={() => setSearchOpen(false)} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.navText} strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </form>
      )}
    </nav>
  );
}

const s = {
  nav: { position: "fixed", top: 0, left: 0, right: 0, height: 48, background: C.nav, borderBottom: `1px solid ${C.navBorder}`, display: "flex", alignItems: "center", padding: "0 16px", gap: 16, zIndex: 100 },
  logo: { textDecoration: "none", flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 6 },
  logoBadge: { background: C.primary, color: "#fff", fontWeight: 800, borderRadius: 4, padding: "3px 7px", fontSize: 15 },
  logoText: { color: "#fff", fontWeight: 700, fontSize: 18 },
  searchForm: { flex: 1, maxWidth: 690, position: "relative", display: "flex", alignItems: "center" },
  searchIcon: { position: "absolute", left: 12, display: "flex", pointerEvents: "none" },
  searchInput: { width: "100%", height: 36, borderRadius: 20, border: "1px solid #343536", background: "#272729", padding: "0 12px 0 36px", fontSize: 14, boxSizing: "border-box", color: "#fff", outline: "none" },
  right: { display: "flex", alignItems: "center", gap: 10, marginLeft: "auto", flexShrink: 0 },
  iconBtn: { background: "none", border: "none", padding: 8, borderRadius: 6, display: "flex", cursor: "pointer", minHeight: 44, minWidth: 44, alignItems: "center", justifyContent: "center" },
  createBtn: { background: C.primary, color: "#fff", border: "none", borderRadius: 20, padding: "5px 16px", fontSize: 14, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", whiteSpace: "nowrap", minHeight: 32 },
  avatar: { width: 28, height: 28, borderRadius: "50%", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 },
  signOut: { background: "none", border: "none", color: C.navText, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" },
  loginBtn: { border: "1px solid #818384", color: C.navText, borderRadius: 20, padding: "5px 16px", fontSize: 14, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", whiteSpace: "nowrap" },
  signupBtn: { background: C.primary, color: "#fff", borderRadius: 20, padding: "5px 16px", fontSize: 14, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", whiteSpace: "nowrap" },
  mobileSearch: { position: "absolute", top: 0, left: 0, right: 0, height: 48, background: C.nav, display: "flex", alignItems: "center", padding: "0 12px", gap: 8, zIndex: 101 },
  mobileInput: { flex: 1, height: 36, borderRadius: 20, border: "1px solid #343536", background: "#272729", padding: "0 14px", fontSize: 16, boxSizing: "border-box", color: "#fff", outline: "none" },
};
