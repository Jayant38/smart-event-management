import { useNavigate, Link, useLocation } from "react-router-dom";
import { useState } from "react";

const UserLayout = ({ children }) => {

  const navigate = useNavigate();
  const location = useLocation();

  const [dark, setDark] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (

    <div className={dark ? "dark-mode" : "light-mode"}>

      {/* NAVBAR */}

      <nav className="navbar navbar-dark bg-dark px-4">

        <Link to="/dashboard" className="navbar-brand fw-bold">
          Smart Event
        </Link>

        <div className="d-flex align-items-center gap-3">

          <Link
            to="/dashboard"
            className={`nav-link text-white ${
              isActive("/dashboard") ? "fw-bold border-bottom border-light" : ""
            }`}
          >
            Dashboard
          </Link>

          <Link
            to="/my-bookings"
            className={`nav-link text-white ${
              isActive("/my-bookings") ? "fw-bold border-bottom border-light" : ""
            }`}
          >
            My Bookings
          </Link>

          {/* ⭐ PROFILE LINK */}

          <Link
            to="/profile"
            className={`nav-link text-white ${
              isActive("/profile") ? "fw-bold border-bottom border-light" : ""
            }`}
          >
            Profile
          </Link>

          {/* DARK MODE */}

          <button
            className="btn btn-outline-light btn-sm"
            onClick={() => setDark(!dark)}
          >
            {dark ? "☀ Light" : "🌙 Dark"}
          </button>

          {/* LOGOUT */}

          <button
            className="btn btn-danger btn-sm"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* PAGE CONTENT */}

      <div className="container py-4">
        {children}
      </div>

    </div>

  );
};

export default UserLayout;