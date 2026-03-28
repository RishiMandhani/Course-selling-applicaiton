import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
      <div className="space-y-6">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-300">Learn. Build. Grow.</p>
        <h1 className="max-w-3xl text-5xl font-black leading-tight text-white md:text-6xl">
          Build a course marketplace that feels premium, practical, and inspiring to learn from.
        </h1>
        <p className="max-w-2xl text-lg text-slate-300">
          CourseHub gives learners a focused experience with rich modules, structured lessons,
          and a polished path from discovery to course completion.
        </p>
        <div className="flex gap-4">
          <Link to="/courses" className="rounded-full bg-emerald-400 px-6 py-3 font-bold text-slate-950">Explore Courses</Link>
        </div>
      </div>
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
        <div className="space-y-4 rounded-[1.5rem] bg-slate-950 p-6">
          <div className="flex items-center justify-between rounded-2xl bg-slate-900 p-4">
            <span className="text-slate-300">Course Completion</span>
            <span className="font-bold text-emerald-300">84%</span>
          </div>
          <div className="rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-500 p-5 text-slate-950">
            <p className="text-sm font-semibold uppercase tracking-[0.3em]">Featured Track</p>
            <h3 className="mt-2 text-2xl font-black">Full-Stack MERN Bootcamp</h3>
            <p className="mt-2 text-sm font-medium">Video lessons, PDFs, quizzes, and guided projects.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-slate-900 p-4">
              <p className="text-sm text-slate-400">Students</p>
              <p className="text-3xl font-black text-white">12k+</p>
            </div>
            <div className="rounded-2xl bg-slate-900 p-4">
              <p className="text-sm text-slate-400">Courses</p>
              <p className="text-3xl font-black text-white">200+</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
