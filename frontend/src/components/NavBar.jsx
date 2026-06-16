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
          <input style={s.searchInput} placeholder="Search HD Systems…" value={q} onChange={(e) => setQ(e.target.value)} />
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
                <Link to="/new-question" style={s.newBtn}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                  New Post
                </Link>
                <Link to="/ask" style={s.aiBtn}>Ask AI</Link>
                <button style={s.iconBtn} aria-label="Notifications">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                </button>
              </>
            )}
            <div style={s.avatar} title={user.role}>{avatarChar}</div>
            {!isMobile && <span style={s.username}>{user.name || user.email}</span>}
            <button style={s.signOut} onClick={logout}>Sign out</button>
          </>
        ) : (
          <>
            <Link to="/login" style={s.ghostBtn}>Sign in</Link>
            <Link to="/register" style={s.newBtn}>Sign up</Link>
          </>
        )}
      </div>

      {isMobile && searchOpen && (
        <form onSubmit={submit} style={s.mobileSearch}>
          <input autoFocus style={s.mobileInput} placeholder="Search HD Systems…" value={q} onChange={(e) => setQ(e.target.value)} />
          <button type="button" style={s.iconBtn} onClick={() => setSearchOpen(false)} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </form>
      )}
    </nav>
  );
}

const s = {
  nav: { position: "fixed", top: 0, left: 0, right: 0, height: 60, background: C.surface, borderBottom: "1px solid " + C.border, display: "flex", alignItems: "center", padding: "0 16px", gap: 14, zIndex: 100 },
  searchForm: { flex: 1, maxWidth: 520, position: "relative", display: "flex", alignItems: "center" },
  searchIcon: { position: "absolute", left: 12, display: "flex" },
  searchInput: { width: "100%", height: 38, borderRadius: 8, border: "1px solid " + C.border, background: C.bg, padding: "0 14px 0 36px", fontSize: 14, boxSizing: "border-box" },
  right: { display: "flex", alignItems: "center", gap: 8, marginLeft: "auto", flexShrink: 0 },
  iconBtn: { background: "none", border: "none", padding: 7, borderRadius: "50%", display: "flex" },
  newBtn: { background: C.primary, color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5 },
  aiBtn: { background: C.ai, color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center" },
  avatar: { width: 34, height: 34, borderRadius: "50%", background: C.primary, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0 },
  username: { fontSize: 14, fontWeight: 600, color: C.text, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  ghostBtn: { background: "none", color: C.primary, border: "1px solid " + C.border, borderRadius: 8, padding: "7px 14px", fontSize: 13, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center" },
  signOut: { background: "none", color: C.muted, border: "1px solid " + C.border, borderRadius: 8, padding: "7px 12px", fontSize: 13, fontWeight: 600 },
  mobileSearch: { position: "absolute", top: 0, left: 0, right: 0, height: 60, background: C.surface, display: "flex", alignItems: "center", padding: "0 12px", gap: 8, zIndex: 101 },
  mobileInput: { flex: 1, height: 38, borderRadius: 8, border: "1px solid " + C.border, background: C.bg, padding: "0 14px", fontSize: 14 },
};
