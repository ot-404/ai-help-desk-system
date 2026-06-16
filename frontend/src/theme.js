// HD Systems shared design tokens
export const C = {
  primary: "#0045ac",
  accent: "#ff4500",
  ai: "#7c3aed",
  bg: "#f0f2f5",
  surface: "#ffffff",
  border: "#d7dce2",
  text: "#1c1c1c",
  muted: "#576069",
  light: "#8c9ba5",
  tagBg: "#e8f0fe",
  tagText: "#1a56db",
};

export const TYPE_BADGE = {
  Blog:       { bg: "#e8f0fe", color: "#1a56db" },
  "Q&A":      { bg: "#e6f6ed", color: "#1a7f45" },
  Tutorial:   { bg: "#f1e9fd", color: "#7c3aed" },
  Discussion: { bg: "#eef0f3", color: "#576069" },
};

// Map a KB category to a feed post type + community label
export function deriveType(cat = "") {
  const c = (cat || "").toLowerCase();
  if (c.includes("blog")) return "Blog";
  if (c.includes("tutorial") || c.includes("guide")) return "Tutorial";
  if (c.includes("faq") || c.includes("q&a") || c.includes("question")) return "Q&A";
  return "Discussion";
}

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
