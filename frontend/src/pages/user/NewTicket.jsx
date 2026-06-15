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
      nav(`/ticket/${data.ticket.id}`);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit ticket");
      setLoading(false);
    }
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h2 style={s.title}>Submit a Ticket</h2>
          <div style={s.sub}>Our team typically responds within 24 hours</div>
        </div>
        <Link to="/my-tickets" style={s.backBtn}>← My Tickets</Link>
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
          {loading ? "Submitting…" : "Submit Ticket"}
        </button>
      </form>
    </div>
  );
}

const s = {
  page: { maxWidth: 640, margin: "32px auto", padding: "0 20px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 700, margin: 0 },
  sub: { fontSize: 13, color: "#7a8794", marginTop: 2 },
  backBtn: { color: "#7a8794", textDecoration: "none", fontSize: 14, padding: "6px 0", whiteSpace: "nowrap" },
  err: { background: "#fff5f5", color: "#c53030", border: "1px solid #feb2b2", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 14 },
  card: { background: "#fff", borderRadius: 14, padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,.07)" },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#4a5568", marginBottom: 8 },
  input: { width: "100%", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 12px", fontSize: 14, marginBottom: 20, outline: "none", boxSizing: "border-box", fontFamily: "inherit" },
  priGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 },
  priOption: { display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 14px", borderRadius: 10, border: "2px solid #e2e8f0", cursor: "pointer", transition: "border-color .15s, background .15s" },
  priDot: { width: 10, height: 10, borderRadius: "50%", flexShrink: 0, marginTop: 4 },
  priLabel: { fontWeight: 600, fontSize: 13 },
  priDesc: { fontSize: 11, color: "#7a8794", marginTop: 1 },
  btn: { width: "100%", background: "#16c784", color: "#fff", border: "none", borderRadius: 8, padding: "12px", fontSize: 15, fontWeight: 700, cursor: "pointer" },
};
