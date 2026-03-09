import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

const AdminEvents = () => {

  const [events, setEvents] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [image, setImage] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    eventDate: "",
    latitude: "",
    longitude: "",
    availableSeats: "",
    category: ""
  });

  const fetchEvents = () => {
    api.get("/admin/events")
      .then(res => setEvents(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      price: "",
      eventDate: "",
      latitude: "",
      longitude: "",
      availableSeats: "",
      category: ""
    });
    setEditingId(null);
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const formData = new FormData();

      Object.keys(form).forEach(key => {
        formData.append(key, form[key]);
      });

      if (image) {
        formData.append("image", image);
      }

      if (editingId) {
        await api.put(`/events/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        await api.post("/events", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      fetchEvents();
      resetForm();

    } catch (err) {
      console.log(err);
    }
  };

  const handleToggle = async (id) => {
    try {
      await api.put(`/admin/events/toggle/${id}`);
      fetchEvents();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (event) => {
    setEditingId(event.id);
    setForm({
      title: event.title,
      description: event.description,
      price: event.price,
      eventDate: event.eventDate.slice(0,16),
      latitude: event.latitude,
      longitude: event.longitude,
      availableSeats: event.availableSeats,
      category: event.category || ""
    });
  };

  return (
    <div className="container mt-5">

      <h2 className="mb-4">Manage Events</h2>

      {/* FORM */}
      <div className="card p-4 mb-4 shadow-sm">
        <h5>{editingId ? "Edit Event" : "Create Event"}</h5>

        <form onSubmit={handleSubmit}>
          <div className="row">

            <div className="col-md-6 mb-2">
              <input className="form-control"
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-2">
              <input className="form-control"
                name="price"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-12 mb-2">
              <textarea className="form-control"
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-2">
              <input type="datetime-local"
                className="form-control"
                name="eventDate"
                value={form.eventDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-3 mb-2">
              <input className="form-control"
                name="latitude"
                placeholder="Latitude"
                value={form.latitude}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-3 mb-2">
              <input className="form-control"
                name="longitude"
                placeholder="Longitude"
                value={form.longitude}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-2">
              <input className="form-control"
                name="availableSeats"
                placeholder="Available Seats"
                value={form.availableSeats}
                onChange={handleChange}
                required
              />
            </div>

            {/* ⭐ CATEGORY */}
            <div className="col-md-6 mb-2">
              <select
                className="form-select"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >

                <option value="">Select Category</option>
                <option value="TECH">Tech</option>
                <option value="AI">AI</option>
                <option value="CLOUD">Cloud</option>
                <option value="WORKSHOP">Workshop</option>
                <option value="MUSIC">Music</option>

              </select>
            </div>

            {/* IMAGE UPLOAD */}
            <div className="col-md-12 mb-2">
              <input
                type="file"
                className="form-control"
                onChange={(e)=>setImage(e.target.files[0])}
              />
            </div>

            <div className="col-md-12 d-flex gap-2">
              <button className="btn btn-primary">
                {editingId ? "Update Event" : "Create Event"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>

          </div>
        </form>
      </div>

      {/* EVENT LIST */}
      {events.map(event => (
        <div key={event.id} className="card p-3 mb-3 shadow-sm">

          <div className="d-flex justify-content-between align-items-center">
            <h5>{event.title}</h5>

            <span className={`badge ${event.active ? "bg-success" : "bg-danger"}`}>
              {event.active ? "Active" : "Inactive"}
            </span>
          </div>

          {event.imageUrl && (
            <img
              src={`http://localhost:1010/uploads/${event.imageUrl}`}
              style={{width:"200px",marginTop:"10px"}}
              alt="event"
            />
          )}

          <p className="mt-2">{event.description}</p>

          <span className="badge bg-primary mb-2">
            {event.category}
          </span>

          <p>₹ {event.price}</p>

          <div className="d-flex gap-2">
            <button
              className="btn btn-warning btn-sm"
              onClick={() => handleEdit(event)}
            >
              Edit
            </button>

            <button
              className={`btn btn-sm ${event.active ? "btn-outline-danger" : "btn-outline-success"}`}
              onClick={() => handleToggle(event.id)}
            >
              {event.active ? "Deactivate" : "Activate"}
            </button>
          </div>

        </div>
      ))}

    </div>
  );
};

export default AdminEvents;