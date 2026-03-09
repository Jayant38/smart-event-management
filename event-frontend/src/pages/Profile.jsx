import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { FaUserCircle } from "react-icons/fa";

const Profile = () => {

  const [user, setUser] = useState(null);

  useEffect(() => {

    api.get("/users/me")
      .then(res => setUser(res.data))
      .catch(err => console.log(err));

  }, []);

  if (!user) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (

    <div className="container mt-4">

      <h2 className="fw-bold mb-4">My Profile</h2>

      <div className="card shadow-sm border-0 p-4 text-center">

        {/* ⭐ Avatar */}

        <FaUserCircle
          size={110}
          className="text-secondary mb-3"
        />

        <h4 className="fw-bold">{user.name}</h4>

        <p className="text-muted">{user.email}</p>

        <hr/>

        <div className="row text-start mt-3">

          <div className="col-md-6 mb-3">
            <p className="mb-1 text-muted">Name</p>
            <h6>{user.name}</h6>
          </div>

          <div className="col-md-6 mb-3">
            <p className="mb-1 text-muted">Email</p>
            <h6>{user.email}</h6>
          </div>

          <div className="col-md-6 mb-3">
            <p className="mb-1 text-muted">Role</p>
            <h6>{user.role}</h6>
          </div>

        </div>

      </div>

    </div>

  );

};

export default Profile;