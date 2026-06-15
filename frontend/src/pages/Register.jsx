import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useIsMobile } from "../hooks/useIsMobile";

export default function Register() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      await api.post("/auth/register", { name, email, password });
      navigate("/login?registered=1");
    } catch (err) {
      setError(err?.response?.data?.error || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const formPanel = (
    <div style={s.formPanel}>
      <div style={s.formInner}>
        <h2 style={s.formTitle}>Join AI Help Desk</h2>

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Full Name</label>
            <input
              style={s.input}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Jane Smith"
              required
              autoFocus
            />
          </div>
          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input
              type="email"
              style={s.input}
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input
              type="password"
              style={s.input}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <div style={s.field}>
            <label style={s.label}>Confirm Password</label>
            <input
              type="password"
              style={s.input}
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div style={s.errorBox}>{error}</div>}

          <button type="submit" style={s.submitBtn} disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div style={s.dividerRow}>
          <div style={s.dividerLine} />
          <span style={s.dividerText}>Already have an account?</span>
          <div style={s.dividerLine} />
        </div>

        <Link to="/login" style={s.signinBtn}>Sign in</Link>
      </div>
    </div>
  );

  if (isMobile) return formPanel;

  return (
    <div style={s.page}>
      {/* Left brand column */}
      <div style={s.brandPanel}>
        <div style={s.brandContent}>
          <div style={s.brandLogo}>AHD</div>
          <h1 style={s.brandHeading}>The place to get expert answers</h1>
          <p style={s.brandSub}>Questions get answered by AI and expert support staff</p>
          <ul style={s.featureList}>
            <li style={s.featureItem}>
              <span style={s.checkmark}>✓</span>
              Instant AI-powered answers
            </li>
            <li style={s.featureItem}>
              <span style={s.checkmark}>✓</span>
              Expert human support when needed
            </li>
            <li style={s.featureItem}>
              <span style={s.checkmark}>✓</span>
              Knowledge base built from real questions
            </li>
          </ul>
        </div>
      </div>

      {formPanel}
    </div>
  );
}

const s = {
  page: { display: "flex", minHeight: "100vh" },
  brandPanel: {
    flex: "0 0 60%", background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: 48,
  },
  brandContent: { maxWidth: 480, color: "#fff" },
  brandLogo: {
    background: "#16c784", color: "#fff", fontWeight: 800,
    fontSize: 22, borderRadius: 8, padding: "6px 14px",
    display: "inline-block", marginBottom: 32, letterSpacing: 1,
  },
  brandHeading: {
    fontSize: 38, fontWeight: 800, color: "#fff",
    margin: "0 0 16px", lineHeight: 1.2,
  },
  brandSub: { fontSize: 18, color: "rgba(255,255,255,0.75)", margin: "0 0 32px", lineHeight: 1.5 },
  featureList: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 },
  featureItem: { display: "flex", alignItems: "center", gap: 12, fontSize: 16, color: "rgba(255,255,255,0.85)" },
  checkmark: {
    width: 24, height: 24, borderRadius: "50%", background: "#16c784",
    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 13, fontWeight: 700, flexShrink: 0,
  },
  formPanel: {
    flex: "0 0 40%", background: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: 32,
  },
  formInner: { width: "100%", maxWidth: 340 },
  formTitle: { fontSize: 24, fontWeight: 800, color: "#111", margin: "0 0 24px" },
  form: { display: "flex", flexDirection: "column", gap: 14 },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: 13, fontWeight: 600, color: "#555" },
  input: {
    height: 42, borderRadius: 8, border: "1px solid #e8e8e8",
    padding: "0 14px", fontSize: 15, outline: "none",
    boxSizing: "border-box", width: "100%",
  },
  errorBox: {
    background: "#fff5f5", border: "1px solid #fed7d7",
    borderRadius: 8, padding: "10px 14px",
    fontSize: 14, color: "#c53030",
  },
  submitBtn: {
    background: "#16c784", color: "#fff", border: "none",
    borderRadius: 24, padding: "13px 0", fontSize: 15,
    fontWeight: 700, cursor: "pointer", width: "100%",
    marginTop: 4,
  },
  dividerRow: { display: "flex", alignItems: "center", gap: 8, margin: "20px 0" },
  dividerLine: { flex: 1, height: 1, background: "#e8e8e8" },
  dividerText: { fontSize: 13, color: "#aaa", whiteSpace: "nowrap" },
  signinBtn: {
    display: "block", textAlign: "center", padding: "12px 0",
    border: "1.5px solid #ccc", borderRadius: 24, fontSize: 15,
    color: "#333", textDecoration: "none", fontWeight: 600,
  },
};
