import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { useToast } from "../../context/ToastContext";

export default function AdminLoginPage() {
  const { login, isAuthenticated, isReady } = useAdminAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isReady && isAuthenticated) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(username, password);
      showToast("Welcome back.", "success");
      navigate("/admin");
    } catch (err: any) {
      setError(err?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-950 px-4">
      <div className="glass-panel w-full max-w-sm rounded-2xl p-8">
        <ShieldCheck className="mb-4 h-8 w-8 text-violet-400" />
        <h1 className="font-display text-xl font-bold text-white">Admin sign in</h1>
        <p className="mt-1 text-sm text-slate-400">Restricted area. Authorized administrators only.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-slate-300">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white focus:border-violet-400"
              autoFocus
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-slate-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white focus:border-violet-400"
              required
            />
          </div>
          {error && <p className="text-sm text-rose-400">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
