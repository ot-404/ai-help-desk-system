import { useState } from "react";
import { Plus, Wand2, Loader2 } from "lucide-react";
import api, { apiError } from "../lib/api";

/**
 * Add bar with two modes:
 *  - Plain: creates a task with the typed title.
 *  - AI (Wand): sends the text to /ai/quick-add so the AI extracts date/priority/subtasks.
 */
export default function QuickAdd({ listId, defaultDue, onAdded }) {
  const [text, setText] = useState("");
  const [ai, setAi] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    const value = text.trim();
    if (!value || loading) return;
    setLoading(true);
    setError("");
    try {
      if (ai) {
        await api.post("/ai/quick-add", { text: value, list_id: listId ?? null });
      } else {
        await api.post("/tasks/", {
          title: value,
          list_id: listId ?? null,
          due_date: defaultDue ?? null,
        });
      }
      setText("");
      onAdded?.();
    } catch (err) {
      setError(apiError(err, "Could not add task."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form
        onSubmit={submit}
        className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 focus-within:border-accent/50"
      >
        <button
          type="button"
          onClick={() => setAi((v) => !v)}
          title={ai ? "AI mode on — parses dates & priority" : "AI mode off"}
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
            ai ? "bg-accent/15 text-accent" : "text-faint hover:text-muted"
          }`}
        >
          <Wand2 size={16} />
        </button>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={ai ? "Add a task in plain English — “call dentist tomorrow 2pm”" : "Add a task…"}
          className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-faint"
        />
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="btn-primary h-7 px-2.5 py-0 text-xs disabled:opacity-40"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={15} />}
          <span className="hidden sm:inline">{ai ? "AI add" : "Add"}</span>
        </button>
      </form>
      {error && <p className="mt-1.5 px-1 text-xs text-danger">{error}</p>}
      {ai && (
        <p className="mt-1.5 px-1 text-xs text-faint">
          AI mode extracts due dates, priority and subtasks automatically.
        </p>
      )}
    </div>
  );
}
