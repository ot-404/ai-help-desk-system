// Date helpers — everything works in local time on plain YYYY-MM-DD strings.

export function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function parseISO(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function daysFromToday(iso) {
  const target = parseISO(iso);
  if (!target) return null;
  const now = new Date();
  const a = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target - a) / 86400000);
}

export function dueLabel(iso) {
  const diff = daysFromToday(iso);
  if (diff === null) return null;
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  if (diff < -1) return `${Math.abs(diff)}d overdue`;
  if (diff < 7) {
    return parseISO(iso).toLocaleDateString(undefined, { weekday: "long" });
  }
  return parseISO(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function dueTone(iso, completed) {
  if (completed) return "text-faint";
  const diff = daysFromToday(iso);
  if (diff === null) return "text-faint";
  if (diff < 0) return "text-danger";
  if (diff === 0) return "text-accent";
  return "text-muted";
}

export const PRIORITY_META = {
  high: { label: "High", color: "#F87171", dot: "#F87171" },
  medium: { label: "Medium", color: "#FBBF24", dot: "#FBBF24" },
  low: { label: "Low", color: "#60A5FA", dot: "#60A5FA" },
  none: { label: "None", color: "#6A7385", dot: "transparent" },
};
