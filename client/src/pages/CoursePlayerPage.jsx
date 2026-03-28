import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { assetUrl } from "../app/api";
import { fetchOwnedCourseContent } from "../features/courses/courseSlice";

export default function CoursePlayerPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { owned } = useSelector((state) => state.courses);

  useEffect(() => {
    dispatch(fetchOwnedCourseContent(id));
  }, [dispatch, id]);

  if (!owned) return <p className="text-slate-300">Loading your course...</p>;

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Course Player</p>
        <h1 className="mt-2 text-4xl font-black text-white">{owned.title}</h1>
        {owned.demo && (
          <p className="mt-3 max-w-3xl rounded-2xl border border-cyan-400/40 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-200">
            This demo course uses preview content to keep the platform interactive before real uploads are added.
          </p>
        )}
      </div>
      <div className="space-y-5">
        {owned.modules.map((module) => (
          <div key={module._id} className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold text-white">{module.title}</h2>
            <p className="mt-2 text-slate-400">{module.description}</p>
            <div className="mt-5 space-y-4">
              {module.lessons.map((lesson) => (
                <div key={lesson._id} className="rounded-2xl border border-slate-800 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-white">{lesson.title}</h3>
                      <p className="text-sm text-slate-400">{lesson.contentType}</p>
                    </div>
                    {lesson.duration && <span className="text-sm text-cyan-300">{lesson.duration}</span>}
                  </div>
                  <div className="mt-4">
                    {owned.demo ? (
                      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-5">
                        <p className="font-semibold text-white">Interactive demo placeholder</p>
                        <p className="mt-2 text-sm text-slate-400">
                          {lesson.contentType === "video"
                            ? "This lesson is ready for your uploaded video content."
                            : "This lesson is ready for your uploaded PDF or reference document."}
                        </p>
                      </div>
                    ) : lesson.contentType === "video" ? (
                      <video controls className="w-full rounded-2xl" src={assetUrl(lesson.fileUrl)} />
                    ) : (
                      <a href={assetUrl(lesson.fileUrl)} target="_blank" rel="noreferrer" className="inline-flex rounded-full bg-emerald-400 px-4 py-2 font-semibold text-slate-950">
                        Open PDF
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
