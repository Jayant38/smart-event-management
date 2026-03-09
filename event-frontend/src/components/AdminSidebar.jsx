import { useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaCalendarAlt, FaUsers, FaSignOutAlt } from "react-icons/fa";

const AdminSidebar = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div
      className="bg-dark text-white p-3"
      style={{ width: "250px" }}
    >
      <h4 className="mb-4">Admin Panel</h4>

      <ul className="list-unstyled">

        <li className="mb-3" onClick={() => navigate("/admin")}>
          <FaTachometerAlt className="me-2" />
          Dashboard
        </li>

        <li className="mb-3" onClick={() => navigate("/admin/events")}>
          <FaCalendarAlt className="me-2" />
          Manage Events
        </li>

        <li className="mb-3" onClick={() => navigate("/admin/bookings")}>
          <FaUsers className="me-2" />
          Bookings
        </li>

        <li className="mt-5 text-danger" onClick={handleLogout}>
          <FaSignOutAlt className="me-2" />
          Logout
        </li>

      </ul>
    </div>
  );
};

export default AdminSidebar;