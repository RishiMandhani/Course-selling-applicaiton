import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiRequest } from "../app/api";
import AdminCourseManager from "../features/dashboard/AdminCourseManager";

export default function AdminDashboardPage() {
  const { token } = useSelector((state) => state.auth);
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    apiRequest("/admin/overview", {}, token).then(setOverview).catch(console.error);
  }, [token]);

  return (
    <section className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Admin</p>
        <h1 className="mt-2 text-4xl font-black text-white">Platform Dashboard</h1>
      </div>
      {overview && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            ["Students", overview.students],
            ["Admins", overview.admins],
            ["Courses", overview.courses],
            ["Sales", overview.sales],
            ["Revenue", `$${overview.revenue}`]
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-2 text-3xl font-black text-white">{value}</p>
            </div>
          ))}
        </div>
      )}
      <AdminCourseManager />
    </section>
  );
}
