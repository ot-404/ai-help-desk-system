import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { C } from "../theme";
import Logo from "../components/Logo";

const ROLES = [
  { value: "user", label: "User" },
  { value: "agent", label: "Agent" },
];

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      await api.post("/auth/register", { name, email, password, role });
      navigate("/login?registered=1");
    } catch (err) {
      setError(err?.response?.data?.error || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logoRow}><Logo size="lg" /></div>
        <h1 style={s.title}>Create your account</h1>

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Name</label>
            <input style={s.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Smith" required autoFocus />
          </div>
          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input type="email" style={s.input} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input type="password" style={s.input} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <div style={s.field}>
            <label style={s.label}>Confirm Password</label>
            <input type="password" style={s.input} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" required />
          </div>
          <div style={s.field}>
            <label style={s.label}>Account type</label>
            <div style={s.roleRow}>
              {ROLES.map((r) => (
                <button key={r.value} type="button" onClick={() => setRole(r.value)} style={{ ...s.roleBtn, ...(role === r.value ? s.roleActive : {}) }}>{r.label}</button>
              ))}
            </div>
          </div>
          {error && <div style={s.error}>{error}</div>}
          <button type="submit" style={s.submit} disabled={loading}>{loading ? "Creating account…" : "Create account"}</button>
        </form>

        <div style={s.foot}>Already have an account? <Link to="/login" style={s.footLink}>Sign in</Link></div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 },
  card: { width: "100%", maxWidth: 380, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.12)", padding: 32 },
  logoRow: { display: "flex", justifyContent: "center", marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 600, color: C.text, textAlign: "center", margin: "0 0 24px" },
  form: { display: "flex", flexDirection: "column", gap: 14 },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: 13, fontWeight: 600, color: C.text },
  input: { height: 40, borderRadius: 6, border: `1px solid ${C.border}`, padding: "0 12px", fontSize: 16, boxSizing: "border-box", width: "100%" },
  roleRow: { display: "flex", gap: 8 },
  roleBtn: { flex: 1, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: "9px 0", fontSize: 14, fontWeight: 600, color: C.muted, minHeight: 40, cursor: "pointer" },
  roleActive: { borderColor: C.primary, background: C.primaryBg, color: C.primary },
  error: { background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: 6, padding: "10px 14px", fontSize: 14, color: C.danger },
  submit: { background: C.primary, color: "#fff", border: "none", borderRadius: 6, padding: "11px 0", fontSize: 15, fontWeight: 600, width: "100%", minHeight: 40, cursor: "pointer", marginTop: 4 },
  foot: { textAlign: "center", marginTop: 24, fontSize: 14, color: C.muted },
  footLink: { color: C.primary, fontWeight: 600, textDecoration: "none" },
};
