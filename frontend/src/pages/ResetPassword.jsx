import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import { C } from "../theme";

function BigLogo() {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <span style={{ background: C.gradient, color: "#fff", fontWeight: 800, borderRadius: 8, padding: "5px 11px", fontSize: 22 }}>HD</span>
      <span style={{ color: C.text, fontWeight: 700, fontSize: 24 }}>Systems</span>
    </div>
  );
}

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords don't match."); return; }
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, password });
      setDone(true);
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err?.response?.data?.error || "This reset link is invalid or has expired.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logoRow}><BigLogo /></div>
        <h1 style={s.title}>Choose a new password</h1>

        {!token ? (
          <p style={s.sub}>This reset link is missing its token. Please request a new one.</p>
        ) : done ? (
          <div style={s.success}>Your password has been reset. Redirecting you to log in…</div>
        ) : (
          <form onSubmit={handleSubmit} style={s.form}>
            <input type="password" style={s.input} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" required autoFocus />
            <input type="password" style={s.input} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm new password" required />
            {error && <div style={s.error}>{error}</div>}
            <button type="submit" style={s.submit} disabled={loading}>{loading ? "Resetting…" : "Reset password"}</button>
          </form>
        )}

        <div style={s.divider} />
        <Link to="/login" style={s.back}>← Back to log in</Link>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: C.bg, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "clamp(24px, 8vh, 80px) 16px", overflowY: "auto" },
  card: { width: "100%", maxWidth: 420, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "44px 36px", boxSizing: "border-box", boxShadow: "0 4px 24px rgba(0,0,0,0.04)" },
  logoRow: { display: "flex", justifyContent: "center", marginBottom: 24 },
  title: { fontSize: 21, fontWeight: 700, color: C.text, margin: "0 0 8px", letterSpacing: -0.3 },
  sub: { fontSize: 14, color: C.muted, margin: "0 0 8px", lineHeight: 1.5 },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  input: { height: 46, borderRadius: 10, border: `1px solid ${C.border}`, background: C.surfaceHover, padding: "0 14px", fontSize: 16, boxSizing: "border-box", width: "100%", color: C.text },
  error: { background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 14, color: C.danger },
  submit: { background: C.gradient, color: "#fff", border: "none", borderRadius: 10, padding: 0, height: 44, fontSize: 15, fontWeight: 600, width: "100%", cursor: "pointer", marginTop: 2 },
  success: { background: "#ecfdf3", border: "1px solid #a7f3d0", borderRadius: 8, padding: "12px 14px", fontSize: 14, color: "#15803d", lineHeight: 1.5 },
  divider: { borderTop: `1px solid ${C.border}`, margin: "22px 0 16px" },
  back: { color: C.blue, fontSize: 13, fontWeight: 600, textDecoration: "none" },
};
