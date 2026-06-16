// HD Systems design tokens — GitHub Issues meets Hacker News: clean, minimal.
export const C = {
  // Surfaces
  bg:       "#f6f8fa",   // page background (very light gray)
  surface:  "#ffffff",   // cards, panels
  border:   "#d0d7de",   // borders
  divider:  "#eaeef2",   // subtle dividers

  // Brand
  primary:     "#0969da",   // links, active states, buttons
  primaryDark: "#0550ae",   // button hover
  primaryBg:   "#ddf4ff",   // light blue tint backgrounds

  // Text
  text:    "#1f2328",   // primary text
  muted:   "#656d76",   // secondary / meta text
  light:   "#8c959f",   // placeholders, timestamps

  // Semantic
  success: "#1a7f37",   // resolved, accepted, green
  warning: "#9a6700",   // pending
  danger:  "#d1242f",   // errors

  // Tags
  tag:     "#ddf4ff",
  tagText: "#0550ae",
  tagBorder: "#54aeff",

  // Legacy aliases (kept so older pages keep compiling)
  pageBg:       "#f6f8fa",
  primaryHover: "#0550ae",
  accepted:     "#1a7f37",
  red:          "#d1242f",
  purple:       "#8250df",
  rep:          "#0969da",
  surface2:     "#f6f8fa",
  accent:       "#0969da",
  ai:           "#8250df",
  tagBg:        "#ddf4ff",
};

export const TYPE_BADGE = {
  Blog:       { bg: "#ddf4ff", color: "#0550ae" },
  "Q&A":      { bg: "#dafbe1", color: "#1a7f37" },
  Tutorial:   { bg: "#fbefff", color: "#8250df" },
  Discussion: { bg: "#eaeef2", color: "#656d76" },
};

export function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function deriveType(article) {
  const tags = (article.tags || []).join(" ").toLowerCase();
  const title = (article.title || "").toLowerCase();
  if (tags.includes("tutorial") || title.includes("how to")) return "Tutorial";
  if (tags.includes("blog")) return "Blog";
  if (tags.includes("discussion")) return "Discussion";
  return "Q&A";
}

export const COMMUNITIES = [
  "Programming","DevOps & Cloud","Cybersecurity","Databases",
  "Web Development","Mobile Dev","AI & Machine Learning",
  "System Admin","Networking","Software Architecture",
  "Career & Jobs","Open Source",
];

export function communityFor(article) {
  const seed = (article?.id ?? 0) + (article?.title?.length ?? 0);
  return COMMUNITIES[seed % COMMUNITIES.length];
}
