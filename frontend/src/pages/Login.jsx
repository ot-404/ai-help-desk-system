import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const registered = new URLSearchParams(loc.search).get("registered");

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
      nav(u.role === "user" ? "/my-tickets" : u.role === "admin" ? "/admin" : "/agent");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logoWrap}><span style={s.logo}>AI</span></div>
        <h1 style={s.title}>AI Help Desk</h1>
        <p style={s.sub}>Sign in to continue</p>

        {registered && (
          <div style={s.success}>Account created — please sign in.</div>
        )}
        {error && <div style={s.err}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={s.label}>Email</label>
          <input style={s.input} type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus placeholder="you@example.com" />
          <label style={s.label}>Password</label>
          <input style={s.input} type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Your password" />
          <button style={s.btn} disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>
        </form>

        <div style={s.footer}>New user? <Link to="/register" style={s.link}>Create an account</Link></div>

        <div style={s.hints}>
          <div style={s.hintsTitle}>Demo accounts</div>
          <div style={s.hintRow}><span style={s.hintRole}>Admin</span> admin@example.com / admin123</div>
          <div style={s.hintRow}><span style={s.hintRole}>Agent</span> agent@example.com / agent123</div>
          <div style={s.hintRow}><span style={s.hintRole}>User</span> jane@example.com / user123</div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#eef1f4", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
  card: { background: "#fff", borderRadius: 18, padding: "40px 36px", width: "100%", maxWidth: 400, boxShadow: "0 8px 32px rgba(0,0,0,.08)" },
  logoWrap: { marginBottom: 14 },
  logo: { background: "#16c784", color: "#fff", fontWeight: 800, fontSize: 16, padding: "6px 12px", borderRadius: 8 },
  title: { fontSize: 22, fontWeight: 700, margin: "0 0 4px" },
  sub: { color: "#7a8794", fontSize: 14, margin: "0 0 24px" },
  success: { background: "#f0fff4", color: "#276749", border: "1px solid #9ae6b4", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 14, fontWeight: 500 },
  err: { background: "#fff5f5", color: "#c53030", border: "1px solid #feb2b2", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 14 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#4a5568", marginBottom: 6 },
  input: { width: "100%", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 12px", fontSize: 14, marginBottom: 16, outline: "none", boxSizing: "border-box" },
  btn: { width: "100%", background: "#16c784", color: "#fff", border: "none", borderRadius: 8, padding: "12px", fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 4 },
  footer: { marginTop: 18, textAlign: "center", fontSize: 14, color: "#7a8794" },
  link: { color: "#16c784", fontWeight: 600, textDecoration: "none" },
  hints: { marginTop: 20, background: "#f7fafc", borderRadius: 10, padding: "14px 16px" },
  hintsTitle: { fontSize: 11, fontWeight: 700, color: "#a0aec0", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 8 },
  hintRow: { fontSize: 12, color: "#718096", lineHeight: 1.9 },
  hintRole: { fontWeight: 700, color: "#4a5568", marginRight: 6 },
};
