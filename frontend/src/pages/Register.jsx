import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(k) { return e => setForm(f => ({ ...f, [k]: e.target.value })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) { setError("Passwords do not match"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await api.post("/auth/register", { name: form.name, email: form.email, password: form.password });
      nav("/login?registered=1");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally { setLoading(false); }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logoWrap}>
          <span style={s.logo}>AI</span>
          <span style={{ fontWeight: 800, fontSize: 20, color: "#282829" }}>HelpDesk</span>
        </div>
        <h1 style={s.title}>Create Account</h1>
        <p style={s.sub}>Get help desk access</p>

        {error && <div style={s.err}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={s.label}>Full Name</label>
          <input style={s.input} value={form.name} onChange={set("name")} required placeholder="Jane Smith" />
          <label style={s.label}>Email</label>
          <input style={s.input} type="email" value={form.email} onChange={set("email")} required placeholder="you@example.com" />
          <label style={s.label}>Password</label>
          <input style={s.input} type="password" value={form.password} onChange={set("password")} required placeholder="Min. 6 characters" />
          <label style={s.label}>Confirm Password</label>
          <input style={s.input} type="password" value={form.confirm} onChange={set("confirm")} required placeholder="Repeat password" />
          <button style={s.btn} disabled={loading}>{loading ? "Creating account…" : "Create Account"}</button>
        </form>

        <div style={s.footer}>Already have an account? <Link to="/login" style={s.link}>Sign in</Link></div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#f2f2f0", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
  card: { background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8, padding: "40px 36px", width: "100%", maxWidth: 380 },
  logoWrap: { display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 20 },
  logo: { background: "#16c784", color: "#fff", fontWeight: 800, fontSize: 14, padding: "4px 8px", borderRadius: 5 },
  title: { fontSize: 22, fontWeight: 700, margin: "0 0 4px", textAlign: "center", color: "#282829" },
  sub: { color: "#939598", fontSize: 14, margin: "0 0 24px", textAlign: "center" },
  err: { background: "#fff5f5", color: "#c53030", border: "1px solid #fed7d7", borderRadius: 6, padding: "10px 14px", marginBottom: 16, fontSize: 14 },
  label: { display: "block", fontSize: 14, fontWeight: 600, color: "#282829", marginBottom: 6 },
  input: { width: "100%", border: "1px solid #ccc", borderRadius: 4, padding: "10px 12px", fontSize: 15, marginBottom: 14, outline: "none", boxSizing: "border-box", color: "#282829" },
  btn: { width: "100%", background: "#16c784", color: "#fff", border: "none", borderRadius: 4, padding: "12px", fontSize: 16, fontWeight: 700, cursor: "pointer", marginTop: 4 },
  footer: { marginTop: 20, textAlign: "center", fontSize: 14, color: "#555" },
  link: { color: "#16c784", fontWeight: 600, textDecoration: "none" },
};
