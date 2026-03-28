import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { apiRequest } from "../../app/api";
import { addDemoLesson, addDemoModule, updateDemoCourse } from "../courses/demoCourses";
import { fetchAdminCourses } from "../courses/courseSlice";

const emptyCourse = {
  title: "",
  description: "",
  price: "",
  category: "",
  level: "beginner",
  published: true,
  requirements: "",
  learningOutcomes: "",
  thumbnail: null
};

export default function AdminCourseManager() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { adminList } = useSelector((state) => state.courses);
  const [courseForm, setCourseForm] = useState(emptyCourse);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [moduleForm, setModuleForm] = useState({ title: "", description: "", order: 1 });
  const [lessonForm, setLessonForm] = useState({
    moduleId: "",
    title: "",
    contentType: "video",
    duration: "",
    freePreview: false,
    order: 1,
    file: null
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(fetchAdminCourses());
  }, [dispatch]);

  const selectedCourse = useMemo(
    () => adminList.find((course) => course._id === selectedCourseId),
    [adminList, selectedCourseId]
  );

  const refreshCourses = async () => {
    await dispatch(fetchAdminCourses());
  };

  const clearCourseForm = () => {
    setSelectedCourseId("");
    setCourseForm(emptyCourse);
  };

  const loadCourseIntoForm = (course) => {
    setSelectedCourseId(course._id);
    setCourseForm({
      title: course.title,
      description: course.description,
      price: String(course.price),
      category: course.category,
      level: course.level,
      published: course.published,
      requirements: (course.requirements || []).join(", "),
      learningOutcomes: (course.learningOutcomes || []).join(", "),
      thumbnail: null
    });
  };

  const submitCourse = async (event) => {
    event.preventDefault();
    const requirements = courseForm.requirements.split(",").map((item) => item.trim()).filter(Boolean);
    const learningOutcomes = courseForm.learningOutcomes.split(",").map((item) => item.trim()).filter(Boolean);

    try {
      if (selectedCourse?.demo) {
        updateDemoCourse(selectedCourse._id, {
          title: courseForm.title,
          description: courseForm.description,
          price: courseForm.price,
          category: courseForm.category,
          level: courseForm.level,
          published: courseForm.published,
          requirements,
          learningOutcomes
        });
        setMessage("Demo course updated.");
      } else {
        const formData = new FormData();
        formData.append("title", courseForm.title);
        formData.append("description", courseForm.description);
        formData.append("price", courseForm.price);
        formData.append("category", courseForm.category);
        formData.append("level", courseForm.level);
        formData.append("published", String(courseForm.published));
        formData.append("requirements", JSON.stringify(requirements));
        formData.append("learningOutcomes", JSON.stringify(learningOutcomes));

        if (courseForm.thumbnail) {
          formData.append("thumbnail", courseForm.thumbnail);
        }

        if (selectedCourse?._id) {
          await apiRequest(`/courses/${selectedCourse._id}`, { method: "PUT", body: formData }, token);
          setMessage("Course updated successfully.");
        } else {
          await apiRequest("/courses", { method: "POST", body: formData }, token);
          setMessage("Course created successfully.");
        }
      }

      clearCourseForm();
      await refreshCourses();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const submitModule = async (event) => {
    event.preventDefault();
    if (!selectedCourseId) {
      setMessage("Choose a course before adding a module.");
      return;
    }

    try {
      if (selectedCourse?.demo) {
        addDemoModule(selectedCourseId, moduleForm);
        setMessage("Module added to demo course.");
      } else {
        await apiRequest(
          `/courses/${selectedCourseId}/modules`,
          { method: "POST", body: JSON.stringify(moduleForm) },
          token
        );
        setMessage("Module added.");
      }

      setModuleForm({ title: "", description: "", order: 1 });
      await refreshCourses();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const submitLesson = async (event) => {
    event.preventDefault();
    if (!selectedCourseId || !lessonForm.moduleId || !lessonForm.file) {
      setMessage("Select a course, module, and file before adding a lesson.");
      return;
    }

    try {
      if (selectedCourse?.demo) {
        addDemoLesson(selectedCourseId, lessonForm.moduleId, lessonForm);
        setMessage("Lesson added to demo course.");
      } else {
        const formData = new FormData();
        formData.append("title", lessonForm.title);
        formData.append("contentType", lessonForm.contentType);
        formData.append("duration", lessonForm.duration);
        formData.append("freePreview", String(lessonForm.freePreview));
        formData.append("order", lessonForm.order);
        formData.append("file", lessonForm.file);

        await apiRequest(
          `/courses/${selectedCourseId}/modules/${lessonForm.moduleId}/lessons`,
          { method: "POST", body: formData },
          token
        );
        setMessage("Lesson uploaded.");
      }

      setLessonForm({
        moduleId: "",
        title: "",
        contentType: "video",
        duration: "",
        freePreview: false,
        order: 1,
        file: null
      });
      await refreshCourses();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-6">
        <form onSubmit={submitCourse} className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-white">{selectedCourseId ? "Edit Course" : "Create Course"}</h2>
            {selectedCourseId && (
              <button
                type="button"
                onClick={clearCourseForm}
                className="rounded-full border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200"
              >
                New Course
              </button>
            )}
          </div>
          <input className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Course title" value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} required />
          <textarea className="min-h-32 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Description" value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} required />
          <div className="grid gap-4 md:grid-cols-2">
            <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Price" type="number" min="0" value={courseForm.price} onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })} required />
            <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Category" value={courseForm.category} onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })} required />
          </div>
          <select className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" value={courseForm.level} onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <input className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Requirements, comma separated" value={courseForm.requirements} onChange={(e) => setCourseForm({ ...courseForm, requirements: e.target.value })} />
          <input className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Learning outcomes, comma separated" value={courseForm.learningOutcomes} onChange={(e) => setCourseForm({ ...courseForm, learningOutcomes: e.target.value })} />
          <input type="file" accept="image/*" onChange={(e) => setCourseForm({ ...courseForm, thumbnail: e.target.files?.[0] || null })} />
          <label className="flex items-center gap-3 text-sm text-slate-300">
            <input type="checkbox" checked={courseForm.published} onChange={(e) => setCourseForm({ ...courseForm, published: e.target.checked })} />
            Publish immediately
          </label>
          <button className="w-full rounded-full bg-emerald-400 px-5 py-3 font-bold text-slate-950">
            {selectedCourseId ? "Save Changes" : "Create Course"}
          </button>
        </form>

        <form onSubmit={submitModule} className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-bold text-white">Add Module</h2>
          <select className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)} required>
            <option value="">Select course</option>
            {adminList.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}{course.demo ? " (demo)" : ""}
              </option>
            ))}
          </select>
          <input className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Module title" value={moduleForm.title} onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })} required />
          <textarea className="min-h-28 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Module description" value={moduleForm.description} onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })} />
          <input className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" type="number" min="1" placeholder="Module order" value={moduleForm.order} onChange={(e) => setModuleForm({ ...moduleForm, order: e.target.value })} />
          <button className="w-full rounded-full bg-cyan-400 px-5 py-3 font-bold text-slate-950">Add Module</button>
        </form>

        <form onSubmit={submitLesson} className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-bold text-white">Upload Lesson</h2>
          <select className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)} required>
            <option value="">Select course</option>
            {adminList.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}{course.demo ? " (demo)" : ""}
              </option>
            ))}
          </select>
          <select className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" value={lessonForm.moduleId} onChange={(e) => setLessonForm({ ...lessonForm, moduleId: e.target.value })} required>
            <option value="">Select module</option>
            {selectedCourse?.modules.map((module) => (
              <option key={module._id} value={module._id}>
                {module.title}
              </option>
            ))}
          </select>
          <input className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Lesson title" value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} required />
          <select className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" value={lessonForm.contentType} onChange={(e) => setLessonForm({ ...lessonForm, contentType: e.target.value })}>
            <option value="video">Video</option>
            <option value="document">Document</option>
          </select>
          <input className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Duration (optional)" value={lessonForm.duration} onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })} />
          <input className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" type="number" min="1" placeholder="Lesson order" value={lessonForm.order} onChange={(e) => setLessonForm({ ...lessonForm, order: e.target.value })} />
          <label className="flex items-center gap-3 text-sm text-slate-300">
            <input type="checkbox" checked={lessonForm.freePreview} onChange={(e) => setLessonForm({ ...lessonForm, freePreview: e.target.checked })} />
            Allow free preview
          </label>
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">Choose File</p>
            <p className="mt-2 text-sm text-slate-400">
              Upload a video lesson or PDF document for this module.
            </p>
            <label className="mt-4 inline-flex cursor-pointer rounded-full bg-amber-300 px-4 py-2 text-sm font-bold text-slate-950">
              Choose file
              <input
                type="file"
                accept="video/*,.pdf"
                className="hidden"
                onChange={(e) => setLessonForm({ ...lessonForm, file: e.target.files?.[0] || null })}
                required
              />
            </label>
            <p className="mt-3 text-sm text-cyan-300">
              {lessonForm.file ? lessonForm.file.name : "No file selected yet"}
            </p>
          </div>
          {message && <p className="text-sm text-cyan-300">{message}</p>}
          <button className="w-full rounded-full bg-amber-300 px-5 py-3 font-bold text-slate-950">Upload Lesson</button>
        </form>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-2xl font-bold text-white">Existing Courses</h2>
        <div className="mt-6 space-y-5">
          {adminList.map((course) => (
            <div key={course._id} className="rounded-2xl border border-slate-800 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{course.title}</h3>
                  <p className="text-slate-400">
                    {course.category} • ${course.price} • {course.modules.length} modules
                    {course.demo ? " • demo catalog" : ""}
                  </p>
                </div>
                <button
                  onClick={() => loadCourseIntoForm(course)}
                  className="rounded-full border border-emerald-400 px-4 py-2 text-sm font-semibold text-emerald-200"
                >
                  Edit
                </button>
              </div>
              <div className="mt-4 space-y-3">
                {course.modules.map((module) => (
                  <div key={module._id} className="rounded-2xl bg-slate-950 p-4">
                    <p className="font-semibold text-white">{module.title}</p>
                    <p className="text-sm text-slate-400">{module.lessons.length} lessons</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
