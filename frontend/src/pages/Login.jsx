import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const u = await login(email, password);
      nav(u.role === "user" ? "/my-tickets" : "/agent");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid email or password");
    } finally { setLoading(false); }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        {/* Brand */}
        <div style={s.brand}>
          <span style={s.logoBox}>AI</span>
          <span style={s.logoText}>HelpDesk</span>
        </div>
        <h1 style={s.heading}>Sign in to HelpDesk</h1>

        {params.get("registered") && (
          <div style={s.success}>Account created! Sign in below.</div>
        )}
        {error && <div style={s.err}>{error}</div>}

        <form onSubmit={handleSubmit} style={s.form}>
          <label style={s.label}>Email</label>
          <input style={s.input} type="email" value={email}
            onChange={e => setEmail(e.target.value)} required autoFocus placeholder="you@example.com" />
          <label style={s.label}>Password</label>
          <input style={s.input} type="password" value={password}
            onChange={e => setPassword(e.target.value)} required placeholder="Password" />
          <button style={s.btn} disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>
        </form>

        <div style={s.divider}><span style={s.dividerText}>or</span></div>

        <div style={s.footer}>
          Don't have an account?{" "}
          <Link to="/register" style={s.link}>Sign up</Link>
        </div>

        <div style={s.hints}>
          <b>Demo:</b> admin@example.com / admin123 &nbsp;·&nbsp; agent@example.com / agent123 &nbsp;·&nbsp; jane@example.com / user123
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#f2f2f0", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
  card: { background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8, padding: "40px 36px", width: "100%", maxWidth: 380 },
  brand: { display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 20 },
  logoBox: { background: "#16c784", color: "#fff", fontWeight: 800, fontSize: 14, padding: "4px 8px", borderRadius: 5 },
  logoText: { fontWeight: 800, fontSize: 20, color: "#282829" },
  heading: { fontSize: 22, fontWeight: 700, textAlign: "center", margin: "0 0 24px", color: "#282829" },
  success: { background: "#f0fff4", border: "1px solid #c6f6d5", borderRadius: 6, padding: "10px 14px", marginBottom: 16, fontSize: 14, color: "#276749" },
  err: { background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: 6, padding: "10px 14px", marginBottom: 16, fontSize: 14, color: "#c53030" },
  form: { display: "flex", flexDirection: "column" },
  label: { fontSize: 14, fontWeight: 600, color: "#282829", marginBottom: 6 },
  input: { border: "1px solid #ccc", borderRadius: 4, padding: "10px 12px", fontSize: 15, marginBottom: 14, width: "100%", color: "#282829" },
  btn: { background: "#16c784", color: "#fff", border: "none", borderRadius: 4, padding: "12px", fontSize: 16, fontWeight: 700, cursor: "pointer", marginTop: 4 },
  divider: { position: "relative", textAlign: "center", margin: "20px 0", borderTop: "1px solid #e8e8e8" },
  dividerText: { background: "#fff", padding: "0 10px", position: "relative", top: -10, fontSize: 13, color: "#939598" },
  footer: { textAlign: "center", fontSize: 14, color: "#555" },
  link: { color: "#16c784", fontWeight: 600, textDecoration: "none" },
  hints: { marginTop: 20, background: "#f7f7f5", borderRadius: 6, padding: "10px 12px", fontSize: 12, color: "#939598", lineHeight: 1.8 },
};
