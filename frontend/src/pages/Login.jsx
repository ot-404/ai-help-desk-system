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
      const next = params.get("next");
      if (next && next.startsWith("/")) {
        nav(next);
      } else {
        nav(u.role === "user" ? "/" : u.role === "admin" ? "/admin" : "/agent");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Invalid email or password");
    } finally { setLoading(false); }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        {/* Brand */}
        <Link to="/" style={s.brand}>
          <span style={s.logoBox}>AHD</span>
          <span style={s.logoText}>AI Help Desk</span>
        </Link>

        <h1 style={s.heading}>Sign in</h1>
        <p style={s.sub}>Welcome back</p>

        {params.get("registered") && (
          <div style={s.success}>Account created! Sign in below.</div>
        )}
        {error && <div style={s.err}>{error}</div>}

        <form onSubmit={handleSubmit} style={s.form}>
          <label style={s.label}>Email</label>
          <input
            style={s.input} type="email" value={email}
            onChange={e => setEmail(e.target.value)}
            required autoFocus placeholder="you@example.com"
          />
          <label style={s.label}>Password</label>
          <input
            style={s.input} type="password" value={password}
            onChange={e => setPassword(e.target.value)}
            required placeholder="Password"
          />
          <button style={s.btn} disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div style={s.divider}><span style={s.dividerText}>New to AI Help Desk?</span></div>

        <Link to="/register" style={s.signUpBtn}>Create account</Link>

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
  sub:      { fontSize: 14, color: "#939598", textAlign: "center", margin: "0 0 24px" },

  success: { background: "#f0fff4", border: "1px solid #c6f6d5", borderRadius: 6, padding: "10px 14px", marginBottom: 16, fontSize: 14, color: "#276749" },
  err:     { background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: 6, padding: "10px 14px", marginBottom: 16, fontSize: 14, color: "#c53030" },

  form:  { display: "flex", flexDirection: "column" },
  label: { fontSize: 13, fontWeight: 600, color: "#282829", marginBottom: 5 },
  input: {
    border: "1.5px solid #e8e8e8", borderRadius: 6,
    padding: "10px 14px", fontSize: 15, marginBottom: 14,
    width: "100%", color: "#282829", outline: "none",
    transition: "border-color .15s",
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

  signUpBtn: {
    display: "block", textAlign: "center",
    border: "1.5px solid #e8e8e8", color: "#282829",
    borderRadius: 20, padding: "11px",
    fontSize: 14, fontWeight: 700, textDecoration: "none",
  },

  hints: {
    marginTop: 24, background: "#f7f7f5", borderRadius: 6,
    padding: "10px 12px", fontSize: 12, color: "#939598", lineHeight: 1.9,
  },
};
