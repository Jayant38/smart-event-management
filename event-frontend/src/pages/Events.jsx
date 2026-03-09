import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

function Events() {

  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get("/events")
      .then(res => setEvents(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="container mt-5">
      <h2>Events</h2>
      {events.map(event => (
        <div key={event.id} className="card p-3 mb-2">
          <h5>{event.title}</h5>
          <p>{event.description}</p>
          <p>Price: ₹{event.price}</p>
        </div>
      ))}
    </div>
  );
}

export default Events;