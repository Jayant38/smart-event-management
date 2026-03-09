import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

const Dashboard = () => {

  const [events, setEvents] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [search, setSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState("ALL");

  const navigate = useNavigate();

  const userId = localStorage.getItem("userId") || 1;

  useEffect(() => {

    loadAllEvents();
    loadRecommended();

  }, []);

  // Load all events

  const loadAllEvents = async () => {

    try {

      const res = await api.get("/events");

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];

      setEvents(data);

    } catch (err) {

      console.log(err);

    }

  };

  // Load recommended events

  const loadRecommended = async () => {

    try {

      const res = await api.get(`/events/recommendations/${userId}`);

      setRecommended(res.data);

    } catch (err) {

      console.log(err);

    }

  };

  // Category filter

  const filterCategory = async (category) => {

    try {

      const res = await api.get(`/events/category/${category}`);

      setEvents(res.data);

    } catch (err) {

      console.log(err);

    }

  };

  // Filtering logic

  const filteredEvents = events.filter(event => {

    const matchesSearch =
      event.title?.toLowerCase().includes(search.toLowerCase());

    const matchesPrice =
      priceFilter === "ALL" ||
      (priceFilter === "LOW" && event.price <= 200) ||
      (priceFilter === "HIGH" && event.price > 200);

    return matchesSearch && matchesPrice;

  });

  return (

    <div className="container mt-4">

      {/* AI Recommended Section */}

      {recommended.length > 0 && (

        <>
          <h3 className="mt-4 mb-2">
            🤖 AI Recommended Events For You
          </h3>

          <p className="text-muted mb-4">
            These events are recommended based on your previous bookings and interests.
          </p>

          <div className="row mb-5">

            {recommended.map(event => (

              <div className="col-md-4 mb-3" key={event.id}>

                <div className="card shadow border border-danger">

                  <img
                    src={
                      event.imageUrl
                        ? `http://localhost:1010/uploads/${event.imageUrl}`
                        : "https://images.unsplash.com/photo-1540575467063-178a50c2df87"
                    }
                    className="card-img-top"
                    style={{ height: "180px", objectFit: "cover" }}
                    alt="event"
                  />

                  <div className="card-body">

                    <h5 className="fw-bold">
                      {event.title}
                    </h5>

                    <div className="mb-2">

                      <span className="badge bg-danger me-2">
                        🤖 AI Pick
                      </span>

                      <span className="badge bg-secondary">
                        {event.category}
                      </span>

                    </div>

                    <p className="text-success fw-bold">
                      ₹ {event.price}
                    </p>

                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => navigate(`/event/${event.id}`)}
                    >
                      View Details
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>
        </>

      )}

      {/* Browse Events */}

      <h2 className="mb-4 fw-bold">
        Browse Events
      </h2>

      {/* Category Filter */}

      <div className="mb-3">

        <button
          className="btn btn-outline-primary me-2"
          onClick={() => filterCategory("Tech")}
        >
          Tech
        </button>

        <button
          className="btn btn-outline-success me-2"
          onClick={() => filterCategory("Music")}
        >
          Music
        </button>

        <button
          className="btn btn-outline-warning me-2"
          onClick={() => filterCategory("Sports")}
        >
          Sports
        </button>

        <button
          className="btn btn-outline-dark"
          onClick={loadAllEvents}
        >
          All
        </button>

      </div>

      {/* Search + Price Filter */}

      <div className="row mb-4">

        <div className="col-md-6">

          <input
            type="text"
            placeholder="Search events..."
            className="form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        <div className="col-md-3">

          <select
            className="form-control"
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
          >

            <option value="ALL">
              All Prices
            </option>

            <option value="LOW">
              Under ₹200
            </option>

            <option value="HIGH">
              Above ₹200
            </option>

          </select>

        </div>

      </div>

      {/* Event Cards */}

      <div className="row">

        {filteredEvents.length === 0 && (

          <p className="text-muted text-center">
            No events found
          </p>

        )}

        {filteredEvents.map(event => (

          <div className="col-md-4 mb-4" key={event.id}>

            <div className="card event-card shadow-sm border-0 h-100">

              <img
                src={
                  event.imageUrl
                    ? `http://localhost:1010/uploads/${event.imageUrl}`
                    : "https://images.unsplash.com/photo-1540575467063-178a50c2df87"
                }
                className="card-img-top"
                alt="event"
                style={{
                  height: "180px",
                  objectFit: "cover"
                }}
              />

              <div className="card-body d-flex flex-column">

                <h5 className="fw-bold">
                  {event.title}
                </h5>

                <span className="badge bg-secondary mb-2">
                  {event.category}
                </span>

                <p className="text-muted small">
                  {event.description}
                </p>

                <div className="d-flex justify-content-between align-items-center mt-auto">

                  <span className="badge bg-success fs-6">
                    ₹ {event.price}
                  </span>

                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/event/${event.id}`)}
                  >
                    View Details
                  </button>

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

};

export default Dashboard;