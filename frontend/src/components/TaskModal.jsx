import { useEffect, useState } from "react";
import { Check, Plus, Trash2, ListTree, Loader2, Circle, CheckCircle2 } from "lucide-react";
import Modal from "./Modal";
import api, { apiError } from "../lib/api";
import { PRIORITY_META } from "../lib/dates";

const PRIORITIES = ["none", "low", "medium", "high"];

export default function TaskModal({ task, lists, open, onClose, onChanged }) {
  const [t, setT] = useState(task);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState("none");
  const [due, setDue] = useState("");
  const [listId, setListId] = useState("");
  const [newSub, setNewSub] = useState("");
  const [breaking, setBreaking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!task) return;
    setT(task);
    setTitle(task.title || "");
    setNotes(task.notes || "");
    setPriority(task.priority || "none");
    setDue(task.due_date || "");
    setListId(task.list_id ? String(task.list_id) : "");
    setError("");
  }, [task]);

  if (!task) return null;
  const data = t || task;

  async function refresh() {
    try {
      const { data } = await api.get(`/tasks/${task.id}`);
      setT(data);
    } catch { /* ignore */ }
    onChanged?.();
  }

  async function save() {
    setSaving(true);
    setError("");
    try {
      await api.patch(`/tasks/${task.id}`, {
        title: title.trim() || task.title,
        notes,
        priority,
        due_date: due || null,
        list_id: listId ? Number(listId) : null,
      });
      await refresh();
      onClose();
    } catch (err) {
      setError(apiError(err, "Could not save."));
    } finally {
      setSaving(false);
    }
  }

  async function toggleMain() {
    await api.post(`/tasks/${task.id}/toggle`);
    await refresh();
  }

  async function addSub(e) {
    e.preventDefault();
    if (!newSub.trim()) return;
    await api.post("/tasks/", { title: newSub.trim(), parent_id: task.id });
    setNewSub("");
    await refresh();
  }

  async function toggleSub(sub) {
    await api.post(`/tasks/${sub.id}/toggle`);
    await refresh();
  }

  async function deleteSub(sub) {
    await api.delete(`/tasks/${sub.id}`);
    await refresh();
  }

  async function breakdown() {
    setBreaking(true);
    try {
      await api.post("/ai/breakdown", { task_id: task.id });
      await refresh();
    } catch (err) {
      setError(apiError(err, "AI breakdown failed."));
    } finally {
      setBreaking(false);
    }
  }

  async function remove() {
    await api.delete(`/tasks/${task.id}`);
    onChanged?.();
    onClose();
  }

  const subs = data.subtasks || [];

  return (
    <Modal open={open} onClose={onClose} title="Task" maxWidth="max-w-xl">
      <div className="space-y-5 p-5">
        {error && <div className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">{error}</div>}

        {/* Title + complete */}
        <div className="flex items-start gap-3">
          <button
            onClick={toggleMain}
            className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
              data.completed ? "border-accent bg-accent text-accent-ink" : "border-line2 text-transparent hover:border-accent"
            }`}
          >
            <Check size={13} strokeWidth={3} className={data.completed ? "" : "opacity-0"} />
          </button>
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            rows={1}
            className="flex-1 resize-none bg-transparent text-lg font-medium text-ink outline-none placeholder:text-faint"
            placeholder="Task title"
          />
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Due date</label>
            <input type="date" className="input" value={due} onChange={(e) => setDue(e.target.value)} />
          </div>
          <div>
            <label className="label">List</label>
            <select className="input" value={listId} onChange={(e) => setListId(e.target.value)}>
              <option value="">Inbox (no list)</option>
              {lists.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="label">Priority</label>
          <div className="flex gap-1.5">
            {PRIORITIES.map((p) => {
              const meta = PRIORITY_META[p];
              const active = priority === p;
              return (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors ${
                    active ? "border-transparent" : "border-line text-muted hover:bg-surface2"
                  }`}
                  style={active ? { background: `${meta.color}1f`, color: meta.color } : undefined}
                >
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="label">Notes</label>
          <textarea
            className="input min-h-[64px] resize-y"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add details…"
          />
        </div>

        {/* Subtasks */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="label mb-0 flex items-center gap-1.5"><ListTree size={14} /> Subtasks</label>
            <button onClick={breakdown} disabled={breaking}
                    className="flex items-center gap-1.5 text-xs font-medium text-accent hover:underline disabled:opacity-50">
              {breaking ? <Loader2 size={13} className="animate-spin" /> : <Sparkle />}
              {breaking ? "Thinking…" : "Break down with AI"}
            </button>
          </div>
          <div className="space-y-1">
            {subs.map((s) => (
              <div key={s.id} className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-surface2">
                <button onClick={() => toggleSub(s)} className="shrink-0 text-faint hover:text-accent">
                  {s.completed ? <CheckCircle2 size={16} className="text-accent" /> : <Circle size={16} />}
                </button>
                <span className={`flex-1 text-sm ${s.completed ? "text-faint line-through" : "text-ink"}`}>{s.title}</span>
                <button onClick={() => deleteSub(s)}
                        className="text-faint opacity-0 transition-opacity hover:text-danger group-hover:opacity-100">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <form onSubmit={addSub} className="mt-1.5 flex items-center gap-2 px-2">
            <Plus size={15} className="text-faint" />
            <input value={newSub} onChange={(e) => setNewSub(e.target.value)}
                   placeholder="Add a subtask"
                   className="flex-1 bg-transparent py-1 text-sm text-ink outline-none placeholder:text-faint" />
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-line pt-4">
          <button onClick={remove} className="btn-subtle text-danger hover:bg-danger/10 hover:text-danger">
            <Trash2 size={15} /> Delete
          </button>
          <div className="flex gap-2">
            <button onClick={onClose} className="btn-ghost">Cancel</button>
            <button onClick={save} disabled={saving} className="btn-primary">
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function Sparkle() {
  return <span className="text-accent">✦</span>;
}
