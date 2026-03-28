import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../features/auth/authSlice";

export default function AuthPage() {
  const location = useLocation();
  const isRegister = location.pathname === "/register";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });

  if (user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/courses"} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const action = isRegister ? registerUser(form) : loginUser(form);
    const result = await dispatch(action);
    if (!result.error) {
      const nextRole = result.payload?.user?.role;
      navigate(nextRole === "admin" ? "/admin" : "/courses");
    }
  };

  return (
    <section className="mx-auto max-w-lg rounded-[2rem] border border-slate-800 bg-slate-900 p-8">
      <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">{isRegister ? "Create account" : "Welcome back"}</p>
      <h1 className="mt-4 text-4xl font-black text-white">{isRegister ? "Choose your account type" : "Login to continue"}</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {["student", "admin"].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setForm({ ...form, role })}
              className={`rounded-2xl border px-4 py-3 text-sm font-semibold capitalize transition ${
                form.role === role
                  ? "border-emerald-400 bg-emerald-400 text-slate-950"
                  : "border-slate-700 bg-slate-950 text-slate-200"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
        {isRegister && (
          <input className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        )}
        <input type="email" className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input type="password" className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <p className="text-sm text-slate-400">
          {isRegister
            ? `You are creating a ${form.role} account.`
            : `You are logging in as ${form.role}.`}
        </p>
        {error && <p className="text-sm text-rose-300">{error}</p>}
        <button type="submit" disabled={loading} className="w-full rounded-full bg-emerald-400 px-5 py-3 font-bold text-slate-950">
          {loading ? "Please wait..." : isRegister ? `Create ${form.role} account` : `Login as ${form.role}`}
        </button>
      </form>
    </section>
  );
}
