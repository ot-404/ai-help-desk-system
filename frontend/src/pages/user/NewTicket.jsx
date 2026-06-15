import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/client";

const PRIORITIES = [
  { value: "low",    label: "Low",    desc: "Minor issue, no urgency" },
  { value: "medium", label: "Medium", desc: "Affects work, workaround exists" },
  { value: "high",   label: "High",   desc: "Significantly impacting work" },
  { value: "urgent", label: "Urgent", desc: "Completely blocking, critical" },
];

const PRI_COLOR = { low: "#48bb78", medium: "#ecc94b", high: "#ed8936", urgent: "#e53e3e" };

export default function NewTicket() {
  const nav = useNavigate();
  const [form, setForm] = useState({ subject: "", description: "", priority: "medium" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set(k) { return e => setForm(f => ({ ...f, [k]: e.target.value })); }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/tickets/", { ...form, auto_answer: true });
      nav(`/question/${data.ticket.id}`);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit question");
      setLoading(false);
    }
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h2 style={s.title}>Ask a Question</h2>
          <div style={s.sub}>Our AI responds instantly, and our team follows up within 24 hours</div>
        </div>
        <Link to="/my-questions" style={s.backBtn}>← My Questions</Link>
      </div>

      {error && <div style={s.err}>{error}</div>}

      <form onSubmit={submit} style={s.card}>
        <label style={s.label}>Subject</label>
        <input
          style={s.input}
          value={form.subject}
          onChange={set("subject")}
          required
          maxLength={255}
          placeholder="Brief summary of your issue"
        />

        <label style={s.label}>Description</label>
        <textarea
          style={{ ...s.input, height: 130, resize: "vertical" }}
          value={form.description}
          onChange={set("description")}
          required
          placeholder="Describe the problem in detail — what happened, what you expected, and any steps to reproduce"
        />

        <label style={s.label}>Priority</label>
        <div style={s.priGrid}>
          {PRIORITIES.map(p => (
            <label key={p.value} style={{
              ...s.priOption,
              ...(form.priority === p.value ? { borderColor: PRI_COLOR[p.value], background: PRI_COLOR[p.value] + "11" } : {}),
            }}>
              <input
                type="radio"
                name="priority"
                value={p.value}
                checked={form.priority === p.value}
                onChange={set("priority")}
                style={{ display: "none" }}
              />
              <span style={{ ...s.priDot, background: PRI_COLOR[p.value] }} />
              <div>
                <div style={s.priLabel}>{p.label}</div>
                <div style={s.priDesc}>{p.desc}</div>
              </div>
            </label>
          ))}
        </div>

        <button style={s.btn} disabled={loading}>
          {loading ? "Submitting question…" : "Submit Question"}
        </button>
      </form>
    </div>
  );
}

const s = {
  page: { paddingTop: 16 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  title: { fontSize: 22, fontWeight: 700, margin: 0, color: "#282829" },
  sub: { fontSize: 13, color: "#939598", marginTop: 2 },
  backBtn: { color: "#939598", textDecoration: "none", fontSize: 14, padding: "6px 0", whiteSpace: "nowrap" },
  err: { background: "#fff5f5", color: "#c53030", border: "1px solid #fed7d7", borderRadius: 6, padding: "10px 14px", marginBottom: 16, fontSize: 14 },
  card: { background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8, padding: "24px" },
  label: { display: "block", fontSize: 14, fontWeight: 600, color: "#282829", marginBottom: 6 },
  input: { width: "100%", border: "1px solid #ccc", borderRadius: 4, padding: "10px 12px", fontSize: 14, marginBottom: 18, outline: "none", boxSizing: "border-box", fontFamily: "inherit", color: "#282829" },
  priGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 },
  priOption: { display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 14px", borderRadius: 6, border: "2px solid #e8e8e8", cursor: "pointer", transition: "border-color .15s, background .15s" },
  priDot: { width: 10, height: 10, borderRadius: "50%", flexShrink: 0, marginTop: 4 },
  priLabel: { fontWeight: 600, fontSize: 13, color: "#282829" },
  priDesc: { fontSize: 11, color: "#939598", marginTop: 1 },
  btn: { width: "100%", background: "#16c784", color: "#fff", border: "none", borderRadius: 20, padding: "12px", fontSize: 15, fontWeight: 700, cursor: "pointer" },
};
