import { useEffect, useRef, useState } from "react";
import { Sparkles, X, Send, Loader2, CalendarCheck, ListChecks } from "lucide-react";
import api, { apiError } from "../lib/api";

const SUGGESTIONS = [
  "What should I focus on today?",
  "Help me prioritise my tasks",
  "Plan my week",
];

export default function AIAssistant({ seed, onClose, onMutated }) {
  const open = !!seed;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const lastSeed = useRef(0);
  const scrollRef = useRef(null);

  // React to a new "seed" (assistant opened, optionally with an action).
  useEffect(() => {
    if (!seed || seed.n === lastSeed.current) return;
    lastSeed.current = seed.n;
    if (seed.type === "plan") runPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function runPlan() {
    setLoading(true);
    setMessages((m) => [...m, { role: "user", content: "Plan my day" }]);
    try {
      const { data } = await api.post("/ai/plan");
      setMessages((m) => [...m, { role: "assistant", content: data.message, items: data.items }]);
    } catch (err) {
      setMessages((m) => [...m, { role: "assistant", content: apiError(err, "Couldn't build a plan right now.") }]);
    } finally {
      setLoading(false);
    }
  }

  async function send(text) {
    const value = (text ?? input).trim();
    if (!value || loading) return;
    const next = [...messages, { role: "user", content: value }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const { data } = await api.post("/ai/chat", {
        messages: next.map((m) => ({ role: m.role, content: m.content })),
      });
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages((m) => [...m, { role: "assistant", content: apiError(err, "I hit an error. Try again.") }]);
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-md flex-col border-l border-line bg-surface animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/15 text-accent">
              <Sparkles size={16} />
            </span>
            <div>
              <p className="text-sm font-medium text-ink">Lumo AI</p>
              <p className="text-xs text-faint">Knows your tasks</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-faint hover:bg-surface2 hover:text-ink">
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
          {messages.length === 0 && !loading && (
            <div className="pt-6 text-center">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Sparkles size={22} />
              </div>
              <p className="text-sm font-medium text-ink">How can I help?</p>
              <p className="mx-auto mt-1 max-w-[15rem] text-xs text-muted">
                Ask me to plan your day, prioritise, or think through a project.
              </p>
              <div className="mt-5 flex flex-col gap-2">
                <button onClick={runPlan} className="btn-ghost justify-start text-sm">
                  <CalendarCheck size={15} className="text-accent" /> Plan my day
                </button>
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)} className="btn-ghost justify-start text-sm">
                    <ListChecks size={15} className="text-faint" /> {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <Bubble key={i} message={m} />
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted">
              <Loader2 size={15} className="animate-spin text-accent" /> Thinking…
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => { e.preventDefault(); send(); }}
          className="flex items-center gap-2 border-t border-line p-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message Lumo AI…"
            className="input"
          />
          <button type="submit" disabled={loading || !input.trim()} className="btn-primary h-9 w-9 shrink-0 p-0">
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

function Bubble({ message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isUser ? "bg-accent/15 text-ink" : "border border-line bg-elevated text-ink"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {message.items?.length > 0 && (
          <ol className="mt-2.5 space-y-1.5 border-t border-line pt-2.5">
            {message.items.map((it, idx) => (
              <li key={it.id} className="flex gap-2 text-sm">
                <span className="font-medium text-accent">{idx + 1}.</span>
                <span className="text-ink">{it.title}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
