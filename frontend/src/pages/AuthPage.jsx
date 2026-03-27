import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthPage = ({ mode = "login" }) => {
  const isLogin = mode === "login";
  const navigate = useNavigate();
  const { loginUser, registerUser } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    institution: "",
    role: "student",
    remember: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");
    if (savedEmail) {
      setForm((prev) => ({ ...prev, email: savedEmail, remember: true }));
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        await loginUser({ email: form.email, password: form.password });
        setStatus("Login successful — redirecting to dashboard.");
      } else {
        await registerUser(form);
        setStatus("Account created! Redirecting to dashboard.");
      }
      if (form.remember) {
        localStorage.setItem("rememberEmail", form.email);
      } else {
        localStorage.removeItem("rememberEmail");
      }
      setTimeout(() => {
        navigate("/dashboard");
      }, 300);
    } catch (err) {
      console.error("Auth error details:", err);
      const errorMessage = err.response?.data?.message || err.message || "Something went wrong";
      setError(errorMessage);
      setStatus("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell flex min-h-screen items-center justify-center px-4 py-10">
      <div className="glass-card grid w-full max-w-6xl gap-8 overflow-hidden lg:grid-cols-[1.05fr_0.95fr]">
        <div className="bg-slate-900 p-10 text-white dark:bg-slate-950">
          <h1 className="mt-6 text-4xl font-bold leading-tight">
            AI-powered practice, feedback, and career clarity for students.
          </h1>
          <p className="mt-6 text-slate-300">
            Build confidence with adaptive tests, instant explanations, topic analytics, badges, and role recommendations.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              "AI-generated tests",
              "Instant scoring",
              "Smart roadmap suggestions",
              "Dark mode and leaderboard"
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-white/10 px-4 py-4 text-sm">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 lg:p-10">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-300">
            <span className="font-semibold uppercase tracking-[0.25em] text-accent-600">
              {isLogin ? "Login" : "Sign Up"}
            </span>
            <span>{isLogin ? "Secure access" : "Get started"}</span>
          </div>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
            {isLogin ? "Log in to continue" : "Create your account"}
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {isLogin
              ? "Use your email and password to access your dashboard."
              : "Fill in details to create your student AI skill account."}
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <input
                  className="input"
                  placeholder="Full name"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  required
                />
                <input
                  className="input"
                  placeholder="Institution"
                  value={form.institution}
                  onChange={(event) => setForm({ ...form, institution: event.target.value })}
                />
                <select
                  className="input"
                  value={form.role}
                  onChange={(event) => setForm({ ...form, role: event.target.value })}
                  required
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </>
            )}
            <input
              className="input"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
            <div className="relative">
              <input
                className="input"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div className="flex items-center justify-between gap-2 text-sm text-slate-600 dark:text-slate-300">
              <label className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  checked={form.remember}
                  onChange={(event) => setForm({ ...form, remember: event.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-accent-600 focus:ring-accent-500"
                />
                Remember me
              </label>
              <span className="text-accent-600">Need help?</span>
            </div>
            {status ? <p className="text-sm text-emerald-500">{status}</p> : null}
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            <button className="btn-primary w-full" disabled={loading} type="submit">
              {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
            </button>
          </form>
          <button
            type="button"
            className="mt-5 text-sm text-slate-500 underline dark:text-slate-300"
            onClick={() => navigate(isLogin ? "/signup" : "/login")}
          >
            {isLogin ? "Need an account? Sign up" : "Already have an account? Log in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
