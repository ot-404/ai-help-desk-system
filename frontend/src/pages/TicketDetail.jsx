import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { C, timeAgo } from "../theme";

const STATUS_COLOR = { open: "#f59e0b", pending: "#3b82f6", resolved: "#1a7f45", closed: C.light };
const STATUSES = ["open", "pending", "resolved", "closed"];

export default function TicketDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [votes, setVotes] = useState({});

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

  const onVote = (mid, dir) => {
    setVotes((prev) => {
      const cur = prev[mid] || { up: false, down: false, count: 0 };
      if (dir === "up") { const w = cur.up; return { ...prev, [mid]: { up: !w, down: false, count: cur.count + (w ? -1 : 1) } }; }
      const w = cur.down; return { ...prev, [mid]: { down: !w, up: false, count: cur.count + (cur.up ? -1 : 0) } };
    });
  };

  if (!ticket) return <div style={s.loading}>Loading…</div>;

  const canManage = user.role === "agent" || user.role === "admin";
  const isClosed = ticket.status === "resolved" || ticket.status === "closed";
  const sc = STATUS_COLOR[ticket.status] || C.light;

  return (
    <div style={s.page}>
      <div style={s.main}>
        <div style={s.breadcrumb}>
          <Link to="/" style={s.crumb}>Home</Link><span style={s.sep}>/</span>
          <span style={s.crumbCur}>Question</span>
        </div>

        <div style={s.card}>
          <h1 style={s.title}>{ticket.subject}</h1>
          <div style={s.metaRow}>
            <div style={s.avatar}>{(ticket.user_name || "U")[0].toUpperCase()}</div>
            <span style={s.author}>{ticket.user_name || "User"}</span>
            <span style={s.dim}>· {ticket.created_at ? timeAgo(ticket.created_at) : "recently"}</span>
            <span style={{ ...s.badge, background: sc + "22", color: sc }}>{ticket.status}</span>
            <span style={s.dim}>· {(ticket.id * 7) % 900 + 30} views</span>
          </div>
          {ticket.description && <div style={s.desc}>{ticket.description}</div>}
        </div>

        <div style={s.answersHead}>{messages.length} Answer{messages.length !== 1 ? "s" : ""}</div>

        <div style={s.answers}>
          {messages.length === 0 && <div style={s.noAnswers}>No answers yet. Be the first to answer!</div>}
          {messages.map((m) => {
            const isAI = m.ai_generated || m.sender_role === "ai";
            const isAgent = m.sender_role === "agent" || m.sender_role === "support";
            const v = votes[m.id] || { up: false, down: false, count: 0 };
            const name = isAI ? "HDS Bot" : isAgent ? "Support Agent" : (m.sender_email || "User");
            const ab = isAI ? C.ai : isAgent ? C.primary : "#5a8dee";
            return (
              <div key={m.id} style={s.answerCard}>
                <div style={s.answerHead}>
                  <div style={{ ...s.avatar, background: ab }}>{isAI ? "AI" : (name[0] || "U").toUpperCase()}</div>
                  <span style={s.author}>{name}</span>
                  <span style={s.dim}>· {m.created_at ? timeAgo(m.created_at) : "recently"}</span>
                </div>
                <div style={s.answerBody}>{m.message}</div>
                <div style={s.voteRow}>
                  <button style={s.voteBtn} onClick={() => onVote(m.id, "up")}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill={v.up ? C.accent : "none"} stroke={v.up ? C.accent : C.light} strokeWidth="2.2"><polyline points="18 15 12 9 6 15" /></svg>
                  </button>
                  <span style={{ fontSize: 13, fontWeight: 700, color: v.up ? C.accent : C.text }}>{v.count}</span>
                  <button style={s.voteBtn} onClick={() => onVote(m.id, "down")}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill={v.down ? "#5a8dee" : "none"} stroke={v.down ? "#5a8dee" : C.light} strokeWidth="2.2"><polyline points="6 9 12 15 18 9" /></svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {!isClosed && (
          <div style={s.writeBox}>
            <div style={s.writeTitle}>Write an Answer</div>
            <form onSubmit={sendReply}>
              <textarea style={s.textarea} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Share your answer…" rows={5} />
              <button style={s.submit} disabled={sending || !reply.trim()}>{sending ? "Submitting…" : "Post Answer"}</button>
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
  main: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 12 },
  loading: { textAlign: "center", color: C.light, marginTop: 80, fontSize: 16 },
  breadcrumb: { display: "flex", alignItems: "center", gap: 6, fontSize: 13 },
  crumb: { color: C.primary, textDecoration: "none", fontWeight: 600 },
  sep: { color: C.light },
  crumbCur: { color: C.light },
  card: { background: C.surface, border: "1px solid " + C.border, borderRadius: 8, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 12 },
  title: { fontSize: 24, fontWeight: 800, color: C.text, margin: 0, lineHeight: 1.3 },
  metaRow: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  avatar: { width: 30, height: 30, borderRadius: "50%", background: C.primary, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, flexShrink: 0 },
  author: { fontSize: 14, fontWeight: 600, color: C.text },
  dim: { fontSize: 13, color: C.light },
  badge: { fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 10, textTransform: "capitalize" },
  desc: { fontSize: 15, color: C.muted, lineHeight: 1.7, borderTop: "1px solid " + C.bg, paddingTop: 12, whiteSpace: "pre-wrap" },
  answersHead: { fontSize: 16, fontWeight: 700, color: C.text, padding: "4px 0" },
  answers: { display: "flex", flexDirection: "column", gap: 12 },
  noAnswers: { textAlign: "center", color: C.light, padding: 32, fontSize: 15, background: C.surface, border: "1px solid " + C.border, borderRadius: 8 },
  answerCard: { background: C.surface, border: "1px solid " + C.border, borderRadius: 8, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 },
  answerHead: { display: "flex", alignItems: "center", gap: 8 },
  answerBody: { fontSize: 15, color: C.text, lineHeight: 1.7, whiteSpace: "pre-wrap" },
  voteRow: { display: "flex", alignItems: "center", gap: 6, borderTop: "1px solid " + C.bg, paddingTop: 10 },
  voteBtn: { background: "none", border: "none", padding: 2, display: "flex" },
  writeBox: { background: C.surface, border: "1px solid " + C.border, borderRadius: 8, padding: "16px 20px" },
  writeTitle: { fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 12 },
  textarea: { width: "100%", border: "1px solid " + C.border, borderRadius: 8, padding: "12px 14px", fontSize: 15, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", lineHeight: 1.6 },
  submit: { marginTop: 10, background: C.primary, color: "#fff", border: "none", borderRadius: 8, padding: "10px 26px", fontSize: 14, fontWeight: 700 },
  side: { width: 240, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12, position: "sticky", top: 76 },
  sideCard: { background: C.surface, border: "1px solid " + C.border, borderRadius: 8, padding: 16 },
  sideTitle: { fontSize: 13, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 10 },
  statusBtns: { display: "flex", gap: 6, flexWrap: "wrap" },
  stBtn: { fontSize: 12, padding: "5px 12px", borderRadius: 20, border: "1.5px solid " + C.border, background: "#fff", fontWeight: 600, textTransform: "capitalize", color: C.muted },
  assignBtn: { display: "block", width: "100%", textAlign: "center", background: C.bg, border: "1px solid " + C.border, borderRadius: 8, padding: "9px 0", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 8 },
};
