import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {

  const navigate = useNavigate();
  const location = useLocation();

  // Direct token check
  const token = localStorage.getItem("token");

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");

    navigate("/");
    window.location.reload(); // Navbar refresh

  };

  return (

    <nav className="navbar navbar-dark bg-dark px-4">

      {/* Logo */}
      <Link to="/" className="navbar-brand fw-bold">
        Smart Event
      </Link>

      <div className="d-flex align-items-center gap-3">

        {!token ? (

          <>
            <Link to="/login" className="btn btn-outline-light btn-sm">
              Login
            </Link>

            <Link to="/register" className="btn btn-primary btn-sm">
              Sign Up
            </Link>
          </>

        ) : (

          <>

            {/* Dashboard */}
            <Link
              to="/dashboard"
              className={`nav-link text-white ${
                location.pathname === "/dashboard"
                  ? "fw-bold border-bottom border-light"
                  : ""
              }`}
            >
              Dashboard
            </Link>

            {/* My Bookings */}
            <Link
              to="/my-bookings"
              className={`nav-link text-white ${
                location.pathname === "/my-bookings"
                  ? "fw-bold border-bottom border-light"
                  : ""
              }`}
            >
              My Bookings
            </Link>

            {/* Profile */}
            <Link
              to="/profile"
              className={`nav-link text-white ${
                location.pathname === "/profile"
                  ? "fw-bold border-bottom border-light"
                  : ""
              }`}
            >
              Profile
            </Link>

            {/* Logout */}
            <button
              className="btn btn-danger btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>

          </>

        )}

      </div>

    </nav>

  );
};

export default Navbar;