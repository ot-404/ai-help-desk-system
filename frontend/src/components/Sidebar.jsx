import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useIsMobile } from "../hooks/useIsMobile";
import { C } from "../theme";
import api from "../api/client";

const DEV_RESOURCES = [
  { label: "MDN Web Docs",    url: "https://developer.mozilla.org", emoji: "📖" },
  { label: "DevDocs",         url: "https://devdocs.io",            emoji: "🔍" },
  { label: "GitHub",          url: "https://github.com",            emoji: "🐙" },
  { label: "Stack Overflow",  url: "https://stackoverflow.com",     emoji: "💬" },
  { label: "Regex101",        url: "https://regex101.com",          emoji: "🔣" },
  { label: "roadmap.sh",      url: "https://roadmap.sh",            emoji: "🗺️" },
  { label: "Can I Use",       url: "https://caniuse.com",           emoji: "🌐" },
  { label: "DevHints",        url: "https://devhints.io",           emoji: "📝" },
];

function Icon({ name }) {
  const p = (d) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {[].concat(d).map((x, i) => <path key={i} d={x} />)}
    </svg>
  );
  switch (name) {
    case "home":    return p(["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "M9 22V12h6v10"]);
    case "flame":   return p(["M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"]);
    case "book":    return p(["M4 19.5A2.5 2.5 0 0 1 6.5 17H20", "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"]);
    case "sparkle": return p(["M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z", "M19 15l.7 1.8L21.5 18l-1.8.7L19 21l-.7-1.8L16.5 18l1.8-.7z"]);
    case "dash":    return p(["M3 3h7v9H3z", "M14 3h7v5h-7z", "M14 12h7v9h-7z", "M3 16h7v5H3z"]);
    case "users":   return p(["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"]);
    case "kb":      return p(["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6", "M9 13h6", "M9 17h6"]);
    case "faq":     return p(["M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", "M12 17h.01"]);
    default: return null;
  }
}

function Item({ to, label, icon, end }) {
  const location = useLocation();
  const [toPath, toSearch] = to.split("?");

  return (
    <NavLink to={to} end={end} style={({ isActive }) => {
      const active = toSearch
        ? location.pathname === toPath && location.search === `?${toSearch}`
        : isActive;
      return {
        ...st.link,
        color: active ? C.primary : C.text,
        fontWeight: active ? 700 : 500,
        background: active ? "#ff45001a" : "transparent",
      };
    }}>
      {icon && <Icon name={icon} />}
      <span>{label}</span>
    </NavLink>
  );
}

function Group({ title }) {
  return <div style={st.group}>{title}</div>;
}

function ExternalLink({ emoji, label, url }) {
  return (
    <a href={url} target="_blank" rel="noreferrer" style={st.extLink}>
      <span style={st.extEmoji}>{emoji}</span>
      <span style={st.extLabel}>{label}</span>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={C.light} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginLeft: "auto" }}>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    </a>
  );
}

function TrendingTags() {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    api.get("/tickets/feed")
      .then(({ data }) => {
        const counts = {};
        (data || []).forEach((t) => {
          const raw = t.description || "";
          const match = raw.match(/^Tags:\s*(.+)/m);
          if (match) {
            match[1].split(",").forEach((tag) => {
              const k = tag.trim().replace(/^#/, "").toLowerCase();
              if (k) counts[k] = (counts[k] || 0) + 1;
            });
          }
        });
        const sorted = Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 12)
          .map(([tag]) => tag);
        setTags(sorted);
      })
      .catch(() => {});
  }, []);

  if (!tags.length) return null;

  return (
    <div style={st.tagCloud}>
      {tags.map((t) => (
        <span key={t} style={st.tagChip}>#{t}</span>
      ))}
    </div>
  );
}

export default function Sidebar() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  if (isMobile) return null;

  const isStaff = user?.role === "admin" || user?.role === "agent";

  return (
    <aside style={st.sidebar}>
      <nav style={st.nav}>
        <Item to="/" label="Home" icon="home" end />
        <Item to="/help" label="Popular" icon="flame" />

        <Group title="Resources" />
        <Item to="/faq" label="FAQs" icon="faq" />
        <Item to="/ask" label="Ask AI" icon="sparkle" />

        <Group title="Dev Resources" />
        {DEV_RESOURCES.map((r) => (
          <ExternalLink key={r.url} {...r} />
        ))}

        <Group title="Trending Tags" />
        <TrendingTags />

        {isStaff && (
          <>
            <Group title="Backend" />
            <Item to="/admin" label="Dashboard" icon="dash" end />
            <Item to="/admin/users" label="Users" icon="users" />
            <Item to="/admin/kb" label="KB Manager" icon="kb" />
            <Item to="/help" label="Knowledge Base" icon="book" />
          </>
        )}
      </nav>
      <div style={st.footer}>HD Systems · Tech Community</div>
    </aside>
  );
}

const st = {
  sidebar: { width: 270, flexShrink: 0, position: "sticky", top: 68, alignSelf: "flex-start", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: "8px 8px 0", maxHeight: "calc(100vh - 80px)", overflowY: "auto" },
  nav: { display: "flex", flexDirection: "column", gap: 2 },
  link: { display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 4, fontSize: 14, textDecoration: "none" },
  group: { fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: 1, textTransform: "uppercase", padding: "12px 12px 4px" },
  footer: { fontSize: 11, color: C.light, padding: "12px", borderTop: `1px solid ${C.divider}`, marginTop: 8 },

  extLink: { display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 4, fontSize: 13, textDecoration: "none", color: C.text, fontWeight: 500 },
  extEmoji: { fontSize: 14, flexShrink: 0, width: 20, textAlign: "center" },
  extLabel: { flex: 1, minWidth: 0 },

  tagCloud: { display: "flex", flexWrap: "wrap", gap: 6, padding: "4px 12px 12px" },
  tagChip: { background: C.tag, color: C.tagText, border: `1px solid ${C.tagBorder}`, borderRadius: 2, padding: "2px 7px", fontSize: 11, fontWeight: 600, cursor: "default" },
};
