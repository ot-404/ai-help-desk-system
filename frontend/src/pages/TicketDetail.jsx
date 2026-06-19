import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { C, timeAgo, deriveType, TYPE_BADGE } from "../theme";

const STATUS_COLOR = { open: C.warning, pending: C.blue, resolved: C.success, closed: C.light };
const STATUSES = ["open", "pending", "resolved", "closed"];
const ROLE_BADGE = { agent: { bg: "#e8f4fd", color: C.blue, label: "Support Agent" }, admin: { bg: "#ffe9e0", color: C.primary, label: "Admin" }, ai: { bg: "#e3f2f6", color: "#0e7490", label: "AI" } };

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
  const [aiAnswer, setAiAnswer] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

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

  async function getAiAnswer() {
    if (aiLoading || aiAnswer) return;
    setAiLoading(true);
    try {
      const q = ticket.subject + (ticket.description ? `\n\n${ticket.description}` : "");
      const { data } = await api.post("/ai/answer", { question: q, ticket_id: ticket.id });
      setAiAnswer(data.answer);
    } catch {
      setAiAnswer("Sorry, the AI couldn't generate an answer right now. Please try again.");
    } finally {
      setAiLoading(false);
    }
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

      {ticket.flagged && (
        <div style={s.flagBanner}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          <div>
            <strong>Flagged for review by AI.</strong>{" "}
            {ticket.flag_reason || "This post may closely match existing content."}
            <div style={s.flagSub}>Automated check · not verified · an agent can dismiss this.</div>
          </div>
        </div>
      )}

      {ticket.credits?.length > 0 && (
        <div style={s.creditsCard}>
          <div style={s.creditsHead}>Suggested sources</div>
          <ul style={s.creditsList}>
            {ticket.credits.map((c, i) => <li key={i} style={s.creditItem}>{c}</li>)}
          </ul>
          <div style={s.creditsSub}>AI-suggested attributions — please verify before relying on them.</div>
        </div>
      )}

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

      {/* AI Answer */}
      <div style={s.aiSection}>
        {!aiAnswer && !aiLoading && (
          <button onClick={getAiAnswer} style={s.aiBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" />
            </svg>
            Get AI Answer
          </button>
        )}
        {aiLoading && (
          <div style={s.aiThinking}>
            <span style={s.aiDot} /><span style={s.aiDot} /><span style={s.aiDot} />
            <span style={{ fontSize: 13, color: "#0e7490", fontStyle: "italic" }}>HDS Bot is thinking…</span>
          </div>
        )}
        {aiAnswer && (
          <div style={s.aiCard}>
            <div style={s.aiCardHead}>
              <span style={s.aiBadge}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8" /><rect x="4" y="8" width="16" height="12" rx="2" /><path d="M2 14h2M20 14h2M9 13v2M15 13v2" /></svg>
                HDS Bot
              </span>
              <span style={s.aiLabel}>AI-generated · not a human answer</span>
            </div>
            <div style={s.aiText}>{aiAnswer}</div>
            <button onClick={() => setAiAnswer(null)} style={s.aiDismiss}>Dismiss</button>
          </div>
        )}
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
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.success} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
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
            <button style={s.submit} disabled={sending || !reply.trim()}>{sending ? "Posting…" : "Post Answer"}</button>
          </form>
        )}
      </div>
    </div>
  );
}

const s = {
  loading: { textAlign: "center", color: C.light, marginTop: 80, fontSize: 16 },
  back: { color: C.muted, textDecoration: "none", fontSize: 13, display: "block", marginBottom: 12 },
  flagBanner: { display: "flex", gap: 10, alignItems: "flex-start", background: "#fff7ed", border: "1px solid #fed7aa", color: "#9a3412", borderRadius: 10, padding: "11px 14px", fontSize: 13.5, lineHeight: 1.5, marginBottom: 12 },
  flagSub: { fontSize: 12, color: "#b45c2e", marginTop: 3 },
  creditsCard: { background: "#e3f2f6", border: "1px solid #bcdfe8", borderRadius: 10, padding: "12px 14px", marginBottom: 12 },
  creditsHead: { fontSize: 12, fontWeight: 700, color: C.primary, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 },
  creditsList: { margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 3 },
  creditItem: { fontSize: 13.5, color: C.text, lineHeight: 1.5 },
  creditsSub: { fontSize: 11.5, color: "#6b9aa6", fontStyle: "italic", marginTop: 7 },
  agentCard: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 12, overflow: "hidden" },
  agentHead: { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: C.surfaceHover, border: "none", padding: "11px 14px", fontSize: 13, fontWeight: 700, color: C.text, cursor: "pointer" },
  agentBody: { display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6, padding: "10px 14px" },
  agentLabel: { fontSize: 13, fontWeight: 600, color: C.muted, marginRight: 4 },
  qCard: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, display: "flex", overflow: "hidden" },
  voteCol: { width: 44, flexShrink: 0, background: C.surfaceHover, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 10, gap: 4 },
  voteNum: { fontSize: 13, fontWeight: 700, color: C.muted },
  qBody: { flex: 1, minWidth: 0, padding: 12 },
  metaRow: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, marginBottom: 8, fontSize: 12 },
  typeBadge: { fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 6 },
  topicChip: { background: C.tag, color: C.muted, borderRadius: 6, padding: "2px 9px", fontSize: 12, fontWeight: 500 },
  meta: { fontSize: 12, color: C.light },
  anon: { fontStyle: "italic", color: C.anon },
  title: { fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 12px", lineHeight: 1.3, letterSpacing: -0.3 },
  desc: { fontSize: 15, color: C.text, lineHeight: 1.7, whiteSpace: "pre-wrap", marginBottom: 14 },
  actions: { display: "flex", flexWrap: "wrap", gap: 8 },
  actionBtn: { color: C.muted, fontSize: 12.5, fontWeight: 600, padding: "6px 8px", borderRadius: 6 },
  aiSection: { margin: "14px 0" },
  aiBtn: { display: "inline-flex", alignItems: "center", gap: 8, background: "#e3f2f6", border: "1px solid #bcdfe8", color: C.purple, borderRadius: 10, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  aiThinking: { display: "flex", alignItems: "center", gap: 6, padding: "11px 14px", background: "#e3f2f6", borderRadius: 10, border: "1px solid #bcdfe8" },
  aiDot: { width: 6, height: 6, borderRadius: "50%", background: C.purple, display: "inline-block", opacity: 0.6 },
  aiCard: { background: "#e3f2f6", border: "1px solid #bcdfe8", borderRadius: 10, padding: 16 },
  aiCardHead: { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 },
  aiBadge: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: C.purple },
  aiLabel: { fontSize: 11, color: "#6b9aa6", fontStyle: "italic" },
  aiText: { fontSize: 15, color: C.text, lineHeight: 1.75, whiteSpace: "pre-wrap" },
  aiDismiss: { marginTop: 10, background: "none", border: "none", color: "#6b9aa6", fontSize: 12, cursor: "pointer", padding: 0 },
  answersHead: { fontSize: 16, fontWeight: 700, color: C.text, margin: "22px 0 12px" },
  answers: { display: "flex", flexDirection: "column", gap: 10 },
  noAnswers: { color: C.light, padding: "18px", fontSize: 15, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12 },
  answerCard: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, display: "flex", overflow: "hidden" },
  answerContent: { flex: 1, minWidth: 0, padding: 14 },
  answerMeta: { display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  author: { fontSize: 13, fontWeight: 700, color: C.text },
  roleBadge: { fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 8 },
  dim: { fontSize: 12, color: C.light },
  bestBadge: { fontSize: 11, fontWeight: 700, color: C.success, background: "#ecfdf3", padding: "2px 8px", borderRadius: 8 },
  acceptedMark: { display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: C.success },
  answerBody: { fontSize: 15, color: C.text, lineHeight: 1.7, whiteSpace: "pre-wrap" },
  writeBox: { marginTop: 22, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 },
  writeTitle: { fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 12 },
  textarea: { width: "100%", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", fontSize: 16, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", lineHeight: 1.6, minHeight: 220 },
  submit: { marginTop: 12, display: "inline-block", background: C.gradient, color: "#fff", border: "none", borderRadius: 10, padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer", minHeight: 40, textDecoration: "none" },
};
