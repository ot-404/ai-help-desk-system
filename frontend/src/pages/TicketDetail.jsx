import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { C, timeAgo } from "../theme";

const STATUS_COLOR = { open: C.warning, pending: C.primary, resolved: C.success, closed: C.light };
const STATUSES = ["open", "pending", "resolved", "closed"];

function fmtDate(d) {
  if (!d) return "recently";
  try { return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }); }
  catch { return "recently"; }
}

export default function TicketDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/tickets/${id}`),
      api.get(`/messages/ticket/${id}`),
    ]).then(([t, m]) => {
      setTicket(t.data);
      setMessages(m.data);
    });
  }, [id]);

  async function sendReply(e) {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    try {
      const { data } = await api.post(`/messages/ticket/${id}`, { message: reply });
      setMessages((m) => [...m, data]);
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

  if (!ticket) return <div style={s.loading}>Loading…</div>;

  const canManage = user.role === "agent" || user.role === "admin";
  const isClosed = ticket.status === "resolved" || ticket.status === "closed";
  const isResolved = ticket.status === "resolved";
  const sc = STATUS_COLOR[ticket.status] || C.light;

  return (
    <div>
      <Link to="/" style={s.back}>← Back to Questions</Link>

      {canManage && (
        <div style={s.agentBar}>
          <span style={s.agentLabel}>Status:</span>
          {STATUSES.map((st) => (
            <button key={st} onClick={() => updateStatus(st)} disabled={statusUpdating === st || ticket.status === st}
              style={{ ...s.stBtn, ...(ticket.status === st ? { background: STATUS_COLOR[st], color: "#fff", borderColor: STATUS_COLOR[st] } : {}) }}>
              {statusUpdating === st ? "…" : st}
            </button>
          ))}
          <button style={s.assignBtn}>Assign to me</button>
        </div>
      )}

      <h1 style={s.title}>{ticket.subject}</h1>
      <div style={s.metaBar}>
        <span>Asked {fmtDate(ticket.created_at)}</span>
        <span style={{ ...s.statusPill, background: sc + "22", color: sc }}>{ticket.status}</span>
      </div>

      {ticket.description && <div style={s.desc}>{ticket.description}</div>}
      <div style={s.authorRow}>
        <div style={s.avatar}>{(ticket.user_name || "U")[0].toUpperCase()}</div>
        <span style={s.author}>{ticket.user_name || "User"}</span>
        <span style={s.dim}>asked {timeAgo(ticket.created_at)}</span>
      </div>

      <div style={s.divider} />

      <div style={s.answersHead}>{messages.length} Answer{messages.length !== 1 ? "s" : ""}</div>

      <div style={s.answers}>
        {messages.length === 0 && <div style={s.noAnswers}>No answers yet. Be the first to answer!</div>}
        {messages.map((m, idx) => {
          const isAI = m.ai_generated || m.sender_role === "ai";
          const isAgent = m.sender_role === "agent" || m.sender_role === "support";
          const name = isAI ? "HDS Bot" : isAgent ? "Support Agent" : (m.sender_email || "User");
          const ab = isAI ? C.purple : isAgent ? C.primary : C.muted;
          const accepted = isResolved && idx === messages.length - 1;
          return (
            <div key={m.id} style={s.answerCard}>
              <div style={s.answerLayout}>
                <div style={s.voteCol}>
                  {accepted && (
                    <span title="Accepted answer" style={s.acceptedMark}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.success} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    </span>
                  )}
                </div>
                <div style={s.answerContent}>
                  <div style={s.answerBody}>{m.message}</div>
                  <div style={s.answerMeta}>
                    <div style={{ ...s.avatar, background: ab }}>{isAI ? "AI" : (name[0] || "U").toUpperCase()}</div>
                    <span style={s.author}>{name}</span>
                    <span style={s.dim}>answered {m.created_at ? timeAgo(m.created_at) : "recently"}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!isClosed && (
        <div style={s.writeBox}>
          <div style={s.writeTitle}>Write an Answer</div>
          <form onSubmit={sendReply}>
            <textarea style={s.textarea} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write your answer here…" rows={6} />
            <button style={s.submit} disabled={sending || !reply.trim()}>{sending ? "Posting…" : "Post Your Answer"}</button>
          </form>
        </div>
      )}
    </div>
  );
}

const s = {
  loading: { textAlign: "center", color: C.light, marginTop: 80, fontSize: 16 },
  back: { color: C.muted, textDecoration: "none", fontSize: 13, display: "block", marginBottom: 12 },
  agentBar: { display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "8px 12px", marginBottom: 16 },
  agentLabel: { fontSize: 13, fontWeight: 600, color: C.muted, marginRight: 4 },
  title: { fontSize: 22, fontWeight: 600, color: C.text, margin: "0 0 8px", lineHeight: 1.35 },
  metaBar: { display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", fontSize: 13, color: C.muted, borderBottom: `1px solid ${C.border}`, paddingBottom: 12, marginBottom: 16 },
  statusPill: { fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 4, textTransform: "capitalize" },
  desc: { fontSize: 15, color: C.text, lineHeight: 1.7, whiteSpace: "pre-wrap", marginBottom: 16 },
  authorRow: { display: "flex", alignItems: "center", gap: 8 },
  avatar: { width: 28, height: 28, borderRadius: "50%", background: C.primary, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 12, flexShrink: 0 },
  author: { fontSize: 13, fontWeight: 600, color: C.primary },
  dim: { fontSize: 13, color: C.muted },
  divider: { borderTop: `1px solid ${C.border}`, margin: "20px 0" },
  answersHead: { fontSize: 18, fontWeight: 600, color: C.text, marginBottom: 14 },
  answers: { display: "flex", flexDirection: "column" },
  noAnswers: { color: C.light, padding: "16px 0", fontSize: 15 },
  answerCard: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, marginBottom: 12 },
  answerLayout: { display: "flex", gap: 14 },
  voteCol: { width: 28, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" },
  acceptedMark: { display: "flex" },
  answerContent: { flex: 1, minWidth: 0 },
  answerBody: { fontSize: 15, color: C.text, lineHeight: 1.7, whiteSpace: "pre-wrap", marginBottom: 14 },
  answerMeta: { display: "flex", alignItems: "center", gap: 8 },
  writeBox: { marginTop: 24 },
  writeTitle: { fontSize: 18, fontWeight: 600, color: C.text, marginBottom: 12 },
  textarea: { width: "100%", border: `1px solid ${C.border}`, borderRadius: 6, padding: "12px 14px", fontSize: 16, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", lineHeight: 1.6 },
  submit: { marginTop: 12, background: C.primary, color: "#fff", border: "none", borderRadius: 6, padding: "11px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer", minHeight: 40 },
  stBtn: { fontSize: 12, padding: "5px 12px", borderRadius: 6, border: `1px solid ${C.border}`, background: C.surface, fontWeight: 500, textTransform: "capitalize", color: C.muted, cursor: "pointer" },
  assignBtn: { fontSize: 12, padding: "5px 12px", borderRadius: 6, border: `1px solid ${C.border}`, background: C.surface, fontWeight: 500, color: C.text, cursor: "pointer", marginLeft: "auto" },
};
