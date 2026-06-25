import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";
import { apiError } from "../lib/api";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dest = location.state?.from || "/app/today";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate(dest, { replace: true });
    } catch (err) {
      setError(apiError(err, "Could not sign in."));
    } finally {
      setLoading(false);
    }
  }

  function fillDemo() {
    setEmail("demo@lumo.app");
    setPassword("demo123");
  }

  return (
    <AuthShell title="Welcome back" subtitle="Log in to pick up where you left off.">
      <form onSubmit={submit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
            {error}
          </div>
        )}
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" autoComplete="email" value={email}
                 onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" type="password" autoComplete="current-password" value={password}
                 onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
        </div>
        <button className="btn-primary w-full py-2.5" disabled={loading}>
          {loading ? "Signing in…" : "Log in"} <ArrowRight size={16} />
        </button>
      </form>

      <button onClick={fillDemo} className="mt-3 w-full text-center text-xs text-muted hover:text-accent">
        Use demo account (demo@lumo.app)
      </button>

      <p className="mt-6 text-center text-sm text-muted">
        New here?{" "}
        <Link to="/register" className="font-medium text-accent hover:underline">Create an account</Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <div className="p-5">
        <Link to="/"><Logo size={30} /></Link>
      </div>
      <div className="flex flex-1 items-center justify-center px-5 pb-20">
        <div className="w-full max-w-sm">
          <div className="mb-7 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-1.5 text-sm text-muted">{subtitle}</p>
          </div>
          <div className="card p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
