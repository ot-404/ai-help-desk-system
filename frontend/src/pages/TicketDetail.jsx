import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const STATUS_COLOR = { open: "#f59e0b", pending: "#3b82f6", resolved: "#16c784", closed: "#939598" };
const PRI_COLOR = { low: "#939598", medium: "#3b82f6", high: "#f97316", urgent: "#ef4444" };
const STATUSES = ["open", "pending", "resolved", "closed"];

function StarRating({ value, onChange, readonly }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <span
          key={n}
          onMouseEnter={() => !readonly && setHover(n)}
          onMouseLeave={() => !readonly && setHover(0)}
          onClick={() => !readonly && onChange(n)}
          style={{
            fontSize: 28, cursor: readonly ? "default" : "pointer",
            color: n <= (hover || value) ? "#f6c90e" : "#e2e8f0", lineHeight: 1,
          }}
        >★</span>
      ))}
    </div>
  );
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function TicketDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [aiSuggest, setAiSuggest] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [rating, setRating] = useState(0);
  const [rated, setRated] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [msgVotes, setMsgVotes] = useState({});
  const [copiedMsg, setCopiedMsg] = useState(null);
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    Promise.all([
      api.get(`/tickets/${id}`),
      api.get(`/messages/ticket/${id}`),
    ]).then(([t, m]) => {
      setTicket(t.data);
      setMessages(m.data);
      if (t.data.csat_rating) { setRating(t.data.csat_rating); setRated(true); }
    });
  }, [id]);

  async function sendReply(e) {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    try {
      const { data } = await api.post(`/messages/ticket/${id}`, { message: reply });
      setMessages(m => [...m, data]);
      setReply("");
    } finally { setSending(false); }
  }

  async function updateStatus(status) {
    setStatusUpdating(status);
    try {
      const { data } = await api.put(`/tickets/${id}`, { status });
      setTicket(data);
    } finally { setStatusUpdating(false); }
  }

  async function fetchAISuggest() {
    setLoadingAI(true);
    try {
      const { data } = await api.post(`/ai/suggest/${id}`);
      setAiSuggest(data.steps);
    } finally { setLoadingAI(false); }
  }

  async function submitRating(r) {
    setRating(r);
    await api.post(`/tickets/${id}/rate`, { rating: r });
    setRated(true);
  }

  const toggleMsgVote = (msgId, dir) => {
    setMsgVotes(prev => {
      const cur = prev[msgId] || { up: false, down: false, count: 0 };
      if (dir === "up") {
        const wasUp = cur.up;
        return { ...prev, [msgId]: { ...cur, up: !wasUp, down: false, count: cur.count + (wasUp ? -1 : 1) } };
      } else {
        const wasDown = cur.down;
        return { ...prev, [msgId]: { ...cur, down: !wasDown, up: false, count: cur.count + (cur.up ? -1 : 0) } };
      }
    });
  };

  const handleShareMsg = (msgId) => {
    navigator.clipboard.writeText(`${window.location.origin}/question/${id}#msg-${msgId}`).catch(() => {});
    setCopiedMsg(msgId);
    setTimeout(() => setCopiedMsg(null), 2000);
  };

  if (!ticket) return <div style={s.loading}>Loading...</div>;

  const canManage = user.role === "agent" || user.role === "admin";
  const isOwner = ticket.user_id === user.id;
  const isClosedOrResolved = ticket.status === "resolved" || ticket.status === "closed";
  const backLink = canManage ? "/agent" : "/my-questions";

  const sortedMessages = [...messages].sort((a, b) => {
    if (sortBy === "best") {
      const va = msgVotes[a.id]?.count || 0;
      const vb = msgVotes[b.id]?.count || 0;
      return vb - va;
    }
    return new Date(a.created_at) - new Date(b.created_at);
  });

  return (
    <div style={s.page}>
      {/* Question header card */}
      <div style={s.questionCard}>
        <Link to={backLink} style={s.backLink}>← Back to Feed</Link>
        <h1 style={s.qTitle}>{ticket.subject}</h1>

        {/* Asked by row */}
        <div style={s.askedRow}>
          <div style={{ ...s.askerAvatar, background: "#3182ce" }}>
            {(ticket.user_name || "U")[0].toUpperCase()}
          </div>
          <div>
            <span style={s.askerName}>{ticket.user_name || "User"}</span>
            <span style={s.dot}>·</span>
            <span style={s.askedTime}>{ticket.created_at ? timeAgo(ticket.created_at) : "recently"}</span>
          </div>
          <span style={{ ...s.badge, background: PRI_COLOR[ticket.priority] + "22", color: PRI_COLOR[ticket.priority], marginLeft: 8 }}>
            {ticket.priority}
          </span>
          <span style={{ ...s.badge, background: STATUS_COLOR[ticket.status] + "22", color: STATUS_COLOR[ticket.status] }}>
            {ticket.status}
          </span>
        </div>

        {/* Action buttons */}
        <div style={s.qActions}>
          <button style={s.answerBtn} onClick={() => document.getElementById("answer-box")?.scrollIntoView({ behavior: "smooth" })}>
            Answer
          </button>
          <button style={s.ghostBtn}>Follow</button>
          <button style={s.ghostBtn}>Share</button>
          <button style={{ ...s.ghostBtn, marginLeft: "auto" }}>···</button>
        </div>

        {/* Description */}
        {ticket.description && (
          <div style={s.qDescription}>{ticket.description}</div>
        )}
      </div>

      {/* Agent toolbar */}
      {canManage && (
        <div style={s.toolbar}>
          <span style={s.toolLabel}>Status:</span>
          <div style={s.statusBtns}>
            {STATUSES.map(st => (
              <button
                key={st}
                onClick={() => updateStatus(st)}
                disabled={statusUpdating === st || ticket.status === st}
                style={{
                  ...s.stBtn,
                  ...(ticket.status === st ? { background: STATUS_COLOR[st], color: "#fff", borderColor: STATUS_COLOR[st] } : {}),
                }}
              >
                {statusUpdating === st ? "..." : st}
              </button>
            ))}
          </div>
          <button onClick={fetchAISuggest} style={s.aiBtn} disabled={loadingAI}>
            {loadingAI ? "Thinking..." : "AI Suggest"}
          </button>
        </div>
      )}

      {/* AI suggestion */}
      {aiSuggest && (
        <div style={s.aiBox}>
          <div style={s.aiTitle}>AI Resolution Steps</div>
          <pre style={s.aiPre}>{aiSuggest}</pre>
        </div>
      )}

      {/* Answer count + sort */}
      <div style={s.answersHeader}>
        <span style={s.answersCount}>{messages.length} Answer{messages.length !== 1 ? "s" : ""}</span>
        <div style={s.sortRow}>
          <button
            style={{ ...s.sortBtn, ...(sortBy === "best" ? s.sortBtnActive : {}) }}
            onClick={() => setSortBy("best")}
          >Best</button>
          <button
            style={{ ...s.sortBtn, ...(sortBy === "recent" ? s.sortBtnActive : {}) }}
            onClick={() => setSortBy("recent")}
          >Recent</button>
        </div>
      </div>

      {/* Answer cards */}
      <div style={s.answersList}>
        {sortedMessages.length === 0 && (
          <div style={s.noAnswers}>No answers yet. Be the first to answer!</div>
        )}
        {sortedMessages.map(m => {
          const isAI = m.ai_generated || m.sender_role === "ai";
          const isAgent = m.sender_role === "agent" || m.sender_role === "support";
          const v = msgVotes[m.id] || { up: false, down: false, count: 0 };

          let avatarBg = "#3182ce";
          let avatarText = (m.sender_email || "U")[0].toUpperCase();
          let authorName = m.sender_email || "User";
          let credential = null;

          if (isAI) {
            avatarBg = "#16c784";
            avatarText = "AI";
            authorName = "AI Help Desk";
            credential = "AI Support Bot";
          } else if (isAgent) {
            avatarBg = "#805ad5";
            credential = "Support Agent";
          }

          return (
            <div key={m.id} id={`msg-${m.id}`} style={s.answerCard}>
              <div style={s.answerAuthorRow}>
                <div style={{ ...s.answerAvatar, background: avatarBg }}>{avatarText}</div>
                <div>
                  <div style={s.answerAuthorName}>{authorName}</div>
                  {credential && <div style={s.answerCredential}>{credential}</div>}
                  <div style={s.answerTime}>{m.created_at ? timeAgo(m.created_at) : "recently"}</div>
                </div>
              </div>

              <div style={s.answerBody}>{m.message}</div>

              <div style={s.answerEngag}>
                <div style={s.votePair}>
                  <button
                    style={{ ...s.voteBtn, color: v.up ? "#16c784" : "#555" }}
                    onClick={() => toggleMsgVote(m.id, "up")}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={v.up ? "#16c784" : "none"} stroke="currentColor" strokeWidth="2">
                      <polyline points="18 15 12 9 6 15"/>
                    </svg>
                    <span>{v.count}</span>
                  </button>
                  <button
                    style={{ ...s.voteBtn, color: v.down ? "#e53e3e" : "#555" }}
                    onClick={() => toggleMsgVote(m.id, "down")}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={v.down ? "#e53e3e" : "none"} stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                </div>

                <button style={s.engagBtn}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </button>

                <button style={s.engagBtn} onClick={() => handleShareMsg(m.id)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                  </svg>
                  {copiedMsg === m.id ? "Copied!" : "Share"}
                </button>

                <button style={{ ...s.engagBtn, marginLeft: "auto" }}>···</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CSAT */}
      {isOwner && isClosedOrResolved && (
        <div style={s.csatBox}>
          <div style={s.csatTitle}>Rate this answer</div>
          <div style={s.csatSub}>How satisfied were you with the resolution?</div>
          <StarRating value={rating} onChange={submitRating} readonly={rated} />
          {rated && <div style={s.csatThanks}>Thank you for your feedback!</div>}
        </div>
      )}

      {/* Write answer box */}
      {!isClosedOrResolved && (
        <div id="answer-box" style={s.writeBox}>
          <div style={s.writeHeader}>
            <div style={{ ...s.answerAvatar, background: user.role === "agent" || user.role === "admin" ? "#805ad5" : "#16c784", flexShrink: 0 }}>
              {(user.name || user.email || "?")[0].toUpperCase()}
            </div>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>Write your answer</span>
          </div>
          <form onSubmit={sendReply}>
            <textarea
              style={s.writeTextarea}
              value={reply}
              onChange={e => setReply(e.target.value)}
              placeholder="Write your answer..."
              rows={5}
            />
            <div style={s.writeFooter}>
              <button style={s.submitBtn} disabled={sending || !reply.trim()}>
                {sending ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      )}

      {isClosedOrResolved && !isOwner && canManage && (
        <div style={s.closedNote}>
          This question is {ticket.status}. Change the status above to reopen it.
        </div>
      )}
    </div>
  );
}

const s = {
  page: { display: "flex", flexDirection: "column", gap: 12, paddingBottom: 48 },
  loading: { textAlign: "center", color: "#aaa", marginTop: 80, fontSize: 16 },

  questionCard: {
    background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8,
    padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12,
  },
  backLink: { color: "#aaa", textDecoration: "none", fontSize: 13, alignSelf: "flex-start" },
  qTitle: { fontSize: 24, fontWeight: 700, color: "#111", margin: 0, lineHeight: 1.3 },
  askedRow: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  askerAvatar: {
    width: 28, height: 28, borderRadius: "50%", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: 12, flexShrink: 0,
  },
  askerName: { fontSize: 14, fontWeight: 600, color: "#333" },
  dot: { color: "#aaa", fontSize: 14 },
  askedTime: { fontSize: 13, color: "#aaa" },
  badge: {
    fontSize: 11, fontWeight: 600, padding: "2px 9px",
    borderRadius: 10, textTransform: "capitalize",
  },
  qActions: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  answerBtn: {
    background: "#16c784", color: "#fff", border: "none",
    borderRadius: 20, padding: "7px 20px", fontSize: 14,
    fontWeight: 600, cursor: "pointer",
  },
  ghostBtn: {
    background: "none", color: "#555", border: "1px solid #e8e8e8",
    borderRadius: 20, padding: "6px 16px", fontSize: 14,
    cursor: "pointer",
  },
  qDescription: {
    fontSize: 15, color: "#444", lineHeight: 1.7,
    borderTop: "1px solid #f0f0f0", paddingTop: 12,
  },

  toolbar: {
    background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8,
    padding: "12px 16px", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
  },
  toolLabel: { fontSize: 12, color: "#aaa", fontWeight: 600 },
  statusBtns: { display: "flex", gap: 6, flexWrap: "wrap" },
  stBtn: {
    fontSize: 12, padding: "5px 12px", borderRadius: 20,
    border: "1.5px solid #e8e8e8", background: "#f7f7f5",
    cursor: "pointer", fontWeight: 500, textTransform: "capitalize",
  },
  aiBtn: {
    background: "#111", color: "#16c784", border: "none",
    borderRadius: 20, padding: "6px 14px", fontSize: 13,
    cursor: "pointer", fontWeight: 600,
  },
  aiBox: {
    background: "#f0fdf8", border: "1px solid #c6f6d5",
    borderRadius: 8, padding: "16px 20px",
  },
  aiTitle: { fontWeight: 700, fontSize: 13, color: "#16c784", marginBottom: 8 },
  aiPre: { whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: 13, color: "#111", margin: 0, lineHeight: 1.6 },

  answersHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "4px 0",
  },
  answersCount: { fontSize: 16, fontWeight: 700, color: "#111" },
  sortRow: { display: "flex", gap: 4 },
  sortBtn: {
    background: "none", border: "1px solid #e8e8e8", borderRadius: 16,
    padding: "4px 14px", fontSize: 13, cursor: "pointer", color: "#555",
  },
  sortBtnActive: { background: "#16c784", color: "#fff", border: "1px solid #16c784" },

  answersList: { display: "flex", flexDirection: "column", gap: 12 },
  noAnswers: { textAlign: "center", color: "#aaa", padding: 32, fontSize: 15 },

  answerCard: {
    background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8,
    padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12,
  },
  answerAuthorRow: { display: "flex", gap: 10, alignItems: "flex-start" },
  answerAvatar: {
    width: 40, height: 40, borderRadius: "50%", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: 15, flexShrink: 0,
  },
  answerAuthorName: { fontSize: 14, fontWeight: 700, color: "#111" },
  answerCredential: { fontSize: 12, color: "#888" },
  answerTime: { fontSize: 12, color: "#aaa" },
  answerBody: { fontSize: 15, color: "#333", lineHeight: 1.7 },
  answerEngag: {
    borderTop: "1px solid #f0f0f0", paddingTop: 10,
    display: "flex", alignItems: "center", gap: 4,
  },
  votePair: { display: "flex", alignItems: "center" },
  voteBtn: {
    background: "none", border: "none", cursor: "pointer",
    display: "flex", alignItems: "center", gap: 4,
    fontSize: 13, padding: "4px 8px", borderRadius: 16,
  },
  engagBtn: {
    background: "none", border: "none", cursor: "pointer",
    display: "flex", alignItems: "center", gap: 5,
    fontSize: 13, color: "#555", padding: "4px 10px", borderRadius: 16,
  },

  csatBox: {
    background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8,
    padding: "20px 24px",
  },
  csatTitle: { fontWeight: 700, fontSize: 16, color: "#111", marginBottom: 4 },
  csatSub: { fontSize: 13, color: "#aaa", marginBottom: 12 },
  csatThanks: { fontSize: 13, color: "#16c784", marginTop: 10, fontWeight: 600 },

  writeBox: {
    background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8,
    padding: "16px 20px",
  },
  writeHeader: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12 },
  writeTextarea: {
    width: "100%", border: "1px solid #e8e8e8", borderRadius: 8,
    padding: "12px 14px", fontSize: 15, fontFamily: "inherit",
    resize: "vertical", outline: "none", boxSizing: "border-box",
    background: "#f7f7f5", lineHeight: 1.6,
  },
  writeFooter: { display: "flex", justifyContent: "flex-end", marginTop: 10 },
  submitBtn: {
    background: "#16c784", color: "#fff", border: "none",
    borderRadius: 20, padding: "9px 28px", fontSize: 14,
    fontWeight: 700, cursor: "pointer",
  },
  closedNote: {
    textAlign: "center", color: "#aaa", fontSize: 13,
    padding: 16, background: "#f7f7f5", borderRadius: 8,
  },
};
