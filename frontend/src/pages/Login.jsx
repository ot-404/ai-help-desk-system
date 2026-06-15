import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
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
      nav(u.role === "user" ? "/" : "/agent");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>AI</div>
        <h1 style={s.title}>AI Help Desk</h1>
        <p style={s.sub}>Sign in to continue</p>
        {error && <div style={s.err}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={s.label}>Email</label>
          <input style={s.input} type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
          <label style={s.label}>Password</label>
          <input style={s.input} type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button style={s.btn} disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>
        </form>
        <div style={s.footer}>New user? <Link to="/register" style={s.link}>Create an account</Link></div>
        <div style={s.hints}>
          <b>Demo accounts:</b><br />
          admin@example.com / admin123<br />
          agent@example.com / agent123<br />
          jane@example.com / user123
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#eef1f4", display: "flex", alignItems: "center", justifyContent: "center" },
  card: { background: "#fff", borderRadius: 18, padding: "40px 36px", width: 380, boxShadow: "0 8px 32px rgba(0,0,0,.08)" },
  logo: { background: "#16c784", color: "#fff", fontWeight: 800, fontSize: 18, padding: "8px 14px", borderRadius: 10, display: "inline-block", marginBottom: 12 },
  title: { fontSize: 22, fontWeight: 700, margin: "0 0 4px" },
  sub: { color: "#7a8794", fontSize: 14, marginBottom: 24 },
  err: { background: "#fff5f5", color: "#c53030", border: "1px solid #feb2b2", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 14 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#4a5568", marginBottom: 6 },
  input: { width: "100%", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 12px", fontSize: 14, marginBottom: 16, outline: "none", boxSizing: "border-box" },
  btn: { width: "100%", background: "#16c784", color: "#fff", border: "none", borderRadius: 8, padding: "12px", fontSize: 15, fontWeight: 700, cursor: "pointer" },
  footer: { marginTop: 16, textAlign: "center", fontSize: 14, color: "#7a8794" },
  link: { color: "#16c784", fontWeight: 600, textDecoration: "none" },
  hints: { marginTop: 16, background: "#f7fafc", borderRadius: 8, padding: "12px 14px", fontSize: 12, color: "#718096", lineHeight: 1.8 },
};
