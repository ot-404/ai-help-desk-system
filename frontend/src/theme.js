export const C = {
  // Reddit-style surfaces
  bg:       "#dae0e6",      // Reddit's classic light gray page bg
  surface:  "#ffffff",      // cards
  surfaceHover: "#f8f9fa",  // card hover
  nav:      "#1c1c1c",      // dark top navbar (Reddit dark)
  navBorder:"#343536",      // navbar border
  border:   "#edeff1",      // card borders
  divider:  "#edeff1",

  // Brand / actions
  primary:  "#ff4500",      // Reddit orange — upvotes, CTAs, logo accent
  primaryHover: "#e03d00",
  blue:     "#0079d3",      // links, answers, secondary actions
  blueHover:"#006cbf",

  // Text
  text:     "#1c1c1c",
  muted:    "#878a8c",
  light:    "#a8aaab",
  navText:  "#d7dadc",      // text on dark nav

  // Semantic
  success:  "#46d160",      // accepted, resolved
  warning:  "#ffd635",
  danger:   "#ff585b",

  // Tags
  tag:      "#f3f4f6",
  tagText:  "#0079d3",
  tagBorder:"#edeff1",

  // Anonymous
  anon:     "#a8aaab",

  // Legacy aliases (kept so older pages keep compiling)
  primaryBg:   "#ff45001a",
  primaryDark: "#e03d00",
  pageBg:      "#dae0e6",
  accepted:    "#46d160",
  red:         "#ff585b",
  purple:      "#8250df",
  rep:         "#0079d3",
  surface2:    "#f8f9fa",
  accent:      "#0079d3",
  ai:          "#8250df",
  tagBg:       "#f3f4f6",
};

export function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

export const POST_TYPES = ["Question", "Discussion", "Tutorial", "Anonymous Ask"];

export const TOPICS = [
  "Programming", "DevOps & Cloud", "Cybersecurity", "Databases",
  "Web Development", "Mobile Dev", "AI & Machine Learning",
  "System Admin", "Networking", "Software Architecture",
  "Career & Jobs", "Open Source", "Hardware", "Data Science",
];

export const TYPE_BADGE = {
  Question:        { bg: "#e8f4fd", color: "#0079d3" },
  Discussion:      { bg: "#eaeef2", color: "#878a8c" },
  Tutorial:        { bg: "#e6f7ea", color: "#1a7f37" },
  "Anonymous Ask": { bg: "#eaeef2", color: "#878a8c" },
  Blog:            { bg: "#e8f4fd", color: "#0079d3" },
  "Q&A":           { bg: "#e6f7ea", color: "#1a7f37" },
};

export function deriveType(article) {
  if (article?.is_anonymous) return "Anonymous Ask";
  const tags = (article?.tags || []).join(" ").toLowerCase();
  const title = (article?.title || "").toLowerCase();
  if (tags.includes("tutorial") || title.includes("how to")) return "Tutorial";
  if (tags.includes("discussion")) return "Discussion";
  return "Question";
}

// Legacy aliases
export const COMMUNITIES = TOPICS;
export function communityFor(article) {
  const seed = (article?.id ?? 0) + (article?.title?.length ?? 0);
  return TOPICS[seed % TOPICS.length];
}
