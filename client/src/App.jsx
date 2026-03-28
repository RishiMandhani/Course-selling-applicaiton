import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailsPage from "./pages/CourseDetailsPage";
import AuthPage from "./pages/AuthPage";
import MyLearningPage from "./pages/MyLearningPage";
import CoursePlayerPage from "./pages/CoursePlayerPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import { fetchProfile } from "./features/auth/authSlice";

export default function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) dispatch(fetchProfile());
  }, [dispatch, token]);

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailsPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route element={<ProtectedRoute roles={["student", "admin"]} />}>
          <Route path="/my-learning" element={<MyLearningPage />} />
          <Route path="/learn/:id" element={<CoursePlayerPage />} />
        </Route>
        <Route element={<ProtectedRoute roles={["admin"]} />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
