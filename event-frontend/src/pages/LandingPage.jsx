import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

const LandingPage = () => {

  const [events,setEvents] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(()=>{

    api.get("/events")
    .then(res => {

      const data = Array.isArray(res.data)
      ? res.data
      : res.data.data || [];

      setEvents(data.slice(0,3));

    })
    .catch(err => console.log(err));

  },[]);

  return (

    <div>

      {/* HERO SECTION */}

      <section className="hero-section">

        <div className="container">

          <div className="row align-items-center">

            <div className="col-md-6">

              <h1 className="hero-title">
                Discover Amazing Tech Events
              </h1>

              <p className="hero-text mt-3">
                Book conferences, workshops and networking events 
                from the best tech communities.
              </p>

              <div className="mt-4">

                <button
                className="btn btn-light me-3"
                onClick={()=>navigate(token?"/dashboard":"/login")}
                >
                  Browse Events
                </button>

                <button
                className="btn btn-outline-light"
                onClick={()=>navigate("/register")}
                >
                  Get Started
                </button>

              </div>

            </div>

            <div className="col-md-6 text-center">

              <img
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87"
              alt="event"
              className="img-fluid hero-image"
              />

            </div>

          </div>

        </div>

      </section>


      {/* FEATURED EVENTS */}

      <section className="container py-5">

        <h2 className="text-center mb-5 fw-bold">
          Featured Events
        </h2>

        <div className="row">

          {events.map(event => (

            <div className="col-md-4 mb-4" key={event.id}>

              <div className="card event-card shadow-sm h-100">

                <img
                src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678"
                className="card-img-top"
                alt="event"
                />

                <div className="card-body">

                  <h5 className="fw-bold">
                    {event.title}
                  </h5>

                  <p className="text-muted">
                    {event.description}
                  </p>

                  <div className="d-flex justify-content-between align-items-center">

                    <span className="badge bg-success fs-6">
                      ₹ {event.price}
                    </span>

                    <button
                    className="btn btn-primary"
                    onClick={()=>navigate(token?`/event/${event.id}`:"/login")}
                    >
                      View Event
                    </button>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* WHY CHOOSE */}

      <section className="bg-light py-5">

        <div className="container text-center">

          <h2 className="mb-5 fw-bold">
            Why Choose Smart Event
          </h2>

          <div className="row">

            <div className="col-md-4">

              <h4>🎟 Easy Booking</h4>

              <p>
                Secure your seat instantly with online payment.
              </p>

            </div>

            <div className="col-md-4">

              <h4>📍 Event Locations</h4>

              <p>
                View event locations on interactive maps.
              </p>

            </div>

            <div className="col-md-4">

              <h4>📧 Instant Tickets</h4>

              <p>
                Get QR ticket via email immediately.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* FOOTER */}

      <footer className="bg-dark text-white text-center p-4">

        <p className="m-0">
          Smart Event © 2026
        </p>

      </footer>

    </div>

  );

};

export default LandingPage;