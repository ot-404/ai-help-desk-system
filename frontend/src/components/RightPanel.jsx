import { Link } from "react-router-dom";
import { useIsMobile } from "../hooks/useIsMobile";
import { C } from "../theme";

const TRENDING = ["javascript", "python", "devops", "kubernetes", "security", "rust", "react", "systemdesign"];

const RULES = [
  "Be respectful — no personal attacks.",
  "Stay on topic and tech-focused.",
  "No spam or self-promotion.",
  "Search before posting duplicates.",
  "Cite sources for technical claims.",
];

export default function RightPanel() {
  const isMobile = useIsMobile();
  if (isMobile) return null;

  return (
    <aside style={s.panel}>
      <div style={s.ctaCard}>
        <Link to="/new-question" style={s.blueBtn}>Create Post</Link>
        <Link to="/ask" style={s.purpleBtn}>Ask AI</Link>
      </div>

      <div style={s.card}>
        <div style={s.title}>Trending Topics</div>
        <div style={s.tags}>
          {TRENDING.map((t) => (
            <Link key={t} to={`/help?q=${t}`} style={s.tag}>#{t}</Link>
          ))}
        </div>
      </div>

      <div style={s.card}>
        <div style={s.title}>Community Rules</div>
        <ol style={s.rules}>
          {RULES.map((r, i) => (
            <li key={i} style={s.rule}>{r}</li>
          ))}
        </ol>
      </div>

      <div style={s.card}>
        <div style={s.title}>About HD Systems</div>
        <div style={s.about}>The hub for tech professionals.</div>
        <div style={s.statRow}><span style={s.statLabel}>Members</span><span style={s.statVal}>48.2k</span></div>
        <div style={s.statRow}><span style={s.statLabel}>Online</span><span style={{ ...s.statVal, color: "#1a7f45" }}>1,204</span></div>
        <div style={s.statRow}><span style={s.statLabel}>Posts today</span><span style={s.statVal}>312</span></div>
      </div>
    </aside>
  );
}

const s = {
  panel: { width: 280, flexShrink: 0, paddingTop: 16, position: "sticky", top: 60, height: "calc(100vh - 60px)", overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 },
  ctaCard: { display: "flex", flexDirection: "column", gap: 8 },
  blueBtn: { background: C.primary, color: "#fff", textAlign: "center", padding: "10px 0", borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: "none" },
  purpleBtn: { background: C.ai, color: "#fff", textAlign: "center", padding: "10px 0", borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: "none" },
  card: { background: C.surface, border: "1px solid " + C.border, borderRadius: 8, padding: 14 },
  title: { fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 10 },
  tags: { display: "flex", flexWrap: "wrap", gap: 6 },
  tag: { background: C.tagBg, color: C.tagText, fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 20, textDecoration: "none" },
  rules: { margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 6 },
  rule: { fontSize: 12.5, color: C.muted, lineHeight: 1.4 },
  about: { fontSize: 13, color: C.muted, marginBottom: 12 },
  statRow: { display: "flex", justifyContent: "space-between", padding: "5px 0", borderTop: "1px solid " + C.bg },
  statLabel: { fontSize: 13, color: C.muted },
  statVal: { fontSize: 14, fontWeight: 700, color: C.text },
};
