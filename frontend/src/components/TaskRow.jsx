import { Check, ListTree, Sparkles } from "lucide-react";
import { dueLabel, dueTone, PRIORITY_META } from "../lib/dates";

export default function TaskRow({ task, listMeta, onToggle, onOpen }) {
  const prio = PRIORITY_META[task.priority] || PRIORITY_META.none;
  const subs = task.subtasks || [];
  const doneSubs = subs.filter((s) => s.completed).length;
  const due = dueLabel(task.due_date);

  return (
    <div
      className="group flex items-center gap-3 rounded-lg px-2.5 py-2.5 transition-colors hover:bg-surface2"
      onClick={() => onOpen(task)}
      role="button"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle(task);
        }}
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
        className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border transition-colors ${
          task.completed
            ? "border-accent bg-accent text-accent-ink"
            : "border-line2 text-transparent hover:border-accent"
        }`}
      >
        <Check size={12} strokeWidth={3} />
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={`truncate text-sm ${task.completed ? "text-faint line-through" : "text-ink"}`}>
            {task.title}
          </span>
          {task.ai_created && !task.completed && (
            <Sparkles size={12} className="shrink-0 text-accent/70" />
          )}
        </div>
        {(due || subs.length > 0 || listMeta) && (
          <div className="mt-0.5 flex items-center gap-2.5 text-xs">
            {due && <span className={dueTone(task.due_date, task.completed)}>{due}</span>}
            {subs.length > 0 && (
              <span className="flex items-center gap-1 text-faint">
                <ListTree size={12} /> {doneSubs}/{subs.length}
              </span>
            )}
            {listMeta && (
              <span className="flex items-center gap-1 text-faint">
                <span className="h-2 w-2 rounded-full" style={{ background: listMeta.color }} />
                {listMeta.name}
              </span>
            )}
          </div>
        )}
      </div>

      {task.priority !== "none" && (
        <span
          className="shrink-0 rounded px-1.5 py-0.5 text-[11px] font-medium"
          style={{ color: prio.color, background: `${prio.color}1a` }}
        >
          {prio.label}
        </span>
      )}
    </div>
  );
}
