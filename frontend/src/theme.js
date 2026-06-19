export const C = {
  // Minimal light surfaces
  bg:       "#f7f8fa",      // soft neutral page background
  surface:  "#ffffff",      // cards
  surfaceHover: "#f5f6f8",  // card / row hover
  nav:      "#ffffff",      // clean white top navbar
  navBorder:"#e6e8eb",      // navbar hairline border
  border:   "#e6e8eb",      // card borders
  divider:  "#eef0f2",      // lighter inner dividers

  // Brand / actions — emerald→teal identity
  // `gradient` is the brand fill (logo, hero CTAs, avatars, AI, banners);
  // `primary` is the solid teal end, used for the many smaller accents.
  primary:  "#0e7490",      // primary CTAs, active states, upvotes (gradient's teal end)
  primaryHover: "#0b5f78",
  gradient: "linear-gradient(135deg, #059669 0%, #0e7490 100%)",   // emerald → teal, diagonal
  gradientHover: "linear-gradient(135deg, #047857 0%, #0b5f78 100%)",
  blue:     "#0284c7",      // links, secondary actions
  blueHover:"#0369a1",

  // Text
  text:     "#1a1a1e",      // near-black
  muted:    "#6b7280",      // secondary text
  light:    "#9ca3af",      // tertiary / meta text
  navText:  "#374151",      // text on the light nav

  // Semantic
  success:  "#16a34a",      // accepted, resolved
  warning:  "#d97706",
  danger:   "#dc2626",

  // Tags
  tag:      "#f1f2f4",
  tagText:  "#4b5563",
  tagBorder:"#e6e8eb",

  // Anonymous
  anon:     "#9ca3af",

  // Legacy aliases (kept so older pages keep compiling)
  primaryBg:   "#0e74901a",
  primaryDark: "#0b5f78",
  pageBg:      "#f7f8fa",
  accepted:    "#16a34a",
  red:         "#dc2626",
  purple:      "#0e7490",   // AI accents now use the brand teal
  rep:         "#0284c7",
  surface2:    "#f5f6f8",
  accent:      "#0e7490",
  ai:          "#0e7490",
  tagBg:       "#f1f2f4",
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

// Public download link for the Android app (auto-published by GitHub Actions).
export const ANDROID_APK_URL = "https://github.com/ot-404/ai-help-desk-system/releases/download/android-latest/HD-Systems.apk";

export const POST_TYPES = ["Question", "Discussion", "Tutorial", "Anonymous Ask"];

export const TOPICS = [
  "Programming", "DevOps & Cloud", "Cybersecurity", "Databases",
  "Web Development", "Mobile Dev", "AI & Machine Learning",
  "System Admin", "Networking", "Software Architecture",
  "Career & Jobs", "Open Source", "Hardware", "Data Science",
];

export const TYPE_BADGE = {
  Question:        { bg: "#e3f2f6", color: "#0e7490" },
  Discussion:      { bg: "#f1f2f4", color: "#6b7280" },
  Tutorial:        { bg: "#ecfdf3", color: "#16a34a" },
  "Anonymous Ask": { bg: "#f1f2f4", color: "#6b7280" },
  Blog:            { bg: "#eff6ff", color: "#2563eb" },
  "Q&A":           { bg: "#ecfdf3", color: "#16a34a" },
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
