import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/client";
import { C, timeAgo } from "../theme";

function ChevronIcon({ open }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
      <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function AccordionItem({ article }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ borderBottom: `1px solid ${C.border}` }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 12, padding: "14px 16px", background: "none", border: "none", cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 600, color: C.text, lineHeight: 1.4 }}>
          {article.title}
        </span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${C.border}`, background: "#fafafa" }}>
          <div style={{
            fontSize: 14, color: C.text, lineHeight: 1.75,
            whiteSpace: "pre-wrap", paddingTop: 12,
          }}>
            {article.content}
          </div>
          {article.tags?.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
              {article.tags.map((t, i) => (
                <span key={`${t}-${i}`} style={{
                  background: C.tag, color: C.tagText, border: `1px solid ${C.tagBorder}`,
                  borderRadius: 6, padding: "2px 9px", fontSize: 12, fontWeight: 500,
                }}>
                  {t}
                </span>
              ))}
            </div>
          )}
          <div style={{ fontSize: 12, color: C.light, marginTop: 10 }}>
            {article.views > 0 && <span>{article.views} views · </span>}
            Added {timeAgo(article.created_at)}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const [params] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(params.get("topic") || "");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    api.get("/kb/")
      .then(r => setArticles(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Build sorted category list
  const categories = useMemo(() => {
    const cats = new Set(articles.map(a => a.category).filter(Boolean));
    return ["All", ...Array.from(cats).sort()];
  }, [articles]);

  // Filter by search + category
  const filtered = useMemo(() => {
    let list = articles;
    if (activeCategory !== "All") {
      list = list.filter(a => a.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a =>
        a.title?.toLowerCase().includes(q) ||
        a.content?.toLowerCase().includes(q) ||
        a.tags?.some(t => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [articles, search, activeCategory]);

  // Group by category
  const grouped = useMemo(() => {
    if (activeCategory !== "All") {
      return { [activeCategory]: filtered };
    }
    const map = {};
    filtered.forEach(a => {
      const cat = a.category || "General";
      if (!map[cat]) map[cat] = [];
      map[cat].push(a);
    });
    return map;
  }, [filtered, activeCategory]);

  const totalCount = filtered.length;

  return (
    <div>
      {/* Page header */}
      <div style={s.header}>
        <h1 style={s.title}>Frequently Asked Questions</h1>
        <p style={s.subtitle}>
          {articles.length} answers across {categories.length - 1} topics — find quick answers to common tech questions.
        </p>
      </div>

      {/* Search */}
      <div style={s.searchWrap}>
        <SearchIcon />
        <input
          style={s.searchInput}
          placeholder="Search FAQs… (e.g. 'Kubernetes', 'password reset', 'Python')"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button onClick={() => setSearch("")} style={s.clearBtn}>✕</button>
        )}
      </div>

      {/* Category tabs — scrollable on mobile */}
      <div style={s.tabsScroll}>
        <div style={s.tabs}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{ ...s.tab, ...(activeCategory === cat ? s.tabActive : {}) }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading && <div style={s.loading}>Loading FAQs…</div>}

      {!loading && totalCount === 0 && (
        <div style={s.empty}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
          <div style={{ fontWeight: 700, fontSize: 16, color: C.muted }}>No results found</div>
          <div style={{ fontSize: 14, color: C.light, marginTop: 4 }}>
            Try a different search term or category.
          </div>
        </div>
      )}

      {/* Grouped accordion sections */}
      {!loading && Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([cat, items]) => (
        <div key={cat} style={s.section}>
          <div style={s.sectionHeader}>
            <span style={s.sectionTitle}>{cat}</span>
            <span style={s.sectionCount}>{items.length} {items.length === 1 ? "answer" : "answers"}</span>
          </div>
          <div style={s.accordion}>
            {items.map(a => <AccordionItem key={a.id} article={a} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

const s = {
  header: {
    background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12,
    padding: "24px 20px", marginBottom: 14,
  },
  title: { fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 6px", letterSpacing: -0.4 },
  subtitle: { fontSize: 14, color: C.muted, margin: 0 },

  searchWrap: {
    position: "relative", marginBottom: 12,
  },
  searchInput: {
    width: "100%", height: 46, borderRadius: 10, border: `1px solid ${C.border}`,
    background: C.surface, padding: "0 40px 0 40px", fontSize: 15,
    outline: "none", boxSizing: "border-box", color: C.text,
  },
  clearBtn: {
    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
    background: "none", border: "none", cursor: "pointer", color: C.muted,
    fontSize: 16, padding: 4,
  },

  tabsScroll: { overflowX: "auto", marginBottom: 14, WebkitOverflowScrolling: "touch" },
  tabs: { display: "flex", gap: 7, padding: "2px 0", minWidth: "max-content" },
  tab: {
    padding: "7px 15px", borderRadius: 20, border: `1px solid ${C.border}`,
    background: C.surface, color: C.muted, fontSize: 13, fontWeight: 500,
    cursor: "pointer", whiteSpace: "nowrap", minHeight: 34,
  },
  tabActive: {
    background: C.primary, color: "#fff", border: `1px solid ${C.primary}`, fontWeight: 600,
  },

  loading: { textAlign: "center", color: C.light, padding: 48 },
  empty: {
    textAlign: "center", padding: 48, background: C.surface,
    border: `1px solid ${C.border}`, borderRadius: 12,
  },

  section: { marginBottom: 14 },
  sectionHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "10px 16px", background: C.surfaceHover, borderRadius: "12px 12px 0 0",
    border: `1px solid ${C.border}`, borderBottom: "none",
  },
  sectionTitle: { fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: 0.5, textTransform: "uppercase" },
  sectionCount: { fontSize: 12, color: C.light, fontWeight: 600 },
  accordion: {
    background: C.surface, border: `1px solid ${C.border}`,
    borderTop: "none", borderRadius: "0 0 12px 12px",
  },
};
