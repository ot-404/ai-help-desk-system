import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const STATUS_COLOR = { open: "#3182ce", pending: "#d69e2e", resolved: "#16c784", closed: "#718096" };
const STATUSES = ["open", "pending", "resolved", "closed"];

function StarRating({ value, onChange, readonly }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n}
          onMouseEnter={() => !readonly && setHover(n)}
          onMouseLeave={() => !readonly && setHover(0)}
          onClick={() => !readonly && onChange(n)}
          style={{ fontSize: 24, cursor: readonly ? "default" : "pointer", color: n <= (hover || value) ? "#f6c90e" : "#d1d5db" }}>
          ★
        </span>
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
    const { data } = await api.post(`/messages/ticket/${id}`, { message: reply });
    setMessages(m => [...m, data]);
    setReply("");
    setSending(false);
  }

  async function updateStatus(status) {
    const { data } = await api.put(`/tickets/${id}`, { status });
    setTicket(data);
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
  const isResolved = ticket.status === "resolved" || ticket.status === "closed";

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h2 style={s.title}>{ticket.subject}</h2>
          <div style={s.meta}>
            #{ticket.id} · {new Date(ticket.created_at).toLocaleString()}
            {ticket.resolved_at && ` · resolved ${new Date(ticket.resolved_at).toLocaleString()}`}
          </div>
        </div>
        <span style={{ ...s.badge, background: STATUS_COLOR[ticket.status] + "22", color: STATUS_COLOR[ticket.status] }}>
          {ticket.status}
        </span>
      </div>

      <div style={s.desc}>{ticket.description}</div>

      {canManage && (
        <div style={s.toolbar}>
          <span style={s.toolLabel}>Status:</span>
          {STATUSES.map(st => (
            <button key={st} onClick={() => updateStatus(st)}
              style={{ ...s.stBtn, ...(ticket.status === st ? s.stBtnActive : {}) }}>
              {st}
            </button>
          ))}
          <button onClick={fetchAISuggest} style={s.aiBtn} disabled={loadingAI}>
            {loadingAI ? "…" : "AI Suggest"}
          </button>
        </div>
      )}

      {aiSuggest && (
        <div style={s.aiBox}>
          <b>AI Resolution Steps</b>
          <pre style={s.aiPre}>{aiSuggest}</pre>
        </div>
      )}

      <div style={s.thread}>
        {messages.map(m => (
          <div key={m.id} style={{ ...s.msg, ...(m.sender_role === "ai" ? s.msgAI : m.sender_id === user.id ? s.msgMe : {}) }}>
            <div style={s.msgMeta}>
              {m.sender_role === "ai" ? "AI Assistant" : (m.sender_email || "Unknown")}
              {" · "}{new Date(m.created_at).toLocaleTimeString()}
            </div>
            <div style={s.msgBody}>{m.message}</div>
          </div>
        ))}
        {messages.length === 0 && <div style={s.noMsgs}>No messages yet.</div>}
      </div>

      {isOwner && isResolved && (
        <div style={s.csatBox}>
          <div style={s.csatTitle}>How satisfied were you with the resolution?</div>
          <StarRating value={rating} onChange={submitRating} readonly={rated} />
          {rated && <div style={s.csatThanks}>Thank you for your feedback!</div>}
        </div>
      )}

      {ticket.status !== "closed" && ticket.status !== "resolved" && (
        <form onSubmit={sendReply} style={s.replyForm}>
          <textarea style={s.replyInput} value={reply} onChange={e => setReply(e.target.value)}
            placeholder="Write a reply…" rows={3} />
          <button style={s.replyBtn} disabled={sending}>{sending ? "Sending…" : "Send"}</button>
        </form>
      )}
    </div>
  );
}

const s = {
  page: { maxWidth: 760, margin: "32px auto", padding: "0 20px" },
  loading: { textAlign: "center", color: "#7a8794", marginTop: 60 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  title: { fontSize: 20, fontWeight: 700, margin: 0 },
  meta: { fontSize: 12, color: "#7a8794", marginTop: 4 },
  badge: { fontSize: 13, fontWeight: 600, padding: "4px 12px", borderRadius: 10 },
  desc: { background: "#fff", borderRadius: 10, padding: "16px 18px", marginBottom: 16, fontSize: 14, lineHeight: 1.6, boxShadow: "0 2px 8px rgba(0,0,0,.05)" },
  toolbar: { display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" },
  toolLabel: { fontSize: 12, color: "#7a8794", fontWeight: 600, marginRight: 4 },
  stBtn: { fontSize: 12, padding: "4px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer" },
  stBtnActive: { background: "#16c784", color: "#fff", border: "1px solid #16c784" },
  aiBtn: { marginLeft: "auto", background: "#2d3748", color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer", fontWeight: 600 },
  aiBox: { background: "#f0fff4", border: "1px solid #c6f6d5", borderRadius: 10, padding: "14px 16px", marginBottom: 16, fontSize: 13 },
  aiPre: { whiteSpace: "pre-wrap", marginTop: 8, fontFamily: "inherit", fontSize: 13 },
  thread: { display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 },
  noMsgs: { color: "#7a8794", fontSize: 14, textAlign: "center", padding: "20px 0" },
  msg: { background: "#fff", borderRadius: 10, padding: "12px 16px", boxShadow: "0 1px 4px rgba(0,0,0,.05)" },
  msgAI: { background: "#ebf8ff", borderLeft: "3px solid #3182ce" },
  msgMe: { background: "#f0fff4", borderLeft: "3px solid #16c784" },
  msgMeta: { fontSize: 11, color: "#7a8794", marginBottom: 6 },
  msgBody: { fontSize: 14, lineHeight: 1.6 },
  csatBox: { background: "#fffbeb", border: "1px solid #fef3c7", borderRadius: 10, padding: "16px 20px", marginBottom: 16 },
  csatTitle: { fontSize: 14, fontWeight: 600, marginBottom: 10 },
  csatThanks: { fontSize: 13, color: "#16c784", marginTop: 8, fontWeight: 500 },
  replyForm: { display: "flex", flexDirection: "column", gap: 8 },
  replyInput: { border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 12px", fontSize: 14, fontFamily: "inherit", resize: "vertical" },
  replyBtn: { alignSelf: "flex-end", background: "#16c784", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer" },
};
