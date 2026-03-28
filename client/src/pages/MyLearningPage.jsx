import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiRequest } from "../app/api";
import { getDemoCourses, getEnrolledDemoCourses } from "../features/courses/demoCourses";

export default function MyLearningPage() {
  const { token } = useSelector((state) => state.auth);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    apiRequest("/purchases/me/list", {}, token)
      .then((data) => {
        setCourses([...getEnrolledDemoCourses(), ...data]);
      })
      .catch(() => {
        setCourses(getEnrolledDemoCourses());
      });
  }, [token]);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Library</p>
        <h1 className="mt-2 text-4xl font-black text-white">My Learning</h1>
      </div>
      {courses.length === 0 && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-bold text-white">Start with a guided demo</h2>
          <p className="mt-2 text-slate-300">
            Add one of the curated demo courses from the catalog to make your learning dashboard feel alive.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {getDemoCourses().slice(0, 2).map((course) => (
              <Link key={course._id} to={`/courses/${course._id}`} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">{course.category}</p>
                <h3 className="mt-2 text-xl font-bold text-white">{course.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{course.modules.length} modules</p>
              </Link>
            ))}
          </div>
        </div>
      )}
      <div className="grid gap-5">
        {courses.map((purchase) => (
          <div key={purchase._id} className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-800 bg-slate-900 p-5 md:flex-row md:items-center">
            <div>
              <h3 className="text-xl font-bold text-white">{purchase.course.title}</h3>
              <p className="text-slate-400">
                {purchase.course.category}
                {purchase.demo ? " • Demo course" : ""}
              </p>
            </div>
            <Link to={`/learn/${purchase.course._id}`} className="rounded-full bg-cyan-400 px-5 py-3 font-bold text-slate-950">
              Open Course
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
