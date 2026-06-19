import { useState } from "react";
import { Link } from "react-router-dom";
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

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [devLink, setDevLink] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/forgot-password", { email: email.trim() });
      setSent(true);
      if (data?.dev_reset_link) setDevLink(data.dev_reset_link);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logoRow}><BigLogo /></div>
        <h1 style={s.title}>Reset your password</h1>

        {!sent ? (
          <>
            <p style={s.sub}>Enter the email for your account and we'll send you a link to reset your password.</p>
            <form onSubmit={handleSubmit} style={s.form}>
              <input type="email" style={s.input} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required autoFocus />
              {error && <div style={s.error}>{error}</div>}
              <button type="submit" style={s.submit} disabled={loading || !email.trim()}>{loading ? "Sending…" : "Send reset link"}</button>
            </form>
          </>
        ) : (
          <div style={s.success}>
            <p style={{ margin: 0 }}>If an account exists for <strong>{email}</strong>, a password-reset link has been sent. Check your inbox (and spam).</p>
            {devLink && (
              <div style={s.devBox}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Demo mode (email not configured)</div>
                <div style={{ marginBottom: 8 }}>Use this link to reset your password:</div>
                <Link to={devLink.replace(/^.*(\/reset-password.*)$/, "$1")} style={s.devLink}>Reset password →</Link>
              </div>
            )}
          </div>
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
  sub: { fontSize: 14, color: C.muted, margin: "0 0 18px", lineHeight: 1.5 },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  input: { height: 46, borderRadius: 10, border: `1px solid ${C.border}`, background: C.surfaceHover, padding: "0 14px", fontSize: 16, boxSizing: "border-box", width: "100%", color: C.text },
  error: { background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 14, color: C.danger },
  submit: { background: C.gradient, color: "#fff", border: "none", borderRadius: 10, padding: 0, height: 44, fontSize: 15, fontWeight: 600, width: "100%", cursor: "pointer", marginTop: 2 },
  success: { fontSize: 14, color: C.text, lineHeight: 1.6 },
  devBox: { marginTop: 16, background: C.surfaceHover, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, fontSize: 13, color: C.muted },
  devLink: { color: C.primary, fontWeight: 700, textDecoration: "none", fontSize: 14 },
  divider: { borderTop: `1px solid ${C.border}`, margin: "22px 0 16px" },
  back: { color: C.blue, fontSize: 13, fontWeight: 600, textDecoration: "none" },
};
