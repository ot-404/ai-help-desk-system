// HD Systems shared design tokens — Quora x Stack Exchange hybrid
export const C = {
  bg:       "#ffffff",
  pageBg:   "#f6f6f6",
  surface:  "#ffffff",
  border:   "#e3e6e8",
  divider:  "#d6d9dc",
  primary:  "#0074cc",          // Stack Overflow blue
  primaryHover: "#005999",
  tag:      "#e1ecf4",          // SO tag background
  tagText:  "#39739d",          // SO tag text
  accepted: "#2e7d32",          // green checkmark
  rep:      "#f48024",          // SO orange (reputation/hot)
  text:     "#242729",
  muted:    "#6a737c",
  light:    "#9199a1",
  red:      "#b92b27",          // Quora red (used for destructive only)
  purple:   "#7c3aed",          // AI purple
  surface2: "#f8f9f9",

  // legacy aliases kept for backwards compatibility
  accent:   "#f48024",
  ai:       "#7c3aed",
  tagBg:    "#e1ecf4",
};

export const TYPE_BADGE = {
  Blog:       { bg: "#e1ecf4", color: "#39739d" },
  "Q&A":      { bg: "#e6f6ed", color: "#2e7d32" },
  Tutorial:   { bg: "#f1e9fd", color: "#7c3aed" },
  Discussion: { bg: "#eef0f3", color: "#6a737c" },
};

// Map a KB category to a feed post type label
export function deriveType(cat = "") {
  const c = (cat || "").toLowerCase();
  if (c.includes("blog")) return "Blog";
  if (c.includes("tutorial") || c.includes("guide")) return "Tutorial";
  if (c.includes("faq") || c.includes("q&a") || c.includes("question")) return "Q&A";
  return "Discussion";
}

// Topic groupings, represented as tags (not Reddit communities)
export const COMMUNITIES = [
  "Programming", "DevOps & Cloud", "Cybersecurity", "Databases",
  "Web Development", "Mobile Dev", "AI & Machine Learning", "System Admin",
  "Networking", "Software Architecture", "Career & Jobs", "Open Source",
];

export function communityFor(article) {
  const list = COMMUNITIES;
  const seed = (article?.id ?? 0) + (article?.title?.length ?? 0);
  return list[seed % list.length];
}

export function timeAgo(dateStr) {
  if (!dateStr) return "recently";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
