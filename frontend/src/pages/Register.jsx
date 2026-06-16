import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { C } from "../theme";

const ROLES = [
  { value: "user", label: "User" },
  { value: "agent", label: "Agent" },
];

function BigLogo() {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <span style={{ background: C.primary, color: "#fff", fontWeight: 800, borderRadius: 6, padding: "5px 11px", fontSize: 22 }}>HD</span>
      <span style={{ color: C.text, fontWeight: 700, fontSize: 24 }}>Systems</span>
    </div>
  );
}

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
        <div style={s.logoRow}><BigLogo /></div>
        <h1 style={s.title}>Sign up</h1>
        <p style={s.legal}>Join HD Systems — the tech community for programmers, DevOps, security, and data pros.</p>
        <div style={s.sep} />

        <form onSubmit={handleSubmit} style={s.form}>
          <input style={s.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Display name" required autoFocus />
          <input type="email" style={s.input} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
          <input type="password" style={s.input} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
          <input type="password" style={s.input} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm password" required />
          <div style={s.roleRow}>
            {ROLES.map((r) => (
              <button key={r.value} type="button" onClick={() => setRole(r.value)} style={{ ...s.roleBtn, ...(role === r.value ? s.roleActive : {}) }}>{r.label}</button>
            ))}
          </div>
          {error && <div style={s.error}>{error}</div>}
          <button type="submit" style={s.submit} disabled={loading}>{loading ? "SIGNING UP…" : "SIGN UP"}</button>
        </form>

        <div style={s.foot}>Already a member? <Link to="/login" style={s.footLink}>Log in</Link></div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 },
  card: { width: "100%", maxWidth: 440, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: "48px 40px", boxSizing: "border-box" },
  logoRow: { display: "flex", justifyContent: "center", marginBottom: 24 },
  title: { fontSize: 20, fontWeight: 700, color: C.text, margin: "0 0 8px" },
  legal: { fontSize: 12, color: C.muted, margin: "0 0 16px", lineHeight: 1.5 },
  sep: { borderTop: `1px solid ${C.border}`, margin: "0 0 20px" },
  form: { display: "flex", flexDirection: "column", gap: 14 },
  input: { height: 44, borderRadius: 8, border: `1px solid ${C.border}`, background: C.surfaceHover, padding: "0 14px", fontSize: 16, boxSizing: "border-box", width: "100%", color: C.text },
  roleRow: { display: "flex", gap: 8 },
  roleBtn: { flex: 1, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 0, height: 44, fontSize: 14, fontWeight: 700, color: C.muted, cursor: "pointer" },
  roleActive: { borderColor: C.primary, background: "#ff45001a", color: C.primary },
  error: { background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: 6, padding: "10px 14px", fontSize: 14, color: C.danger },
  submit: { background: C.primary, color: "#fff", border: "none", borderRadius: 20, padding: 0, height: 38, fontSize: 14, fontWeight: 700, textTransform: "uppercase", width: "100%", cursor: "pointer", marginTop: 2 },
  foot: { textAlign: "center", marginTop: 20, fontSize: 14, color: C.muted },
  footLink: { color: C.blue, fontWeight: 700, textDecoration: "none" },
};
