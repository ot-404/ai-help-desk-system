import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { C, timeAgo } from "../theme";

const STATUS_COLOR = { open: "#f59e0b", pending: "#3b82f6", resolved: C.accepted, closed: C.light };
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
  const truncated = ticket.subject.length > 40 ? ticket.subject.slice(0, 40) + "…" : ticket.subject;

  return (
    <div style={s.page}>
      <div style={s.main}>
        <div style={s.breadcrumb}>
          <Link to="/" style={s.crumb}>Home</Link><span style={s.sep}>›</span>
          <Link to="/help" style={s.crumb}>Questions</Link><span style={s.sep}>›</span>
          <span style={s.crumbCur}>{truncated}</span>
        </div>

        <h1 style={s.title}>{ticket.subject}</h1>
        <div style={s.metaBar}>
          <span>Asked <strong>{fmtDate(ticket.created_at)}</strong></span>
          <span>Modified <strong>{fmtDate(ticket.updated_at)}</strong></span>
          <span style={{ ...s.statusPill, background: sc + "22", color: sc }}>{ticket.status}</span>
        </div>

        <div style={s.qBody}>
          {ticket.description && <div style={s.desc}>{ticket.description}</div>}
          <div style={s.authorCard}>
            <div style={s.authorInner}>
              <div style={s.acLabel}>asked {timeAgo(ticket.created_at)}</div>
              <div style={s.acUser}>
                <div style={s.avatar}>{(ticket.user_name || "U")[0].toUpperCase()}</div>
                <span style={s.author}>{ticket.user_name || "User"}</span>
              </div>
            </div>
          </div>
        </div>

        <div style={s.divider} />

        <div style={s.answersHead}>{messages.length} Answer{messages.length !== 1 ? "s" : ""}</div>

        <div style={s.answers}>
          {messages.length === 0 && <div style={s.noAnswers}>No answers yet. Be the first to answer!</div>}
          {messages.map((m, idx) => {
            const isAI = m.ai_generated || m.sender_role === "ai";
            const isAgent = m.sender_role === "agent" || m.sender_role === "support";
            const name = isAI ? "HDS Bot" : isAgent ? "Support Agent" : (m.sender_email || "User");
            const ab = isAI ? C.purple : isAgent ? C.primary : C.rep;
            const accepted = isResolved && idx === messages.length - 1;
            return (
              <div key={m.id} style={s.answerCard}>
                <div style={s.answerLayout}>
                  <div style={s.voteCol}>
                    {accepted && (
                      <span title="Accepted answer" style={s.acceptedMark}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.accepted} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
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
            <div style={s.writeTitle}>Your Answer</div>
            <form onSubmit={sendReply}>
              <textarea style={s.textarea} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write your answer here…" rows={6} />
              <button style={s.submit} disabled={sending || !reply.trim()}>{sending ? "Posting…" : "Post Your Answer"}</button>
            </form>
          </div>
        )}
      </div>

      {canManage && (
        <aside style={s.side}>
          <div style={s.sideCard}>
            <div style={s.sideTitle}>Status</div>
            <div style={s.statusBtns}>
              {STATUSES.map((st) => (
                <button key={st} onClick={() => updateStatus(st)} disabled={statusUpdating === st || ticket.status === st}
                  style={{ ...s.stBtn, ...(ticket.status === st ? { background: STATUS_COLOR[st], color: "#fff", borderColor: STATUS_COLOR[st] } : {}) }}>
                  {statusUpdating === st ? "…" : st}
                </button>
              ))}
            </div>
          </div>
          <div style={s.sideCard}>
            <div style={s.sideTitle}>Assign</div>
            <button style={s.assignBtn}>Assign to me</button>
            <button style={s.assignBtn}>Escalate</button>
          </div>
        </aside>
      )}
    </div>
  );
}

const s = {
  page: { display: "flex", gap: 16, alignItems: "flex-start" },
  main: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column" },
  loading: { textAlign: "center", color: C.light, marginTop: 80, fontSize: 16 },
  breadcrumb: { display: "flex", alignItems: "center", gap: 6, fontSize: 13, marginBottom: 12 },
  crumb: { color: C.primary, textDecoration: "none" },
  sep: { color: C.light },
  crumbCur: { color: C.muted },
  title: { fontSize: 23, fontWeight: 500, color: C.text, margin: "0 0 8px", lineHeight: 1.35 },
  metaBar: { display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", fontSize: 13, color: C.muted, borderBottom: `1px solid ${C.border}`, paddingBottom: 10, marginBottom: 16 },
  statusPill: { fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 4, textTransform: "capitalize" },
  qBody: { display: "flex", flexDirection: "column", gap: 16 },
  desc: { fontSize: 15, color: C.text, lineHeight: 1.7, whiteSpace: "pre-wrap" },
  authorCard: { display: "flex", justifyContent: "flex-end" },
  authorInner: { background: "#d9eaf7", borderRadius: 4, padding: "8px 10px", minWidth: 180 },
  acLabel: { fontSize: 12, color: C.muted, marginBottom: 6 },
  acUser: { display: "flex", alignItems: "center", gap: 8 },
  avatar: { width: 30, height: 30, borderRadius: 3, background: C.rep, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, flexShrink: 0 },
  author: { fontSize: 13, fontWeight: 600, color: C.primary },
  dim: { fontSize: 13, color: C.muted },
  divider: { borderTop: `1px solid ${C.border}`, margin: "20px 0" },
  answersHead: { fontSize: 18, fontWeight: 400, color: C.text, marginBottom: 14 },
  answers: { display: "flex", flexDirection: "column" },
  noAnswers: { color: C.light, padding: "16px 0", fontSize: 15 },
  answerCard: { borderBottom: `1px solid ${C.border}`, padding: "16px 0" },
  answerLayout: { display: "flex", gap: 16 },
  voteCol: { width: 36, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" },
  acceptedMark: { display: "flex" },
  answerContent: { flex: 1, minWidth: 0 },
  answerBody: { fontSize: 15, color: C.text, lineHeight: 1.7, whiteSpace: "pre-wrap", marginBottom: 14 },
  answerMeta: { display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" },
  writeBox: { marginTop: 24 },
  writeTitle: { fontSize: 18, fontWeight: 400, color: C.text, marginBottom: 12 },
  textarea: { width: "100%", border: `1px solid #babfc4`, borderRadius: 4, padding: "12px 14px", fontSize: 15, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", lineHeight: 1.6 },
  submit: { marginTop: 12, background: C.primary, color: "#fff", border: "none", borderRadius: 4, padding: "11px 16px", fontSize: 14, fontWeight: 500, cursor: "pointer" },
  side: { width: 240, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12, position: "sticky", top: 76 },
  sideCard: { background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 6, padding: 16 },
  sideTitle: { fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 10 },
  statusBtns: { display: "flex", gap: 6, flexWrap: "wrap" },
  stBtn: { fontSize: 12, padding: "5px 12px", borderRadius: 4, border: `1px solid ${C.border}`, background: "#fff", fontWeight: 500, textTransform: "capitalize", color: C.muted, cursor: "pointer" },
  assignBtn: { display: "block", width: "100%", textAlign: "center", background: "#fff", border: `1px solid ${C.border}`, borderRadius: 4, padding: "9px 0", fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 8, cursor: "pointer" },
};
