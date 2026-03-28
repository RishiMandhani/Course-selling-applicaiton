import { Link } from "react-router-dom";
import { assetUrl } from "../app/api";

export default function CourseCard({ course }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl shadow-slate-950/30">
      <div className="h-48 bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600">
        {course.thumbnailUrl && <img src={assetUrl(course.thumbnailUrl)} alt={course.title} className="h-full w-full object-cover" />}
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-emerald-300">
          <span>{course.category}</span>
          <span>{course.level}</span>
        </div>
        <h3 className="text-xl font-bold text-white">{course.title}</h3>
        <p className="line-clamp-3 text-sm text-slate-300">{course.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-emerald-300">${course.price}</span>
          <Link to={`/courses/${course._id}`} className="rounded-full border border-emerald-400 px-4 py-2 text-sm font-semibold text-emerald-200">
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
