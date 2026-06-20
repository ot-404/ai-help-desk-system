import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { C } from "../theme";

function BigLogo() {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <span style={{ background: C.gradient, color: "#fff", fontWeight: 800, borderRadius: 8, padding: "5px 11px", fontSize: 22 }}>Ask</span>
      <span style={{ color: C.text, fontWeight: 700, fontSize: 24 }}>ora</span>
    </div>
  );
}

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
        <div style={s.logoRow}><BigLogo /></div>
        <h1 style={s.title}>Log in</h1>
        <p style={s.legal}>
          By continuing, you agree to our <a href="#" style={s.legalLink}>User Agreement</a> and <a href="#" style={s.legalLink}>Privacy Policy</a>.
        </p>
        <div style={s.sep} />

        <form onSubmit={handleSubmit} style={s.form}>
          <input type="email" style={s.input} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required autoFocus />
          <input type="password" style={s.input} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
          {error && <div style={s.error}>{error}</div>}
          <button type="submit" style={s.submit} disabled={loading}>{loading ? "Logging in…" : "Log in"}</button>
        </form>

        <Link to="/forgot-password" style={s.forgot}>Forgot password?</Link>

        <div style={s.divider}><span style={s.dividerText}>New to Askora?</span></div>

        <Link to="/register" style={s.signupBtn}>Create an account</Link>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: C.bg, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "clamp(24px, 8vh, 80px) 16px", overflowY: "auto" },
  card: { width: "100%", maxWidth: 420, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "44px 36px", boxSizing: "border-box", boxShadow: "0 4px 24px rgba(0,0,0,0.04)" },
  logoRow: { display: "flex", justifyContent: "center", marginBottom: 24 },
  title: { fontSize: 21, fontWeight: 700, color: C.text, margin: "0 0 8px", letterSpacing: -0.3 },
  legal: { fontSize: 12, color: C.muted, margin: "0 0 16px", lineHeight: 1.5 },
  legalLink: { color: C.blue, textDecoration: "underline" },
  sep: { borderTop: `1px solid ${C.border}`, margin: "0 0 20px" },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  input: { height: 46, borderRadius: 10, border: `1px solid ${C.border}`, background: C.surfaceHover, padding: "0 14px", fontSize: 16, boxSizing: "border-box", width: "100%", color: C.text },
  error: { background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 14, color: C.danger },
  submit: { background: C.gradient, color: "#fff", border: "none", borderRadius: 10, padding: 0, height: 44, fontSize: 15, fontWeight: 600, width: "100%", cursor: "pointer", marginTop: 2 },
  forgot: { display: "inline-block", marginTop: 16, color: C.blue, fontSize: 13, fontWeight: 600, textDecoration: "none" },
  divider: { display: "flex", alignItems: "center", textAlign: "center", margin: "20px 0", color: C.light },
  dividerText: { flex: 1, fontSize: 12, fontWeight: 600, position: "relative" },
  signupBtn: { display: "block", textAlign: "center", border: `1px solid ${C.border}`, color: C.text, borderRadius: 10, height: 44, lineHeight: "44px", fontSize: 15, fontWeight: 600, textDecoration: "none" },
};
