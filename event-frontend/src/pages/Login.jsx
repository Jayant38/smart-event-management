import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const res = await api.post("/auth/login", {
        email,
        password
      });

      console.log("Login response:", res.data);

      // Handle both response structures
      const token = res.data.token || res.data.data?.token;
      const role = res.data.role || res.data.data?.role;

      if (!token || !role) {
        throw new Error("Invalid login response");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // Role based redirect
      if (role === "ROLE_ADMIN") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {

      console.error("Login error:", err);

      alert("Invalid email or password");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="container-fluid vh-100">

      <div className="row h-100">

        {/* LEFT IMAGE SECTION */}

        <div className="col-md-7 d-none d-md-block p-0">

          <img
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87"
            alt="event"
            className="w-100 h-100"
            style={{ objectFit: "cover" }}
          />

        </div>

        {/* LOGIN FORM */}

        <div className="col-md-5 d-flex align-items-center justify-content-center">

          <div className="card shadow border-0 p-4" style={{ width: "400px" }}>

            <h3 className="text-center mb-4 fw-bold">
              Login to Smart Event
            </h3>

            <form onSubmit={handleLogin}>

              <input
                type="email"
                placeholder="Email"
                className="form-control mb-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                className="form-control mb-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                className="btn btn-success w-100"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

            </form>

            <p className="text-center mt-3">

              Don't have an account?

              <span
                className="text-primary ms-2"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/register")}
              >
                Register
              </span>

            </p>

          </div>

        </div>

      </div>

    </div>

  );
};

export default Login;