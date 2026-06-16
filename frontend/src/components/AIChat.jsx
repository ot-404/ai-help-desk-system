import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import { C } from "../theme";

function BotIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line x1="8" y1="16" x2="8" y2="16" strokeWidth="3" />
      <line x1="12" y1="16" x2="12" y2="16" strokeWidth="3" />
      <line x1="16" y1="16" x2="16" y2="16" strokeWidth="3" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

const QUICK = [
  "How do I reset my password?",
  "What is two-factor authentication?",
  "How do I contact support?",
];

export default function AIChat() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi! I'm the HD Systems AI. Ask me anything about tech, your account, or how to use this platform." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text) {
    const q = (text || input).trim();
    if (!q || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setLoading(true);
    try {
      const { data } = await api.post("/ai/answer", { question: q });
      setMessages((m) => [...m, { role: "ai", text: data.answer }]);
    } catch {
      setMessages((m) => [...m, { role: "ai", text: "Sorry, I couldn't process that. Please try again or visit the Ask AI page." }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          position: "fixed", bottom: 76, right: 16, zIndex: 200,
          width: 52, height: 52, borderRadius: "50%",
          background: open ? C.muted : C.gradient,
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
          color: "#fff", transition: "background 0.2s",
        }}
        aria-label="AI Chat"
        title="Ask AI"
      >
        {open
          ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          : <BotIcon size={24} />
        }
      </button>

      {/* Chat panel */}
      {open && (
        <div style={s.panel}>
          {/* Header */}
          <div style={s.header}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={s.botAvatar}><BotIcon size={16} /></div>
              <div>
                <div style={s.botName}>HDS Bot</div>
                <div style={s.botSub}>AI · Always online</div>
              </div>
            </div>
            <Link to="/ask" onClick={() => setOpen(false)} style={s.fullLink}>Full page →</Link>
          </div>

          {/* Messages */}
          <div style={s.messages}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 8 }}>
                {m.role === "ai" && (
                  <div style={s.aiBubbleAvatar}><BotIcon size={13} /></div>
                )}
                <div style={m.role === "user" ? s.userBubble : s.aiBubble}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 0" }}>
                <div style={s.aiBubbleAvatar}><BotIcon size={13} /></div>
                <div style={{ ...s.aiBubble, color: C.light, fontStyle: "italic" }}>Thinking…</div>
              </div>
            )}

            {/* Quick prompts shown only at start */}
            {messages.length === 1 && !loading && (
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 11, color: C.light, marginBottom: 6, fontWeight: 600 }}>QUICK QUESTIONS</div>
                {QUICK.map((q) => (
                  <button key={q} onClick={() => send(q)} style={s.quickBtn}>{q}</button>
                ))}
              </div>
            )}

            {!user && (
              <div style={s.loginBanner}>
                <Link to="/login" style={{ color: C.blue, fontWeight: 700 }}>Sign in</Link> for full AI access and chat history.
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={s.inputRow}>
            <textarea
              ref={inputRef}
              style={s.input}
              placeholder={user ? "Ask anything…" : "Sign in to use AI chat"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={!user || loading}
              rows={1}
            />
            <button
              onClick={() => send()}
              disabled={!user || loading || !input.trim()}
              style={{ ...s.sendBtn, opacity: (!user || loading || !input.trim()) ? 0.4 : 1 }}
            >
              <SendIcon />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const s = {
  panel: {
    position: "fixed", bottom: 136, right: 16, zIndex: 199,
    width: 340, maxWidth: "calc(100vw - 32px)",
    background: C.surface, border: `1px solid ${C.border}`,
    borderRadius: 8, boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
    display: "flex", flexDirection: "column",
    maxHeight: "60vh",
  },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "12px 14px", borderBottom: `1px solid ${C.border}`,
    background: C.gradient, borderRadius: "8px 8px 0 0",
  },
  botAvatar: {
    width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.2)",
    display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
    flexShrink: 0,
  },
  botName: { fontSize: 13, fontWeight: 700, color: "#fff" },
  botSub: { fontSize: 10, color: "rgba(255,255,255,0.7)" },
  fullLink: { fontSize: 12, color: "rgba(255,255,255,0.85)", textDecoration: "none", fontWeight: 600 },

  messages: {
    flex: 1, overflowY: "auto", padding: "12px 14px",
    display: "flex", flexDirection: "column",
    minHeight: 0,
  },
  aiBubbleAvatar: {
    width: 22, height: 22, borderRadius: "50%", background: "#e3f2f6",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: C.primary, flexShrink: 0, marginRight: 6, marginTop: 2,
  },
  aiBubble: {
    background: "#e3f2f6", color: C.text,
    borderRadius: "0 12px 12px 12px",
    padding: "8px 12px", fontSize: 13, lineHeight: 1.5,
    maxWidth: "85%", whiteSpace: "pre-wrap",
  },
  userBubble: {
    background: C.primary, color: "#fff",
    borderRadius: "12px 0 12px 12px",
    padding: "8px 12px", fontSize: 13, lineHeight: 1.5,
    maxWidth: "85%", whiteSpace: "pre-wrap",
  },
  quickBtn: {
    display: "block", width: "100%", textAlign: "left",
    background: "#e3f2f6", border: "none",
    borderRadius: 6, padding: "8px 10px",
    fontSize: 12, color: C.primary, fontWeight: 600,
    cursor: "pointer", marginBottom: 4,
  },
  loginBanner: {
    background: "#fff8e6", border: `1px solid #ffd635`,
    borderRadius: 6, padding: "8px 10px", fontSize: 12, color: C.text, marginTop: 8,
  },

  inputRow: {
    display: "flex", alignItems: "flex-end", gap: 8,
    padding: "10px 14px", borderTop: `1px solid ${C.border}`,
  },
  input: {
    flex: 1, minWidth: 0, resize: "none", border: `1px solid ${C.border}`,
    borderRadius: 20, padding: "8px 14px", fontSize: 14,
    fontFamily: "inherit", outline: "none", lineHeight: 1.4,
    maxHeight: 80, overflowY: "auto",
  },
  sendBtn: {
    width: 36, height: 36, borderRadius: "50%", background: C.gradient,
    border: "none", cursor: "pointer", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, transition: "opacity 0.15s",
  },
};
