import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { C } from "../theme";
import Logo from "../components/Logo";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate(searchParams.get("next") || "/");
    } catch (err) {
      setError(err?.response?.data?.error || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logoRow}><Logo size="lg" /></div>
        <h1 style={s.title}>Sign in to HD Systems</h1>

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input type="email" style={s.input} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required autoFocus />
          </div>
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input type="password" style={s.input} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          {error && <div style={s.error}>{error}</div>}
          <button type="submit" style={s.submit} disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>
        </form>

        <div style={s.foot}>Don't have an account? <Link to="/register" style={s.footLink}>Sign up</Link></div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 },
  card: { width: "100%", maxWidth: 380, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.12)", padding: 32 },
  logoRow: { display: "flex", justifyContent: "center", marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 600, color: C.text, textAlign: "center", margin: "0 0 24px" },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: 13, fontWeight: 600, color: C.text },
  input: { height: 40, borderRadius: 6, border: `1px solid ${C.border}`, padding: "0 12px", fontSize: 16, boxSizing: "border-box", width: "100%" },
  error: { background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: 6, padding: "10px 14px", fontSize: 14, color: C.danger },
  submit: { background: C.primary, color: "#fff", border: "none", borderRadius: 6, padding: "11px 0", fontSize: 15, fontWeight: 600, width: "100%", minHeight: 40, cursor: "pointer" },
  foot: { textAlign: "center", marginTop: 24, fontSize: 14, color: C.muted },
  footLink: { color: C.primary, fontWeight: 600, textDecoration: "none" },
};
