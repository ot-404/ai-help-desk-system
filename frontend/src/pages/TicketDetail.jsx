import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const STATUS_COLOR = { open: "#3182ce", pending: "#d69e2e", resolved: "#16c784", closed: "#718096" };
const PRI_COLOR   = { low: "#48bb78",  medium: "#ecc94b",  high: "#ed8936",    urgent: "#e53e3e" };
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
          style={{ fontSize: 26, cursor: readonly ? "default" : "pointer", color: n <= (hover || value) ? "#f6c90e" : "#e2e8f0", lineHeight: 1 }}
        >★</span>
      ))}
    </div>
  );
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

  if (!ticket) return <div style={s.loading}>Loading…</div>;

  const canManage = user.role === "agent" || user.role === "admin";
  const isOwner = ticket.user_id === user.id;
  const isClosedOrResolved = ticket.status === "resolved" || ticket.status === "closed";
  const backLink = canManage ? "/agent" : "/my-tickets";

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Link to={backLink} style={s.backLink}>← Back</Link>
          <h2 style={s.title}>{ticket.subject}</h2>
          <div style={s.metaRow}>
            <span style={s.metaItem}>#{ticket.id}</span>
            <span style={s.metaDot}>·</span>
            <span style={s.metaItem}>{new Date(ticket.created_at).toLocaleString()}</span>
            {ticket.user_name && canManage && (
              <>
                <span style={s.metaDot}>·</span>
                <span style={s.metaItem}>by <b>{ticket.user_name}</b></span>
              </>
            )}
            {ticket.resolved_at && (
              <>
                <span style={s.metaDot}>·</span>
                <span style={{ ...s.metaItem, color: "#16c784" }}>
                  resolved {new Date(ticket.resolved_at).toLocaleString()}
                </span>
              </>
            )}
          </div>
        </div>
        <div style={s.headerBadges}>
          <span style={{ ...s.badge, background: PRI_COLOR[ticket.priority] + "22", color: PRI_COLOR[ticket.priority] }}>
            {ticket.priority}
          </span>
          <span style={{ ...s.badge, background: STATUS_COLOR[ticket.status] + "22", color: STATUS_COLOR[ticket.status] }}>
            {ticket.status}
          </span>
        </div>
      </div>

      {/* Description */}
      <div style={s.desc}>{ticket.description}</div>

      {/* Agent toolbar */}
      {canManage && (
        <div style={s.toolbar}>
          <span style={s.toolLabel}>Set status:</span>
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
                {statusUpdating === st ? "…" : st}
              </button>
            ))}
          </div>
          <button onClick={fetchAISuggest} style={s.aiBtn} disabled={loadingAI}>
            {loadingAI ? "Thinking…" : "✦ AI Suggest"}
          </button>
        </div>
      )}

      {/* AI suggestion */}
      {aiSuggest && (
        <div style={s.aiBox}>
          <div style={s.aiTitle}>✦ AI Resolution Steps</div>
          <pre style={s.aiPre}>{aiSuggest}</pre>
        </div>
      )}

      {/* Message thread */}
      <div style={s.threadHeader}>
        Conversation <span style={s.threadCount}>{messages.length}</span>
      </div>
      <div style={s.thread}>
        {messages.length === 0 && (
          <div style={s.noMsgs}>No messages yet — be the first to reply.</div>
        )}
        {messages.map(m => {
          const isAI = m.ai_generated || m.sender_role === "ai";
          const isMe = m.sender_id === user.id;
          return (
            <div key={m.id} style={{ ...s.msg, ...(isAI ? s.msgAI : isMe ? s.msgMe : s.msgOther) }}>
              <div style={s.msgMeta}>
                <span style={s.msgAuthor}>
                  {isAI ? "✦ AI Assistant" : m.sender_email || "Support Agent"}
                </span>
                <span style={s.msgTime}>{new Date(m.created_at).toLocaleString()}</span>
              </div>
              <div style={s.msgBody}>{m.message}</div>
            </div>
          );
        })}
      </div>

      {/* CSAT */}
      {isOwner && isClosedOrResolved && (
        <div style={s.csatBox}>
          <div style={s.csatTitle}>Rate your experience</div>
          <div style={s.csatSub}>How satisfied were you with the resolution?</div>
          <StarRating value={rating} onChange={submitRating} readonly={rated} />
          {rated && <div style={s.csatThanks}>Thank you for your feedback!</div>}
        </div>
      )}

      {/* Reply form */}
      {!isClosedOrResolved && (
        <form onSubmit={sendReply} style={s.replyForm}>
          <textarea
            style={s.replyInput}
            value={reply}
            onChange={e => setReply(e.target.value)}
            placeholder="Write a reply…"
            rows={3}
          />
          <div style={s.replyRow}>
            <span style={s.replyHint}>{canManage ? "Replying as support agent" : "Replying as customer"}</span>
            <button style={s.replyBtn} disabled={sending || !reply.trim()}>
              {sending ? "Sending…" : "Send Reply"}
            </button>
          </div>
        </form>
      )}
      {isClosedOrResolved && !isOwner && (
        <div style={s.closedNote}>This ticket is {ticket.status}. Reopen it by changing the status above.</div>
      )}
    </div>
  );
}

const s = {
  page: { maxWidth: 780, margin: "32px auto", padding: "0 20px 40px" },
  loading: { textAlign: "center", color: "#7a8794", marginTop: 80 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, gap: 16 },
  backLink: { color: "#7a8794", textDecoration: "none", fontSize: 13, display: "block", marginBottom: 6 },
  title: { fontSize: 20, fontWeight: 700, margin: "0 0 6px", lineHeight: 1.3 },
  metaRow: { display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" },
  metaItem: { fontSize: 12, color: "#7a8794" },
  metaDot: { fontSize: 12, color: "#cbd5e0" },
  headerBadges: { display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 },
  badge: { fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20, textAlign: "center" },
  desc: { background: "#fff", borderRadius: 12, padding: "16px 20px", marginBottom: 16, fontSize: 14, lineHeight: 1.7, boxShadow: "0 2px 8px rgba(0,0,0,.05)", color: "#2d3748" },
  toolbar: { display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap", background: "#fff", borderRadius: 10, padding: "12px 16px", boxShadow: "0 1px 4px rgba(0,0,0,.05)" },
  toolLabel: { fontSize: 12, color: "#7a8794", fontWeight: 600 },
  statusBtns: { display: "flex", gap: 6, flex: 1, flexWrap: "wrap" },
  stBtn: { fontSize: 12, padding: "5px 12px", borderRadius: 20, border: "1.5px solid #e2e8f0", background: "#f7fafc", cursor: "pointer", fontWeight: 500 },
  aiBtn: { background: "#1f2a37", color: "#16c784", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap" },
  aiBox: { background: "#f0fff4", border: "1px solid #c6f6d5", borderRadius: 12, padding: "16px 20px", marginBottom: 16 },
  aiTitle: { fontWeight: 700, fontSize: 13, color: "#276749", marginBottom: 8 },
  aiPre: { whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: 13, color: "#2d3748", margin: 0, lineHeight: 1.6 },
  threadHeader: { fontSize: 13, fontWeight: 700, color: "#4a5568", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 },
  threadCount: { background: "#e2e8f0", color: "#4a5568", fontSize: 11, fontWeight: 700, padding: "1px 7px", borderRadius: 10 },
  thread: { display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 },
  noMsgs: { color: "#a0aec0", fontSize: 14, textAlign: "center", padding: "28px 0" },
  msg: { borderRadius: 10, padding: "12px 16px", fontSize: 14, lineHeight: 1.6 },
  msgAI: { background: "#ebf8ff", borderLeft: "3px solid #3182ce" },
  msgMe: { background: "#f0fff4", borderLeft: "3px solid #16c784" },
  msgOther: { background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,.06)" },
  msgMeta: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  msgAuthor: { fontSize: 12, fontWeight: 700, color: "#4a5568" },
  msgTime: { fontSize: 11, color: "#a0aec0" },
  msgBody: { color: "#2d3748" },
  csatBox: { background: "#fffbeb", border: "1px solid #fef3c7", borderRadius: 12, padding: "18px 20px", marginBottom: 16 },
  csatTitle: { fontWeight: 700, fontSize: 15, marginBottom: 2 },
  csatSub: { fontSize: 13, color: "#7a8794", marginBottom: 12 },
  csatThanks: { fontSize: 13, color: "#16c784", marginTop: 10, fontWeight: 600 },
  replyForm: { background: "#fff", borderRadius: 12, padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,.06)" },
  replyInput: { width: "100%", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 12px", fontSize: 14, fontFamily: "inherit", resize: "vertical", outline: "none", boxSizing: "border-box", marginBottom: 10 },
  replyRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  replyHint: { fontSize: 12, color: "#a0aec0" },
  replyBtn: { background: "#16c784", color: "#fff", border: "none", borderRadius: 8, padding: "9px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer" },
  closedNote: { textAlign: "center", color: "#a0aec0", fontSize: 13, padding: "16px", background: "#f7fafc", borderRadius: 10 },
};
