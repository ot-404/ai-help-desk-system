import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { C, timeAgo, deriveType, TYPE_BADGE } from "../theme";

function tagsFor(article) {
  if (Array.isArray(article.tags) && article.tags.length) return article.tags.slice(0, 5);
  return [];
}

export default function PostCard({ article, onVoteSuccess }) {
  const [hover, setHover] = useState(false);
  const [busy, setBusy] = useState(false);
  const [dir, setDir] = useState(0);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const v = article.vote_count || 0;
  const answers = article.answer_count || 0;
  const tags = tagsFor(article);
  const isAnon = !!article.is_anonymous;
  const author = isAnon ? "u/anonymous" : (article.author || article.user_name || "HD Systems");
  const link = `/question/${article.id}`;
  const type = deriveType(article);
  const badge = TYPE_BADGE[type] || TYPE_BADGE.Question;
  const topic = article.topic || article.category || "Programming";

  const vote = async (direction) => {
    if (busy) return;
    setBusy(true);
    setDir(direction === "up" ? 1 : -1);
    try {
      const res = await api.post(`/kb/${article.id}/vote`, { direction });
      const newCount = res.data?.vote_count;
      if (typeof newCount === "number" && onVoteSuccess) {
        onVoteSuccess({ ...article, vote_count: newCount });
      }
    } catch {
      // server is source of truth
    } finally {
      setBusy(false);
    }
  };

  const share = () => {
    try { navigator.clipboard.writeText(window.location.origin + link); } catch { /* ignore */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const countColor = dir > 0 ? C.primary : dir < 0 ? C.blue : C.muted;
  const excerpt = article.excerpt || article.summary || article.content || article.description || "";

  return (
    <div
      style={{ ...s.card, borderColor: hover ? "#818384" : C.border }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={s.voteCol}>
        <button style={s.voteBtn} onClick={() => vote("up")} aria-label="Upvote" disabled={busy}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={dir > 0 ? C.primary : C.muted} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
        </button>
        <span style={{ ...s.voteNum, color: countColor }}>{v}</span>
        <button style={s.voteBtn} onClick={() => vote("down")} aria-label="Downvote" disabled={busy}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={dir < 0 ? C.blue : C.muted} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
        </button>
      </div>

      <div style={s.body}>
        <div style={s.metaRow}>
          <span style={{ ...s.typeBadge, background: badge.bg, color: badge.color }}>
            {type === "Anonymous Ask" && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: 3 }}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            )}
            {type}
          </span>
          <span style={s.topicChip}>{topic}</span>
          <span style={s.meta}>• Posted by <span style={isAnon ? s.anon : undefined}>{author}</span> • {timeAgo(article.created_at)}</span>
        </div>

        <Link to={link} style={s.title}>{article.title}</Link>

        {tags.length > 0 && (
          <div style={s.tagsRow}>
            {tags.map((t) => <span key={t} style={s.tag}>{String(t).replace(/^#/, "")}</span>)}
          </div>
        )}

        {excerpt && <div style={s.excerpt}>{excerpt}</div>}

        <div style={s.actions}>
          <Link to={link} style={s.actionBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            {answers} Comments
          </Link>
          <button style={s.actionBtn} onClick={share}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
            {copied ? "Copied!" : "Share"}
          </button>
          <button style={{ ...s.actionBtn, color: saved ? C.primary : C.muted }} onClick={() => setSaved((x) => !x)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? C.primary : "none"} stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
            Save
          </button>
          <button style={s.actionBtn}>… More</button>
        </div>
      </div>
    </div>
  );
}

const s = {
  card: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, display: "flex", overflow: "hidden" },
  voteCol: { width: 38, flexShrink: 0, background: "#f8f9fa", borderRadius: "4px 0 0 4px", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 8, gap: 2 },
  voteBtn: { background: "none", border: "none", padding: 0, display: "flex", cursor: "pointer", minHeight: 22, minWidth: 22, alignItems: "center", justifyContent: "center" },
  voteNum: { fontSize: 13, fontWeight: 700, lineHeight: 1.2 },
  body: { flex: 1, minWidth: 0, padding: 8 },
  metaRow: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, marginBottom: 6, fontSize: 12 },
  typeBadge: { display: "inline-flex", alignItems: "center", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10 },
  topicChip: { background: C.tag, color: C.muted, borderRadius: 10, padding: "2px 8px", fontSize: 12, fontWeight: 600, cursor: "pointer" },
  meta: { fontSize: 12, color: C.muted },
  anon: { fontStyle: "italic", color: C.anon },
  title: { display: "block", fontSize: 18, fontWeight: 500, color: C.text, textDecoration: "none", lineHeight: 1.3, margin: "2px 0" },
  tagsRow: { display: "flex", flexWrap: "wrap", gap: 6, margin: "6px 0" },
  tag: { background: C.tag, color: C.tagText, borderRadius: 2, padding: "2px 8px", fontSize: 12 },
  excerpt: { fontSize: 14, color: C.muted, margin: "4px 0 8px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: 1.4 },
  actions: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2, marginTop: 4 },
  actionBtn: { display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: C.muted, fontSize: 12, fontWeight: 700, padding: "6px 8px", borderRadius: 2, cursor: "pointer", textDecoration: "none" },
};
