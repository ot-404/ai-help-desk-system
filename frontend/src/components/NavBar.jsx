import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useIsMobile } from "../hooks/useIsMobile";
import { C } from "../theme";
import Logo from "./Logo";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [q, setQ] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/help?q=${encodeURIComponent(q.trim())}`);
    setSearchOpen(false);
  };

  const avatarChar = user ? (user.name || user.email || "?")[0].toUpperCase() : "?";

  return (
    <nav style={s.nav}>
      <Link to="/" style={{ textDecoration: "none", flexShrink: 0 }}><Logo /></Link>

      {!isMobile && (
        <form onSubmit={submit} style={s.searchForm}>
          <span style={s.searchIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.light} strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          </span>
          <input style={s.searchInput} placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
        </form>
      )}

      <div style={s.right}>
        {isMobile && (
          <button style={s.iconBtn} onClick={() => setSearchOpen((v) => !v)} aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          </button>
        )}

        {user ? (
          <>
            {!isMobile && (
              <>
                <Link to="/new-question" style={s.askBtn}>Ask Question</Link>
                <button style={s.iconBtn} aria-label="Notifications">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                </button>
              </>
            )}
            <div style={s.userWrap}>
              <button style={s.userBtn} onClick={() => setMenuOpen((v) => !v)}>
                <div style={s.avatar} title={user.role}>{avatarChar}</div>
                {!isMobile && <span style={s.username}>{user.name || user.email}</span>}
                {!isMobile && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                )}
              </button>
              {menuOpen && (
                <div style={s.menu}>
                  <Link to="/my-questions" style={s.menuItem} onClick={() => setMenuOpen(false)}>Profile</Link>
                  <button style={{ ...s.menuItem, ...s.menuBtn }} onClick={() => { setMenuOpen(false); logout(); }}>Sign out</button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" style={s.ghostBtn}>Log in</Link>
            <Link to="/register" style={s.askBtn}>Sign up</Link>
          </>
        )}
      </div>

      {isMobile && searchOpen && (
        <form onSubmit={submit} style={s.mobileSearch}>
          <input autoFocus style={s.mobileInput} placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
          <button type="button" style={s.iconBtn} onClick={() => setSearchOpen(false)} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </form>
      )}
    </nav>
  );
}

const s = {
  nav: { position: "fixed", top: 0, left: 0, right: 0, height: 60, background: C.surface, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", padding: "0 16px", gap: 14, zIndex: 100, boxShadow: "0 1px 0 rgba(0,0,0,0.03)" },
  searchForm: { flex: 1, maxWidth: 600, position: "relative", display: "flex", alignItems: "center" },
  searchIcon: { position: "absolute", left: 12, display: "flex" },
  searchInput: { width: "100%", height: 36, borderRadius: 4, border: `1px solid #babfc4`, background: C.surface, padding: "0 14px 0 36px", fontSize: 14, boxSizing: "border-box" },
  right: { display: "flex", alignItems: "center", gap: 8, marginLeft: "auto", flexShrink: 0 },
  iconBtn: { background: "none", border: "none", padding: 7, borderRadius: "50%", display: "flex", cursor: "pointer" },
  askBtn: { background: C.primary, color: "#fff", border: "none", borderRadius: 4, padding: "8px 12px", fontSize: 13, fontWeight: 500, textDecoration: "none", display: "inline-flex", alignItems: "center", whiteSpace: "nowrap" },
  avatar: { width: 30, height: 30, borderRadius: 3, background: C.rep, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0 },
  userWrap: { position: "relative" },
  userBtn: { background: "none", border: "none", display: "flex", alignItems: "center", gap: 7, cursor: "pointer", padding: 2 },
  username: { fontSize: 13, fontWeight: 500, color: C.text, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  menu: { position: "absolute", top: "calc(100% + 8px)", right: 0, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", minWidth: 160, display: "flex", flexDirection: "column", padding: 4, zIndex: 110 },
  menuItem: { display: "block", padding: "9px 12px", fontSize: 13, color: C.text, textDecoration: "none", borderRadius: 4, textAlign: "left" },
  menuBtn: { background: "none", border: "none", cursor: "pointer", width: "100%" },
  ghostBtn: { background: C.tag, color: C.tagText, border: `1px solid #7aa7c7`, borderRadius: 4, padding: "7px 12px", fontSize: 13, fontWeight: 500, textDecoration: "none", display: "inline-flex", alignItems: "center" },
  mobileSearch: { position: "absolute", top: 0, left: 0, right: 0, height: 60, background: C.surface, display: "flex", alignItems: "center", padding: "0 12px", gap: 8, zIndex: 101 },
  mobileInput: { flex: 1, height: 36, borderRadius: 4, border: `1px solid #babfc4`, background: C.surface, padding: "0 14px", fontSize: 14 },
};
