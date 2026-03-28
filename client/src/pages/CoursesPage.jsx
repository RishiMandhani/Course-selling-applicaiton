import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CourseCard from "../components/CourseCard";
import { fetchCourses } from "../features/courses/courseSlice";

export default function CoursesPage() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.courses);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  return (
    <section className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Catalog</p>
        <h2 className="mt-3 text-4xl font-black text-white">Discover your next skill</h2>
      </div>
      {loading ? <p className="text-slate-300">Loading courses...</p> : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {list.map((course) => <CourseCard key={course._id} course={course} />)}
        </div>
      )}
    </section>
  );
}
