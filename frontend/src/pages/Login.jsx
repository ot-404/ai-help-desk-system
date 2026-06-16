import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { C } from "../theme";

function BigLogo() {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <span style={{ background: C.primary, color: "#fff", fontWeight: 800, borderRadius: 6, padding: "5px 11px", fontSize: 22 }}>HD</span>
      <span style={{ color: C.text, fontWeight: 700, fontSize: 24 }}>Systems</span>
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
          <button type="submit" style={s.submit} disabled={loading}>{loading ? "LOGGING IN…" : "LOG IN"}</button>
        </form>

        <a href="#" style={s.forgot}>Forgot password?</a>

        <div style={s.divider}><span style={s.dividerText}>NEW TO HD SYSTEMS?</span></div>

        <Link to="/register" style={s.signupBtn}>SIGN UP</Link>
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
  legalLink: { color: C.blue, textDecoration: "underline" },
  sep: { borderTop: `1px solid ${C.border}`, margin: "0 0 20px" },
  form: { display: "flex", flexDirection: "column", gap: 14 },
  input: { height: 44, borderRadius: 8, border: `1px solid ${C.border}`, background: C.surfaceHover, padding: "0 14px", fontSize: 16, boxSizing: "border-box", width: "100%", color: C.text },
  error: { background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: 6, padding: "10px 14px", fontSize: 14, color: C.danger },
  submit: { background: C.primary, color: "#fff", border: "none", borderRadius: 20, padding: 0, height: 38, fontSize: 14, fontWeight: 700, textTransform: "uppercase", width: "100%", cursor: "pointer" },
  forgot: { display: "inline-block", marginTop: 16, color: C.blue, fontSize: 12, fontWeight: 600, textDecoration: "none" },
  divider: { display: "flex", alignItems: "center", textAlign: "center", margin: "20px 0", color: C.muted },
  dividerText: { flex: 1, fontSize: 11, fontWeight: 700, letterSpacing: 1, position: "relative" },
  signupBtn: { display: "block", textAlign: "center", border: `1px solid ${C.primary}`, color: C.primary, borderRadius: 20, height: 38, lineHeight: "38px", fontSize: 14, fontWeight: 700, textTransform: "uppercase", textDecoration: "none" },
};
