import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

const Register = () => {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {

    e.preventDefault();

    try{

      await api.post("/auth/register",{
        name,
        email,
        password
      });

      alert("Registration Successful");

      navigate("/login");

    }catch(err){
      alert("Registration Failed");
    }

  };

  return (

    <div className="container-fluid vh-100">

      <div className="row h-100">

        {/* LEFT IMAGE */}

        <div className="col-md-7 d-none d-md-block p-0">

          <img
            src="https://images.unsplash.com/photo-1511578314322-379afb476865"
            alt="event"
            className="w-100 h-100"
            style={{objectFit:"cover"}}
          />

        </div>


        {/* REGISTER FORM */}

        <div className="col-md-5 d-flex align-items-center justify-content-center">

          <div className="card shadow p-4" style={{width:"420px"}}>

            <h3 className="text-center mb-4">
              Create Smart Event Account
            </h3>

            <form onSubmit={handleRegister}>

              <input
                type="text"
                placeholder="Full Name"
                className="form-control mb-3"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                required
              />

              <input
                type="email"
                placeholder="Email"
                className="form-control mb-3"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                className="form-control mb-3"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
              />

              <button className="btn btn-primary w-100">
                Create Account
              </button>

            </form>

            <p className="text-center mt-3">

              Already have an account ?

              <span
                className="text-primary ms-2"
                style={{cursor:"pointer"}}
                onClick={()=>navigate("/login")}
              >
                Login
              </span>

            </p>

          </div>

        </div>

      </div>

    </div>

  );

};

export default Register;