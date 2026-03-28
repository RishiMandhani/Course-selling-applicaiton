import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../app/api";
import { enrollInDemoCourse } from "../features/courses/demoCourses";
import { fetchCourseById } from "../features/courses/courseSlice";

export default function CourseDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selected } = useSelector((state) => state.courses);
  const { token, user } = useSelector((state) => state.auth);
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(fetchCourseById(id));
  }, [dispatch, id]);

  const handlePurchase = async () => {
    if (selected?.demo) {
      if (!token) {
        navigate("/login");
        return;
      }

      enrollInDemoCourse(selected._id);
      setMessage("Demo course added to My Learning.");
      navigate(`/learn/${selected._id}`);
      return;
    }

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const data = await apiRequest(`/purchases/${id}`, { method: "POST" }, token);
      setMessage(data.message);
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (!selected) return <p className="text-slate-300">Loading course details...</p>;

  return (
    <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <span className="rounded-full border border-emerald-400 px-4 py-1 text-sm text-emerald-200">{selected.category}</span>
        <h1 className="text-4xl font-black text-white">{selected.title}</h1>
        <p className="text-lg text-slate-300">{selected.description}</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Level</p>
            <p className="mt-2 text-xl font-bold text-white">{selected.level}</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Modules</p>
            <p className="mt-2 text-xl font-bold text-white">{selected.modules.length}</p>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-bold text-white">Course Modules</h2>
          <div className="mt-4 space-y-4">
            {selected.modules.map((module) => (
              <div key={module._id} className="rounded-2xl border border-slate-800 p-4">
                <h3 className="font-semibold text-white">{module.title}</h3>
                <p className="mt-1 text-sm text-slate-400">{module.description}</p>
                <p className="mt-3 text-sm text-emerald-200">{module.lessons.length} lessons in this module</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <aside className="h-fit rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
        <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Enrollment</p>
        {selected.demo && (
          <p className="mt-3 rounded-2xl border border-cyan-400/40 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-200">
            Demo course preview. Sign in to add it to My Learning instantly.
          </p>
        )}
        <p className="mt-4 text-5xl font-black text-white">${selected.price}</p>
        <button onClick={handlePurchase} className="mt-6 w-full rounded-full bg-emerald-400 px-5 py-3 font-bold text-slate-950">
          {selected.demo ? user ? "Start Demo Course" : "Login to Start Demo" : user ? "Purchase Course" : "Login to Purchase"}
        </button>
        {message && <p className="mt-4 text-sm text-cyan-300">{message}</p>}
        <div className="mt-6 space-y-3 text-sm text-slate-300">
          <p>Requirements: {selected.requirements?.join(", ") || "No prerequisites"}</p>
          <p>Outcomes: {selected.learningOutcomes?.join(", ") || "Practical learning path"}</p>
        </div>
      </aside>
    </section>
  );
}
