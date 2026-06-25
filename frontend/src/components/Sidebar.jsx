import { NavLink } from "react-router-dom";
import {
  CalendarCheck, CalendarDays, Layers, Inbox, CheckCircle2,
  Plus, Settings2, LogOut, Sparkles,
} from "lucide-react";
import Logo from "./Logo";
import { iconFor } from "../lib/icons";

const NAV = [
  { to: "/app/today", label: "Today", icon: CalendarCheck, key: "today" },
  { to: "/app/upcoming", label: "Upcoming", icon: CalendarDays, key: "upcoming" },
  { to: "/app/all", label: "All tasks", icon: Layers, key: "all" },
  { to: "/app/inbox", label: "Inbox", icon: Inbox, key: "inbox" },
  { to: "/app/completed", label: "Completed", icon: CheckCircle2, key: null },
];

export default function Sidebar({ lists, counts, user, onNavigate, onNewList, onEditList, onLogout, onOpenAssistant }) {
  return (
    <div className="flex h-full flex-col bg-elevated">
      <div className="px-4 pb-2 pt-5">
        <Logo size={28} />
      </div>

      <nav className="px-3 py-2">
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            onClick={onNavigate}
            className={({ isActive }) => `nav-item ${isActive ? "nav-item-active" : ""}`}
          >
            <n.icon size={17} className="shrink-0" />
            <span className="flex-1">{n.label}</span>
            {n.key && counts?.[n.key] > 0 && (
              <span className="rounded-md bg-surface2 px-1.5 text-xs text-muted">{counts[n.key]}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mx-3 my-2 border-t border-line" />

      <div className="flex items-center justify-between px-5 py-1.5">
        <span className="text-xs font-medium uppercase tracking-wide text-faint">Lists</span>
        <button onClick={onNewList} className="text-faint hover:text-accent" title="New list">
          <Plus size={15} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-2">
        {lists.length === 0 && (
          <p className="px-3 py-2 text-xs text-faint">No lists yet. Create one to group tasks.</p>
        )}
        {lists.map((l) => {
          const Ic = iconFor(l.icon);
          return (
            <NavLink
              key={l.id}
              to={`/app/list/${l.id}`}
              onClick={onNavigate}
              className={({ isActive }) => `nav-item group ${isActive ? "nav-item-active" : ""}`}
            >
              <Ic size={16} className="shrink-0" style={{ color: l.color }} />
              <span className="flex-1 truncate">{l.name}</span>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEditList(l); }}
                className="text-faint opacity-0 hover:text-ink group-hover:opacity-100"
              >
                <Settings2 size={13} />
              </button>
              {l.task_count > 0 && (
                <span className="rounded-md bg-surface2 px-1.5 text-xs text-muted">{l.task_count}</span>
              )}
            </NavLink>
          );
        })}
      </div>

      <div className="border-t border-line p-3">
        <button onClick={onOpenAssistant}
                className="mb-2 flex w-full items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-sm font-medium text-accent transition hover:bg-accent/15">
          <Sparkles size={16} /> Ask Lumo AI
        </button>
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface2 text-xs font-medium text-muted">
            {(user?.name || "U").slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-ink">{user?.name}</p>
            <p className="truncate text-xs text-faint">{user?.email}</p>
          </div>
          <button onClick={onLogout} className="text-faint hover:text-danger" title="Log out">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
