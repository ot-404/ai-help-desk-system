import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votes, setVotes] = useState({});   // { id: { up: bool, down: bool, count: number } }
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    api.get("/kb/")
      .then(r => {
        const data = r.data || [];
        setArticles(data);
        const init = {};
        data.forEach(a => { init[a.id] = { up: false, down: false, count: Math.floor(Math.random() * 40) + 1 }; });
        setVotes(init);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleVote = (id, dir) => {
    setVotes(prev => {
      const cur = prev[id] || { up: false, down: false, count: 0 };
      if (dir === "up") {
        const wasUp = cur.up;
        return { ...prev, [id]: { ...cur, up: !wasUp, down: false, count: cur.count + (wasUp ? -1 : 1) } };
      } else {
        const wasDown = cur.down;
        return { ...prev, [id]: { ...cur, down: !wasDown, up: false, count: cur.count + (cur.up ? -1 : 0) } };
      }
    });
  };

  const handleShare = (id) => {
    navigator.clipboard.writeText(`${window.location.origin}/help?article=${id}`).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const avatarChar = user ? (user.name || user.email || "?")[0].toUpperCase() : "?";

  return (
    <div style={s.page}>
      {/* Ask box */}
      <div style={s.askBox} onClick={() => navigate("/ask")}>
        <div style={s.askAvatar}>
          {user ? avatarChar : "?"}
        </div>
        <div style={s.askPlaceholder}>What do you want to know?</div>
      </div>

      {loading && <div style={s.loading}>Loading...</div>}

      {!loading && articles.length === 0 && (
        <div style={s.emptyState}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <div style={s.emptyTitle}>No questions answered yet</div>
          <Link to="/ask" style={s.emptyLink}>Ask the first question →</Link>
        </div>
      )}

      <div style={s.feed}>
        {articles.map(article => {
          const v = votes[article.id] || { up: false, down: false, count: 1 };
          const preview = (article.content || "").slice(0, 300);
          const hasMore = (article.content || "").length > 300;
          return (
            <div key={article.id} style={s.card}>
              {/* Author row */}
              <div style={s.authorRow}>
                <div style={s.aiAvatar}>AI</div>
                <div>
                  <span style={s.authorName}>AI Help Desk</span>
                  <span style={s.dot}>·</span>
                  <span style={s.credential}>AI Support Bot</span>
                  <div style={s.meta}>
                    Answered · {article.created_at ? timeAgo(article.created_at) : "recently"}
                  </div>
                </div>
                <button style={s.followBtn}>Follow</button>
              </div>

              {/* Question title */}
              <Link to={`/help?article=${article.id}`} style={s.qTitle}>
                {article.title}
              </Link>

              {/* Answer preview */}
              <div style={s.answerText}>
                {preview}{hasMore && (
                  <Link to={`/help?article=${article.id}`} style={s.moreLink}> (more)</Link>
                )}
              </div>

              {/* Engagement row */}
              <div style={s.engagRow}>
                <div style={s.votePair}>
                  <button
                    style={{ ...s.voteBtn, color: v.up ? "#16c784" : "#555" }}
                    onClick={() => toggleVote(article.id, "up")}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={v.up ? "#16c784" : "none"} stroke="currentColor" strokeWidth="2">
                      <polyline points="18 15 12 9 6 15"/>
                    </svg>
                    <span style={{ fontWeight: v.up ? 700 : 400 }}>{v.count}</span>
                  </button>
                  <button
                    style={{ ...s.voteBtn, color: v.down ? "#e53e3e" : "#555" }}
                    onClick={() => toggleVote(article.id, "down")}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={v.down ? "#e53e3e" : "none"} stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                </div>

                <Link to={`/help?article=${article.id}`} style={s.engagBtn}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  Comment
                </Link>

                <button style={s.engagBtn} onClick={() => handleShare(article.id)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                  </svg>
                  {copied === article.id ? "Copied!" : "Share"}
                </button>

                <Link to={`/help?article=${article.id}`} style={{ ...s.engagBtn, marginLeft: "auto" }}>···</Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const s = {
  page: { display: "flex", flexDirection: "column", gap: 12 },
  askBox: {
    background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8,
    padding: "12px 16px", display: "flex", alignItems: "center",
    gap: 12, cursor: "pointer",
  },
  askAvatar: {
    width: 36, height: 36, borderRadius: "50%", background: "#16c784",
    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: 15, flexShrink: 0,
  },
  askPlaceholder: {
    fontSize: 15, color: "#aaa", flex: 1,
  },
  loading: { textAlign: "center", color: "#aaa", padding: 32 },
  emptyState: {
    display: "flex", flexDirection: "column", alignItems: "center",
    gap: 12, padding: 48, color: "#aaa",
  },
  emptyTitle: { fontSize: 18, fontWeight: 600, color: "#888" },
  emptyLink: { color: "#16c784", textDecoration: "none", fontSize: 15 },
  feed: { display: "flex", flexDirection: "column", gap: 12 },
  card: {
    background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8,
    padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10,
  },
  authorRow: {
    display: "flex", alignItems: "flex-start", gap: 10,
  },
  aiAvatar: {
    width: 36, height: 36, borderRadius: "50%", background: "#16c784",
    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: 13, flexShrink: 0,
  },
  authorName: { fontWeight: 600, fontSize: 14, color: "#111" },
  dot: { margin: "0 4px", color: "#aaa" },
  credential: { fontSize: 13, color: "#888" },
  meta: { fontSize: 12, color: "#aaa", marginTop: 2 },
  followBtn: {
    marginLeft: "auto", background: "none", border: "1px solid #ccc",
    borderRadius: 16, padding: "4px 14px", fontSize: 13,
    cursor: "pointer", color: "#555", fontWeight: 500,
  },
  qTitle: {
    fontSize: 18, fontWeight: 700, color: "#111", textDecoration: "none",
    lineHeight: 1.3,
  },
  answerText: { fontSize: 14, color: "#444", lineHeight: 1.6 },
  moreLink: { color: "#16c784", textDecoration: "none", fontWeight: 500 },
  engagRow: {
    borderTop: "1px solid #f0f0f0", paddingTop: 10,
    display: "flex", alignItems: "center", gap: 4,
  },
  votePair: { display: "flex", alignItems: "center", gap: 0 },
  voteBtn: {
    background: "none", border: "none", cursor: "pointer",
    display: "flex", alignItems: "center", gap: 4,
    fontSize: 13, padding: "4px 8px", borderRadius: 16,
  },
  engagBtn: {
    background: "none", border: "none", cursor: "pointer",
    display: "flex", alignItems: "center", gap: 5,
    fontSize: 13, color: "#555", padding: "4px 10px",
    borderRadius: 16, textDecoration: "none",
  },
};
