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
  const views = article.views || 0;
  const answers = article.answer_count || 0;
  const tags = tagsFor(article);
  const author = article.author || (article.user_name ? article.user_name : "HD Systems");
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
    } catch (e) {
      // ignore — server is source of truth
    } finally {
      setBusy(false);
    }
  };

  const voteColor = v > 0 ? C.primary : v < 0 ? C.red : C.muted;

  return (
    <div
      style={{
        ...s.card,
        borderLeft: hover ? `3px solid ${C.primary}` : "3px solid transparent",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Stats column */}
      <div style={s.stats}>
        <div style={s.statRow}>
          <button style={s.voteBtn} onClick={() => vote("up")} aria-label="Upvote" disabled={busy}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
          </button>
          <span style={{ ...s.statNum, color: voteColor }}>{v}</span>
          <button style={s.voteBtn} onClick={() => vote("down")} aria-label="Downvote" disabled={busy}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
          </button>
          <span style={s.statLabel}>votes</span>
        </div>

        <div style={s.statRow}>
          <span style={{ ...s.statNum, color: C.muted }}>{views}</span>
          <span style={s.statLabel}>views</span>
        </div>

        <div
          style={{
            ...s.answerBox,
            ...(answers > 0
              ? { background: C.accepted, color: "#fff", border: `1px solid ${C.accepted}` }
              : { background: "transparent", color: C.muted, border: `1px solid ${C.divider}` }),
          }}
        >
          <span style={s.answerNum}>{answers}</span>
          <span style={s.answerLabel}>answers</span>
        </div>
      </div>

      {/* Content column */}
      <div style={s.body}>
        <Link
          to={link}
          style={{ ...s.title, color: hover ? C.primaryHover : C.primary }}
        >
          {article.title}
        </Link>

        {tags.length > 0 && (
          <div style={s.tags}>
            {tags.map((t) => (
              <span key={t} style={s.tag}>{String(t).replace(/^#/, "")}</span>
            ))}
          </div>
        )}

        <div style={s.metaRow}>
          asked {timeAgo(article.created_at)} by <strong style={s.author}>{author}</strong>
        </div>
      </div>
    </div>
  );
}

const s = {
  card: { background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "12px 16px", display: "flex", gap: 16 },
  stats: { width: 90, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, fontSize: 13 },
  statRow: { display: "flex", flexDirection: "column", alignItems: "center", gap: 1 },
  voteBtn: { background: "none", border: "none", padding: 1, display: "flex", cursor: "pointer" },
  statNum: { fontSize: 15, fontWeight: 600, lineHeight: 1.1 },
  statLabel: { fontSize: 12, color: C.muted },
  answerBox: { display: "flex", flexDirection: "column", alignItems: "center", borderRadius: 3, padding: "3px 6px", minWidth: 52 },
  answerNum: { fontSize: 14, fontWeight: 600, lineHeight: 1.1 },
  answerLabel: { fontSize: 11 },
  body: { flex: 1, minWidth: 0 },
  title: { display: "block", fontSize: 17, fontWeight: 600, textDecoration: "none", lineHeight: 1.35, marginBottom: 8 },
  tags: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 },
  tag: { background: C.tag, color: C.tagText, border: `1px solid #a4c2d9`, borderRadius: 3, padding: "2px 8px", fontSize: 12 },
  metaRow: { textAlign: "right", fontSize: 12, color: C.muted },
  author: { color: C.primary, fontWeight: 600 },
};
