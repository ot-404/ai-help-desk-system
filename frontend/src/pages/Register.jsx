import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { AuthShell } from "./Login";
import { useAuth } from "../context/AuthContext";
import { apiError } from "../lib/api";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      navigate("/app/today", { replace: true });
    } catch (err) {
      setError(apiError(err, "Could not create account."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Create your account" subtitle="Start turning chaos into a clear list.">
      <form onSubmit={submit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
            {error}
          </div>
        )}
        <div>
          <label className="label">Name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)}
                 placeholder="Alex Rivera" required />
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" autoComplete="email" value={email}
                 onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" type="password" autoComplete="new-password" value={password}
                 onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" required />
        </div>
        <button className="btn-primary w-full py-2.5" disabled={loading}>
          {loading ? "Creating…" : "Create account"} <ArrowRight size={16} />
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-accent hover:underline">Log in</Link>
      </p>
    </AuthShell>
  );
}
