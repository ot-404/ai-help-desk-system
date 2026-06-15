import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/client";

const PRIORITIES = [
  { value: "low", label: "Low", color: "#939598" },
  { value: "medium", label: "Medium", color: "#3b82f6" },
  { value: "high", label: "High", color: "#f97316" },
  { value: "urgent", label: "Urgent", color: "#ef4444" },
];

export default function NewTicket() {
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!subject.trim()) { setError("Please enter a question."); return; }
    setSubmitting(true);
    setError("");
    try {
      const { data } = await api.post("/tickets/", { subject, description, priority });
      navigate(`/question/${data.ticket.id}`);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to submit. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={s.page}>
      <Link to="/" style={s.backLink}>← Back to Feed</Link>

      <div style={s.headingSection}>
        <h1 style={s.heading}>Add Question</h1>
        <p style={s.subtitle}>Ask anything — our AI answers instantly</p>
      </div>

      <div style={s.card}>
        <form onSubmit={handleSubmit} style={s.form}>
          <input
            style={s.titleInput}
            placeholder="Start your question with 'What', 'How', 'Why'..."
            value={subject}
            onChange={e => setSubject(e.target.value)}
            maxLength={200}
          />

          <textarea
            style={s.descInput}
            placeholder="Add more details... (optional but helps get better answers)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={5}
          />

          <div style={s.prioritySection}>
            <div style={s.priorityLabel}>Priority</div>
            <div style={s.priorityRow}>
              {PRIORITIES.map(p => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  style={{
                    ...s.priorityBtn,
                    borderColor: priority === p.value ? p.color : "#e8e8e8",
                    background: priority === p.value ? p.color + "18" : "#fff",
                    color: priority === p.value ? p.color : "#555",
                    fontWeight: priority === p.value ? 700 : 400,
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {error && <div style={s.error}>{error}</div>}

          <button type="submit" style={s.submitBtn} disabled={submitting || !subject.trim()}>
            {submitting ? "Submitting..." : "Add Question"}
          </button>
        </form>
      </div>
    </div>
  );
}

const s = {
  page: { maxWidth: 680, margin: "0 auto", paddingBottom: 60 },
  backLink: { color: "#aaa", textDecoration: "none", fontSize: 13, display: "block", marginBottom: 20 },
  headingSection: { marginBottom: 20 },
  heading: { fontSize: 28, fontWeight: 800, color: "#111", margin: "0 0 6px" },
  subtitle: { fontSize: 15, color: "#888", margin: 0 },
  card: {
    background: "#fff", border: "1px solid #e8e8e8",
    borderRadius: 10, padding: "28px 28px",
  },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  titleInput: {
    width: "100%", fontSize: 18, padding: "14px 16px",
    border: "none", borderBottom: "2px solid #e8e8e8",
    outline: "none", boxSizing: "border-box",
    fontFamily: "inherit", fontWeight: 500, color: "#111",
    background: "transparent",
  },
  descInput: {
    width: "100%", fontSize: 15, padding: "12px 16px",
    border: "1px solid #e8e8e8", borderRadius: 8,
    outline: "none", resize: "vertical", fontFamily: "inherit",
    background: "#f7f7f5", boxSizing: "border-box",
    color: "#444", lineHeight: 1.6,
  },
  prioritySection: { display: "flex", flexDirection: "column", gap: 8 },
  priorityLabel: { fontSize: 13, fontWeight: 600, color: "#888" },
  priorityRow: { display: "flex", gap: 8, flexWrap: "wrap" },
  priorityBtn: {
    padding: "7px 20px", borderRadius: 20, border: "1.5px solid #e8e8e8",
    cursor: "pointer", fontSize: 14, background: "#fff",
    transition: "all 0.15s",
  },
  error: {
    background: "#fff5f5", border: "1px solid #fed7d7",
    borderRadius: 8, padding: "10px 14px",
    fontSize: 14, color: "#c53030",
  },
  submitBtn: {
    background: "#16c784", color: "#fff", border: "none",
    borderRadius: 24, padding: "13px 0", fontSize: 16,
    fontWeight: 700, cursor: "pointer", width: "100%",
    marginTop: 4,
  },
};
