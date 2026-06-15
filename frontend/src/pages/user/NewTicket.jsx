import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";

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
      setError(err.response?.data?.error || "Failed to submit");
      setLoading(false);
    }
  }

  return (
    <div style={s.page}>
      <h2 style={s.title}>Submit a Ticket</h2>
      {error && <div style={s.err}>{error}</div>}
      <form onSubmit={submit} style={s.card}>
        <label style={s.label}>Subject</label>
        <input style={s.input} value={form.subject} onChange={set("subject")} required placeholder="Brief summary of your issue" />

        <label style={s.label}>Description</label>
        <textarea style={{ ...s.input, height: 120, resize: "vertical" }} value={form.description} onChange={set("description")} required placeholder="Describe the problem in detail…" />

        <label style={s.label}>Priority</label>
        <select style={s.input} value={form.priority} onChange={set("priority")}>
          {["low", "medium", "high", "urgent"].map(p => <option key={p}>{p}</option>)}
        </select>

        <button style={s.btn} disabled={loading}>{loading ? "Submitting…" : "Submit Ticket"}</button>
      </form>
    </div>
  );
}

const s = {
  page: { maxWidth: 600, margin: "32px auto", padding: "0 20px" },
  title: { fontSize: 20, fontWeight: 700, marginBottom: 20 },
  err: { background: "#fff5f5", color: "#c53030", border: "1px solid #feb2b2", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 14 },
  card: { background: "#fff", borderRadius: 14, padding: "28px 28px", boxShadow: "0 2px 12px rgba(0,0,0,.07)" },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#4a5568", marginBottom: 6 },
  input: { width: "100%", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 12px", fontSize: 14, marginBottom: 18, outline: "none", boxSizing: "border-box", fontFamily: "inherit" },
  btn: { background: "#16c784", color: "#fff", border: "none", borderRadius: 8, padding: "12px 24px", fontSize: 15, fontWeight: 700, cursor: "pointer" },
};
