import { useState } from "react";
import { Link } from "react-router-dom";
import { C, TYPE_BADGE, deriveType, communityFor, timeAgo } from "../theme";

const TAG_POOL = ["javascript", "python", "devops", "kubernetes", "security", "rust", "react", "systemdesign"];

function tagsFor(article) {
  if (Array.isArray(article.tags) && article.tags.length) return article.tags.slice(0, 4);
  const seed = (article.id ?? 0) % TAG_POOL.length;
  return [TAG_POOL[seed], TAG_POOL[(seed + 3) % TAG_POOL.length]];
}

export default function PostCard({ article, vote, onVote }) {
  const [hover, setHover] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const v = vote || { up: false, down: false, count: 1 };
  const type = deriveType(article.category);
  const badge = TYPE_BADGE[type];
  const community = communityFor(article);
  const tags = tagsFor(article);
  const excerpt = (article.content || "").replace(/\s+/g, " ").slice(0, 180);
  const link = `/question/${article.id}`;

  const share = () => {
    navigator.clipboard.writeText(`${window.location.origin}${link}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      style={{ ...s.card, borderLeft: hover ? `3px solid ${C.primary}` : "1px solid " + C.border }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Vote column */}
      <div style={s.voteCol}>
        <button style={s.voteBtn} onClick={() => onVote(article.id, "up")} aria-label="Upvote">
          <svg width="18" height="18" viewBox="0 0 24 24" fill={v.up ? C.accent : "none"} stroke={v.up ? C.accent : C.light} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
        <span style={{ ...s.voteCount, color: v.up ? C.accent : v.down ? "#5a8dee" : C.text }}>{v.count}</span>
        <button style={s.voteBtn} onClick={() => onVote(article.id, "down")} aria-label="Downvote">
          <svg width="18" height="18" viewBox="0 0 24 24" fill={v.down ? "#5a8dee" : "none"} stroke={v.down ? "#5a8dee" : C.light} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div style={s.body}>
        <div style={s.meta}>
          <span style={{ ...s.typeBadge, background: badge.bg, color: badge.color }}>{type}</span>
          <span style={s.community}>r/{community.replace(/[^a-zA-Z]/g, "")}</span>
          <span style={s.dim}>• u/HDS Bot • {timeAgo(article.created_at)}</span>
        </div>

        <Link to={link} style={s.title}>{article.title}</Link>

        <div style={s.tags}>
          {tags.map((t) => (
            <span key={t} style={s.tag}>#{String(t).replace(/^#/, "")}</span>
          ))}
        </div>

        {excerpt && <div style={s.excerpt}>{excerpt}{(article.content || "").length > 180 ? "…" : ""}</div>}

        <div style={s.actions}>
          <Link to={link} style={s.actionBtn}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            {(article.id % 30) + 2} comments
          </Link>
          <button style={s.actionBtn} onClick={share}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
            {copied ? "Copied!" : "Share"}
          </button>
          <button style={{ ...s.actionBtn, color: saved ? C.primary : C.muted }} onClick={() => setSaved((x) => !x)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill={saved ? C.primary : "none"} stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
            {saved ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

const s = {
  card: { background: C.surface, border: "1px solid " + C.border, borderRadius: 8, padding: 12, display: "flex", gap: 10 },
  voteCol: { width: 44, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, flexShrink: 0 },
  voteBtn: { background: "none", border: "none", padding: 2, display: "flex", borderRadius: 4 },
  voteCount: { fontSize: 13, fontWeight: 700 },
  body: { flex: 1, minWidth: 0 },
  meta: { display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", fontSize: 12, marginBottom: 6 },
  typeBadge: { fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4 },
  community: { fontWeight: 700, color: C.text, fontSize: 12 },
  dim: { color: C.light, fontSize: 12 },
  title: { display: "block", fontSize: 17, fontWeight: 700, color: C.text, lineHeight: 1.3, marginBottom: 6 },
  tags: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 },
  tag: { background: C.tagBg, color: C.tagText, fontSize: 12, fontWeight: 500, padding: "2px 8px", borderRadius: 4 },
  excerpt: { fontSize: 13, color: C.muted, lineHeight: 1.5, marginBottom: 8, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" },
  actions: { display: "flex", gap: 4, flexWrap: "wrap" },
  actionBtn: { background: "none", border: "none", display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: C.muted, padding: "5px 8px", borderRadius: 4, textDecoration: "none" },
};
