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
        <Link to="/" style={s.brand}>
          <span style={s.logoBox}>AHD</span>
          <span style={s.logoText}>AI Help Desk</span>
        </Link>

        <h1 style={s.heading}>Create account</h1>
        <p style={s.sub}>Join AI Help Desk today</p>

        {error && <div style={s.err}>{error}</div>}

        <form onSubmit={handleSubmit} style={s.form}>
          <label style={s.label}>Full Name</label>
          <input style={s.input} value={form.name} onChange={set("name")} required placeholder="Jane Smith" />

          <label style={s.label}>Email</label>
          <input style={s.input} type="email" value={form.email} onChange={set("email")} required placeholder="you@example.com" />

          <label style={s.label}>Password</label>
          <input style={s.input} type="password" value={form.password} onChange={set("password")} required placeholder="Min. 6 characters" />

          <label style={s.label}>Confirm Password</label>
          <input style={s.input} type="password" value={form.confirm} onChange={set("confirm")} required placeholder="Repeat password" />

          <button style={s.btn} disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <div style={s.divider}><span style={s.dividerText}>Already have an account?</span></div>

        <Link to="/login" style={s.signInBtn}>Sign in</Link>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh", background: "#f2f2f0",
    display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
  },
  card: {
    background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8,
    padding: "40px 36px", width: "100%", maxWidth: 380,
    display: "flex", flexDirection: "column",
  },
  brand: {
    display: "flex", alignItems: "center", gap: 8,
    justifyContent: "center", marginBottom: 24, textDecoration: "none",
  },
  logoBox:  { background: "#16c784", color: "#fff", fontWeight: 900, fontSize: 12, padding: "4px 8px", borderRadius: 5, letterSpacing: ".5px" },
  logoText: { fontWeight: 800, fontSize: 18, color: "#282829" },

  heading: { fontSize: 24, fontWeight: 800, textAlign: "center", margin: "0 0 4px", color: "#282829" },
  sub:     { fontSize: 14, color: "#939598", textAlign: "center", margin: "0 0 24px" },

  err: { background: "#fff5f5", color: "#c53030", border: "1px solid #fed7d7", borderRadius: 6, padding: "10px 14px", marginBottom: 16, fontSize: 14 },

  form:  { display: "flex", flexDirection: "column" },
  label: { fontSize: 13, fontWeight: 600, color: "#282829", marginBottom: 5 },
  input: {
    border: "1.5px solid #e8e8e8", borderRadius: 6,
    padding: "10px 14px", fontSize: 15, marginBottom: 14,
    width: "100%", color: "#282829", outline: "none",
  },
  btn: {
    background: "#16c784", color: "#fff", border: "none",
    borderRadius: 20, padding: "12px", fontSize: 15,
    fontWeight: 700, cursor: "pointer", marginTop: 4,
  },

  divider: {
    position: "relative", textAlign: "center",
    margin: "22px 0 14px", borderTop: "1px solid #e8e8e8",
  },
  dividerText: {
    background: "#fff", padding: "0 10px",
    position: "relative", top: -10,
    fontSize: 12, color: "#939598",
  },

  signInBtn: {
    display: "block", textAlign: "center",
    border: "1.5px solid #e8e8e8", color: "#282829",
    borderRadius: 20, padding: "11px",
    fontSize: 14, fontWeight: 700, textDecoration: "none",
  },
};
