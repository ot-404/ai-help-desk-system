import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useIsMobile } from "../hooks/useIsMobile";
import ProfileMenu from "./ProfileMenu";
import { C } from "../theme";

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

  const Logo = (
    <Link to="/" style={s.logo}>
      <span style={s.logoBadge}>Ask</span>
      {!isMobile && <span style={s.logoText}>ora</span>}
    </Link>
  );

  return (
    <nav style={s.nav}>
      {Logo}

      {!isMobile && (
        <form onSubmit={submit} style={s.searchForm}>
          <span style={s.searchIcon}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={C.light} strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          </span>
          <input style={s.searchInput} placeholder="Search anything…" value={q} onChange={(e) => setQ(e.target.value)} />
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
            {!isMobile && (
              <Link to="/new-question" style={s.createBtn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                Create
              </Link>
            )}
            <ProfileMenu user={user} logout={logout} />
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
          <input autoFocus style={s.mobileInput} placeholder="Search anything…" value={q} onChange={(e) => setQ(e.target.value)} />
          <button type="button" style={s.iconBtn} onClick={() => setSearchOpen(false)} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.navText} strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </form>
      )}
    </nav>
  );
}

const s = {
  nav: { position: "fixed", top: 0, left: 0, right: 0, height: 52, background: C.nav, borderBottom: `1px solid ${C.navBorder}`, display: "flex", alignItems: "center", padding: "0 16px", gap: 16, zIndex: 100 },
  logo: { textDecoration: "none", flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 7 },
  logoBadge: { background: C.gradient, color: "#fff", fontWeight: 800, borderRadius: 7, padding: "4px 8px", fontSize: 14, letterSpacing: 0.3 },
  logoText: { color: C.text, fontWeight: 700, fontSize: 17, letterSpacing: -0.2 },
  searchForm: { flex: 1, maxWidth: 560, position: "relative", display: "flex", alignItems: "center" },
  searchIcon: { position: "absolute", left: 13, display: "flex", pointerEvents: "none" },
  searchInput: { width: "100%", height: 38, borderRadius: 10, border: `1px solid ${C.border}`, background: C.surfaceHover, padding: "0 12px 0 38px", fontSize: 14, boxSizing: "border-box", color: C.text, outline: "none" },
  right: { display: "flex", alignItems: "center", gap: 10, marginLeft: "auto", flexShrink: 0 },
  iconBtn: { background: "none", border: "none", padding: 8, borderRadius: 8, display: "flex", cursor: "pointer", minHeight: 44, minWidth: 44, alignItems: "center", justifyContent: "center" },
  createBtn: { background: C.gradient, color: "#fff", border: "none", borderRadius: 10, padding: "8px 16px", fontSize: 14, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" },
  avatar: { width: 32, height: 32, borderRadius: "50%", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0 },
  signOut: { background: "none", border: "none", color: C.muted, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" },
  loginBtn: { border: `1px solid ${C.border}`, color: C.navText, borderRadius: 10, padding: "8px 16px", fontSize: 14, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", whiteSpace: "nowrap" },
  signupBtn: { background: C.gradient, color: "#fff", borderRadius: 10, padding: "8px 16px", fontSize: 14, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", whiteSpace: "nowrap" },
  mobileSearch: { position: "absolute", top: 0, left: 0, right: 0, height: 52, background: C.nav, display: "flex", alignItems: "center", padding: "0 12px", gap: 8, zIndex: 101, borderBottom: `1px solid ${C.navBorder}` },
  mobileInput: { flex: 1, height: 38, borderRadius: 10, border: `1px solid ${C.border}`, background: C.surfaceHover, padding: "0 14px", fontSize: 16, boxSizing: "border-box", color: C.text, outline: "none" },
};
