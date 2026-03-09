import { Link } from "react-router-dom";

const LandingNavbar = () => {

  const token = localStorage.getItem("token");

  // Agar user login hai to landing navbar hide
  if (token) return null;

  return (

    <nav className="glass-navbar">

      <div className="container d-flex justify-content-between align-items-center">

        {/* Logo */}
        <Link to="/" className="navbar-brand text-white fw-bold fs-4">
          Smart Event
        </Link>

        {/* Buttons */}
        <div className="d-flex gap-2">

          <Link
            to="/login"
            className="btn btn-outline-light btn-sm px-3"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="btn btn-primary btn-sm px-3"
          >
            Sign Up
          </Link>

        </div>

      </div>

    </nav>

  );

};

export default LandingNavbar;