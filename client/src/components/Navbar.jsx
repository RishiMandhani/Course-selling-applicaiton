import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-2xl font-black tracking-tight text-white">
          CourseHub
        </Link>
        <div className="flex items-center gap-5 text-sm text-slate-300">
          <NavLink to="/courses">Courses</NavLink>
          {user && <NavLink to="/my-learning">My Learning</NavLink>}
          {user?.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
          {!user && <NavLink to="/login">Login</NavLink>}
          {!user && <NavLink to="/register">Register</NavLink>}
          {user && (
            <button onClick={handleLogout} className="rounded-full bg-emerald-400 px-4 py-2 font-semibold text-slate-950">
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
