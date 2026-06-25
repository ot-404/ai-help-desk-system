import { useCallback, useEffect, useMemo, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import {
  CalendarCheck, CalendarDays, Layers, Inbox, CheckCircle2, Sparkles,
} from "lucide-react";
import QuickAdd from "../components/QuickAdd";
import TaskRow from "../components/TaskRow";
import TaskModal from "../components/TaskModal";
import EmptyState from "../components/EmptyState";
import api from "../lib/api";
import { todayISO } from "../lib/dates";
import { iconFor } from "../lib/icons";

const VIEW_META = {
  today: { label: "Today", icon: CalendarCheck, empty: "Nothing due today", emptyBody: "Add a task or enjoy the clear day." },
  upcoming: { label: "Upcoming", icon: CalendarDays, empty: "Nothing upcoming", emptyBody: "Tasks with a future due date show up here." },
  all: { label: "All tasks", icon: Layers, empty: "No open tasks", emptyBody: "You're all caught up. Add something new." },
  inbox: { label: "Inbox", icon: Inbox, empty: "Inbox zero", emptyBody: "Tasks without a list land here." },
  completed: { label: "Completed", icon: CheckCircle2, empty: "Nothing completed yet", emptyBody: "Finished tasks collect here." },
};

export default function TasksView({ view }) {
  const { lists, refreshMeta } = useOutletContext();
  const params = useParams();
  const isList = view === "list";
  const listId = isList ? Number(params.id) : null;
  const list = useMemo(() => lists.find((l) => l.id === listId), [lists, listId]);
  const listsById = useMemo(() => Object.fromEntries(lists.map((l) => [l.id, l])), [lists]);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const meta = isList
    ? { label: list?.name || "List", icon: iconFor(list?.icon), empty: "This list is empty", emptyBody: "Add the first task to this list." }
    : VIEW_META[view];

  const fetchTasks = useCallback(async () => {
    const query = isList ? `view=all&list_id=${listId}` : `view=${view}`;
    setLoading(true);
    try {
      const { data } = await api.get(`/tasks/?${query}`);
      setTasks(data);
    } finally {
      setLoading(false);
    }
  }, [view, isList, listId]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const refreshAll = useCallback(async () => {
    await Promise.all([fetchTasks(), refreshMeta()]);
  }, [fetchTasks, refreshMeta]);

  async function toggle(task) {
    await api.post(`/tasks/${task.id}/toggle`);
    await refreshAll();
  }

  const Icon = meta?.icon || Layers;
  const showAdd = view !== "completed";
  const dateSub = view === "today"
    ? new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })
    : null;

  return (
    <div>
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface2"
          style={isList && list ? { color: list.color } : { color: "#2DD4BF" }}
        >
          <Icon size={19} />
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-xl font-semibold tracking-tight text-ink">{meta?.label}</h1>
          {dateSub && <p className="text-xs text-muted">{dateSub}</p>}
        </div>
        <span className="ml-auto text-sm text-faint">{tasks.length}</span>
      </div>

      {showAdd && (
        <div className="mb-5">
          <QuickAdd
            listId={listId}
            defaultDue={view === "today" ? todayISO() : null}
            onAdded={refreshAll}
          />
        </div>
      )}

      {/* Tasks */}
      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => <div key={i} className="skeleton h-12 w-full" />)}
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState icon={meta?.icon || Sparkles} title={meta?.empty} body={meta?.emptyBody} />
      ) : (
        <div className="-mx-2.5">
          {tasks.map((t) => (
            <TaskRow
              key={t.id}
              task={t}
              listMeta={!isList && t.list_id ? listsById[t.list_id] : null}
              onToggle={toggle}
              onOpen={setSelected}
            />
          ))}
        </div>
      )}

      <TaskModal
        task={selected}
        lists={lists}
        open={!!selected}
        onClose={() => setSelected(null)}
        onChanged={refreshAll}
      />
    </div>
  );
}
