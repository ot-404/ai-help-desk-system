import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { C, timeAgo, deriveType, TYPE_BADGE } from "../theme";

const STATUS_COLOR = { open: "#9a6700", pending: C.blue, resolved: "#1a7f37", closed: C.light };
const STATUSES = ["open", "pending", "resolved", "closed"];
const ROLE_BADGE = { agent: { bg: "#e8f4fd", color: C.blue, label: "Support Agent" }, admin: { bg: "#ffe9e0", color: C.primary, label: "Admin" }, ai: { bg: "#f3ecff", color: "#8250df", label: "AI" } };

function VoteStrip() {
  return (
    <div style={s.voteCol}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
      <span style={s.voteNum}>0</span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
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
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [agentOpen, setAgentOpen] = useState(true);

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

  const canManage = user && (user.role === "agent" || user.role === "admin");
  const isResolved = ticket.status === "resolved";
  const isAnon = !!ticket.is_anonymous;
  const author = isAnon ? "u/anonymous" : (ticket.user_name || "User");
  const type = deriveType(ticket);
  const badge = TYPE_BADGE[type] || TYPE_BADGE.Question;

  // best answer = highest index proxy (most recent / accepted). Mark first answer as best.
  const bestIdx = messages.length ? 0 : -1;

  return (
    <div>
      <Link to="/" style={s.back}>← Back to feed</Link>

      {canManage && (
        <div style={s.agentCard}>
          <button type="button" style={s.agentHead} onClick={() => setAgentOpen((v) => !v)}>
            <span>Agent Tools</span>
            <span>{agentOpen ? "▾" : "▸"}</span>
          </button>
          {agentOpen && (
            <div style={s.agentBody}>
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
        </div>
      )}

      {/* Question card */}
      <div style={s.qCard}>
        <VoteStrip />
        <div style={s.qBody}>
          <div style={s.metaRow}>
            <span style={{ ...s.typeBadge, background: badge.bg, color: badge.color }}>{type}</span>
            <span style={s.topicChip}>{ticket.category || "Programming"}</span>
            <span style={s.meta}>• Posted by <span style={isAnon ? s.anon : undefined}>{author}</span> · {timeAgo(ticket.created_at)}</span>
          </div>
          <h1 style={s.title}>{ticket.subject}</h1>
          {ticket.description && <div style={s.desc}>{ticket.description}</div>}
          <div style={s.actions}>
            <span style={s.actionBtn}>{messages.length} Comments</span>
            <span style={s.actionBtn}>Share</span>
            <span style={s.actionBtn}>Save</span>
          </div>
        </div>
      </div>

      <div style={s.answersHead}>{messages.length} Answer{messages.length !== 1 ? "s" : ""}</div>

      <div style={s.answers}>
        {messages.length === 0 && <div style={s.noAnswers}>No answers yet. Be the first to answer!</div>}
        {messages.map((m, idx) => {
          const isAI = m.ai_generated || m.sender_role === "ai";
          const isAgent = m.sender_role === "agent" || m.sender_role === "support";
          const roleKey = isAI ? "ai" : isAgent ? "agent" : null;
          const rb = roleKey ? ROLE_BADGE[roleKey] : null;
          const name = isAI ? "HDS Bot" : isAgent ? "Support Agent" : (m.sender_email || "User");
          const accepted = isResolved && idx === messages.length - 1;
          return (
            <div key={m.id} style={s.answerCard}>
              <VoteStrip />
              <div style={s.answerContent}>
                <div style={s.answerMeta}>
                  <span style={s.author}>{name}</span>
                  {rb && <span style={{ ...s.roleBadge, background: rb.bg, color: rb.color }}>{rb.label}</span>}
                  <span style={s.dim}>· {m.created_at ? timeAgo(m.created_at) : "recently"}</span>
                  {idx === bestIdx && messages.length > 1 && <span style={s.bestBadge}>★ Best Answer</span>}
                  {accepted && (
                    <span style={s.acceptedMark} title="Accepted answer">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a7f37" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      Accepted
                    </span>
                  )}
                </div>
                <div style={s.answerBody}>{m.message}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={s.writeBox}>
        <div style={s.writeTitle}>Your Answer</div>
        {!user ? (
          <Link to={`/login?next=/question/${id}`} style={s.submit}>Log in to answer</Link>
        ) : (
          <form onSubmit={sendReply}>
            <textarea style={s.textarea} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write your answer here…" rows={8} />
            <button style={s.submit} disabled={sending || !reply.trim()}>{sending ? "POSTING…" : "POST ANSWER"}</button>
          </form>
        )}
      </div>
    </div>
  );
}

const s = {
  loading: { textAlign: "center", color: C.light, marginTop: 80, fontSize: 16 },
  back: { color: C.muted, textDecoration: "none", fontSize: 13, display: "block", marginBottom: 12 },
  agentCard: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, marginBottom: 12, overflow: "hidden" },
  agentHead: { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8f9fa", border: "none", padding: "10px 14px", fontSize: 13, fontWeight: 700, color: C.text, cursor: "pointer" },
  agentBody: { display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6, padding: "10px 14px" },
  agentLabel: { fontSize: 13, fontWeight: 600, color: C.muted, marginRight: 4 },
  qCard: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, display: "flex", overflow: "hidden" },
  voteCol: { width: 38, flexShrink: 0, background: "#f8f9fa", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 8, gap: 4 },
  voteNum: { fontSize: 13, fontWeight: 700, color: C.muted },
  qBody: { flex: 1, minWidth: 0, padding: 12 },
  metaRow: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, marginBottom: 8, fontSize: 12 },
  typeBadge: { fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10 },
  topicChip: { background: C.tag, color: C.muted, borderRadius: 10, padding: "2px 8px", fontSize: 12, fontWeight: 600 },
  meta: { fontSize: 12, color: C.muted },
  anon: { fontStyle: "italic", color: C.anon },
  title: { fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 12px", lineHeight: 1.3 },
  desc: { fontSize: 15, color: C.text, lineHeight: 1.7, whiteSpace: "pre-wrap", marginBottom: 14 },
  actions: { display: "flex", flexWrap: "wrap", gap: 8 },
  actionBtn: { color: C.muted, fontSize: 12, fontWeight: 700, padding: "6px 8px", borderRadius: 2 },
  answersHead: { fontSize: 16, fontWeight: 700, color: C.muted, margin: "20px 0 10px" },
  answers: { display: "flex", flexDirection: "column", gap: 8 },
  noAnswers: { color: C.light, padding: "16px", fontSize: 15, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4 },
  answerCard: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, display: "flex", overflow: "hidden" },
  answerContent: { flex: 1, minWidth: 0, padding: 12 },
  answerMeta: { display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  author: { fontSize: 13, fontWeight: 700, color: C.text },
  roleBadge: { fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 10 },
  dim: { fontSize: 12, color: C.muted },
  bestBadge: { fontSize: 11, fontWeight: 700, color: "#1a7f37", background: "#e6f7ea", padding: "2px 8px", borderRadius: 10 },
  acceptedMark: { display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: "#1a7f37" },
  answerBody: { fontSize: 15, color: C.text, lineHeight: 1.7, whiteSpace: "pre-wrap" },
  writeBox: { marginTop: 20, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: 16 },
  writeTitle: { fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 12 },
  textarea: { width: "100%", border: `1px solid ${C.border}`, borderRadius: 4, padding: "12px 14px", fontSize: 16, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", lineHeight: 1.6, minHeight: 300 },
  submit: { marginTop: 12, display: "inline-block", background: C.primary, color: "#fff", border: "none", borderRadius: 20, padding: "9px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", minHeight: 38, textDecoration: "none", textTransform: "uppercase" },
};
