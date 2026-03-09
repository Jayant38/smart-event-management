import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaUsers,
  FaSignOutAlt
} from "react-icons/fa";

const AdminLayout = ({ children }) => {

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isActive = (path) =>
    location.pathname === path ? "active-link" : "";

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>

      {/* 🔥 Sidebar */}
      <div
        style={{
          width: "250px",
          background: "#111827",
          color: "white",
          padding: "20px"
        }}
      >
        <h4 className="mb-4 fw-bold">Admin Panel</h4>

        <div className="d-flex flex-column gap-3">

          <Link
            to="/admin"
            className={`text-decoration-none text-white ${isActive("/admin")}`}
          >
            <FaTachometerAlt className="me-2" />
            Dashboard
          </Link>

          <Link
            to="/admin/events"
            className={`text-decoration-none text-white ${isActive("/admin/events")}`}
          >
            <FaCalendarAlt className="me-2" />
            Manage Events
          </Link>

          <Link
            to="/admin/bookings"
            className={`text-decoration-none text-white ${isActive("/admin/bookings")}`}
          >
            <FaUsers className="me-2" />
            Bookings
          </Link>

        </div>

        <hr className="my-4" />

        <button
          className="btn btn-danger w-100"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="me-2" />
          Logout
        </button>
      </div>

      {/* 🔥 Content */}
      <div className="flex-grow-1 p-4 bg-light">
        {children}
      </div>

    </div>
  );
};

export default AdminLayout;