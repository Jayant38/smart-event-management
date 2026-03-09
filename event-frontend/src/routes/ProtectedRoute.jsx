import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const location = useLocation();

  // 🚫 Not logged in
  if (!token) {
    return <Navigate to="/login" />;
  }

  // 🔥 Auto redirect ADMIN away from /dashboard
  if (
    userRole === "ROLE_ADMIN" &&
    location.pathname === "/dashboard"
  ) {
    return <Navigate to="/admin" />;
  }

  // 🔐 Role-based protection
  if (role && userRole !== role) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;