import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useIsMobile } from "../hooks/useIsMobile";
import { C } from "../theme";
import Logo from "../components/Logo";

const FEATURES = [
  "Get answers from senior engineers",
  "AI-assisted debugging and code review",
  "Communities for every tech discipline",
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();
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

  const form = (
    <div style={s.formPanel}>
      <div style={s.formInner}>
        {isMobile && <div style={{ marginBottom: 20 }}><Logo /></div>}
        <h2 style={s.formTitle}>Welcome back</h2>
        <p style={s.formSub}>Sign in to your HD Systems account</p>

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input type="email" style={s.input} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required autoFocus />
          </div>
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input type="password" style={s.input} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          {error && <div style={s.error}>{error}</div>}
          <button type="submit" style={s.submit} disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>
        </form>

        <div style={s.divider}><span style={s.dividerText}>or continue with</span></div>
        <div style={s.ssoRow}>
          <button style={s.sso} type="button">Continue with Google</button>
          <button style={s.sso} type="button">Continue with GitHub</button>
        </div>

        <div style={s.foot}>New to HD Systems? <Link to="/register" style={s.footLink}>Create an account</Link></div>
      </div>
    </div>
  );

  if (isMobile) return form;

  return (
    <div style={s.page}>
      <div style={s.brand}>
        <div style={s.brandInner}>
          <Logo size="lg" />
          <h1 style={s.brandHeading}>Where tech professionals get answers</h1>
          <p style={s.brandSub}>The hub for tech professionals.</p>
          <ul style={s.featureList}>
            {FEATURES.map((f) => (
              <li key={f} style={s.featureItem}><span style={s.check}>✓</span>{f}</li>
            ))}
          </ul>
        </div>
      </div>
      {form}
    </div>
  );
}

const s = {
  page: { display: "flex", minHeight: "100vh" },
  brand: { flex: "0 0 55%", background: "#0d1417", display: "flex", alignItems: "center", justifyContent: "center", padding: 48 },
  brandInner: { maxWidth: 460, color: "#fff" },
  brandHeading: { fontSize: 36, fontWeight: 800, margin: "28px 0 14px", lineHeight: 1.2 },
  brandSub: { fontSize: 17, color: "rgba(255,255,255,.65)", margin: "0 0 32px" },
  featureList: { listStyle: "none", display: "flex", flexDirection: "column", gap: 16 },
  featureItem: { display: "flex", alignItems: "center", gap: 12, fontSize: 16, color: "rgba(255,255,255,.85)" },
  check: { width: 24, height: 24, borderRadius: "50%", background: C.primary, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 },
  formPanel: { flex: "0 0 45%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 32 },
  formInner: { width: "100%", maxWidth: 360 },
  formTitle: { fontSize: 26, fontWeight: 800, color: C.text, margin: "0 0 6px" },
  formSub: { fontSize: 14, color: C.muted, margin: "0 0 24px" },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: 13, fontWeight: 600, color: C.muted },
  input: { height: 44, borderRadius: 8, border: "1px solid " + C.border, padding: "0 14px", fontSize: 15, boxSizing: "border-box", width: "100%" },
  error: { background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: 8, padding: "10px 14px", fontSize: 14, color: "#c53030" },
  submit: { background: C.primary, color: "#fff", border: "none", borderRadius: 8, padding: "13px 0", fontSize: 15, fontWeight: 700, width: "100%", marginTop: 4 },
  divider: { textAlign: "center", margin: "22px 0", borderTop: "1px solid " + C.border, position: "relative" },
  dividerText: { background: "#fff", color: C.light, fontSize: 12, padding: "0 12px", position: "relative", top: -10 },
  ssoRow: { display: "flex", flexDirection: "column", gap: 10 },
  sso: { flex: 1, background: "#fff", border: "1px solid " + C.border, borderRadius: 8, padding: "11px 0", fontSize: 14, fontWeight: 600, color: C.text },
  foot: { textAlign: "center", marginTop: 24, fontSize: 14, color: C.muted },
  footLink: { color: C.primary, fontWeight: 700, textDecoration: "none" },
};
