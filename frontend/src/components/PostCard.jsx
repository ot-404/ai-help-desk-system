import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { C, timeAgo } from "../theme";

function tagsFor(article) {
  if (Array.isArray(article.tags) && article.tags.length) return article.tags.slice(0, 5);
  return [];
}

export default function PostCard({ article, onVoteSuccess }) {
  const [hover, setHover] = useState(false);
  const [busy, setBusy] = useState(false);

  const v = article.vote_count || 0;
  const answers = article.answer_count || 0;
  const tags = tagsFor(article);
  const author = article.author || article.user_name || "HD Systems";
  const link = `/question/${article.id}`;

  const vote = async (direction) => {
    if (busy) return;
    setBusy(true);
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

  const voteColor = v > 0 ? C.primary : v < 0 ? C.danger : C.muted;
  const excerpt = article.excerpt || article.summary || article.content || article.description || "";

  return (
    <div
      style={{ ...s.card, borderColor: hover ? C.primary : C.border }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={s.voteCol}>
        <button style={s.voteBtn} onClick={() => vote("up")} aria-label="Upvote" disabled={busy}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
        </button>
        <span style={{ ...s.voteNum, color: voteColor }}>{v}</span>
        <button style={s.voteBtn} onClick={() => vote("down")} aria-label="Downvote" disabled={busy}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
        </button>
        {answers > 0 && <span style={s.ans}>{answers} ans</span>}
      </div>

      <div style={s.body}>
        <Link to={link} style={s.title}>{article.title}</Link>
        {excerpt && <div style={s.excerpt}>{excerpt}</div>}
        <div style={s.metaRow}>
          {tags.map((t) => (
            <span key={t} style={s.tag}>{String(t).replace(/^#/, "")}</span>
          ))}
          <span style={s.meta}>• asked {timeAgo(article.created_at)} by {author}</span>
        </div>
      </div>
    </div>
  );
}

const s = {
  card: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "14px 16px", display: "flex", gap: 14 },
  voteCol: { width: 56, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 },
  voteBtn: { background: "none", border: "none", padding: 2, display: "flex", cursor: "pointer" },
  voteNum: { fontSize: 14, fontWeight: 700, lineHeight: 1.2 },
  ans: { fontSize: 11, color: C.success, fontWeight: 600, marginTop: 4 },
  body: { flex: 1, minWidth: 0 },
  title: { display: "block", fontSize: 16, fontWeight: 600, color: C.primary, textDecoration: "none", lineHeight: 1.4 },
  excerpt: { fontSize: 13, color: C.muted, margin: "4px 0 8px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" },
  metaRow: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, marginTop: 6 },
  tag: { background: C.tag, color: C.tagText, border: `1px solid ${C.tagBorder}`, borderRadius: 4, padding: "1px 6px", fontSize: 12 },
  meta: { fontSize: 12, color: C.light },
};
