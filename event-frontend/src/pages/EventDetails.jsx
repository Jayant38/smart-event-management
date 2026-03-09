import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ⭐ Fix Marker Icon
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const EventDetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  // ⭐ Fetch Event
  useEffect(() => {

    api.get(`/events/${id}`)
      .then(res => setEvent(res.data))
      .catch(err => console.log(err));

  }, [id]);


  // ⭐ Countdown Timer
  useEffect(() => {

    if (!event) return;

    const interval = setInterval(() => {

      const now = new Date().getTime();
      const eventTime = new Date(event.eventDate).getTime();

      const diff = eventTime - now;

      if (diff <= 0) {
        setTimeLeft("Event Started");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

      setTimeLeft(`${days} days ${hours} hrs left`);

    }, 1000);

    return () => clearInterval(interval);

  }, [event]);


  // ⭐ Razorpay Booking
  const handleBook = async () => {

    if (!event) return;

    try {

      setLoading(true);

      const res = await api.post(`/bookings/create-order/${id}`);
      const order = res.data;

      const options = {

        key: "rzp_test_SI5jtIOGwZB4jh",
        amount: event.price * 100,
        currency: "INR",

        name: "Smart Event Management",
        description: event.title,

        order_id: order.paymentId,

        handler: async function (response) {

          try {

            await api.post("/bookings/verify", {

              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature

            });

            navigate("/success", {
              state: { paymentId: response.razorpay_payment_id }
            });

          } catch (err) {

            navigate("/failed");

          } finally {

            setLoading(false);

          }

        },

        modal: {
          ondismiss: function () {
            setLoading(false);
            navigate("/failed");
          }
        }

      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {

      setLoading(false);
      navigate("/failed");

    }

  };


  // ⭐ Google Calendar
  const addToCalendar = () => {

    if (!event) return;

    const start = new Date(event.eventDate);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

    const startDate = start.toISOString().replace(/[-:]|\.\d+/g, "");
    const endDate = end.toISOString().replace(/[-:]|\.\d+/g, "");

    const location = `${event.latitude},${event.longitude}`;

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE
    &text=${encodeURIComponent(event.title)}
    &dates=${startDate}/${endDate}
    &details=${encodeURIComponent(event.description)}
    &location=${encodeURIComponent(location)}`;

    window.open(url, "_blank");

  };


  // ⭐ Share Event (WhatsApp + Mobile Share)
  const shareEvent = async () => {

    if (!event) return;

    const shareData = {
      title: event.title,
      text: `Check out this event: ${event.title}`,
      url: window.location.href
    };

    try {

      if (navigator.share) {

        await navigator.share(shareData);

      } else {

        const whatsappURL =
          `https://wa.me/?text=${encodeURIComponent(
            shareData.text + " " + shareData.url
          )}`;

        window.open(whatsappURL, "_blank");

      }

    } catch (err) {

      console.log("Share cancelled");

    }

  };


  if (!event)
    return <p className="text-center mt-5">Loading...</p>;


  return (

    <div className="container mt-5">

      <button
        className="btn btn-secondary mb-4"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>


      <div className="card shadow mb-4">

        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87"
          alt="event"
          style={{
            width: "100%",
            height: "300px",
            objectFit: "cover"
          }}
        />

        <div className="card-body">

          <h2>{event.title}</h2>

          <p className="text-muted">
            {event.description}
          </p>

        </div>

      </div>


      <div className="row">

        {/* LEFT SECTION */}

        <div className="col-md-6">

          <div className="card shadow p-4">

            <h4 className="mb-3">Event Details</h4>

            <p><strong>Price:</strong> ₹{event.price}</p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(event.eventDate).toLocaleString()}
            </p>

            <p><strong>Available Seats:</strong> {event.availableSeats}</p>


            {/* Countdown */}

            <p className="text-danger fw-bold">
              ⏳ {timeLeft}
            </p>


            {/* Seats Progress */}

            <div className="progress mb-3">

              <div
                className="progress-bar bg-success"
                style={{
                  width: `${event.availableSeats}%`
                }}
              >
                {event.availableSeats} Seats Left
              </div>

            </div>


            {/* Buttons */}

            <div className="d-flex gap-2">

              <button
                className="btn btn-success flex-fill"
                onClick={handleBook}
                disabled={loading}
              >

                {loading ? "Processing..." : "Book Now"}

              </button>

              <button
                className="btn btn-outline-danger flex-fill"
                onClick={addToCalendar}
              >
                📅 Calendar
              </button>

            </div>


            {/* Share Button */}

            <button
              className="btn btn-outline-secondary w-100 mt-3"
              onClick={shareEvent}
            >
              🔗 Share Event
            </button>

          </div>

        </div>


        {/* MAP SECTION */}

        <div className="col-md-6">

          <div className="card shadow p-3">

            <h5 className="mb-3">📍 Event Location</h5>

            {event.latitude && event.longitude ? (

              <MapContainer
                center={[event.latitude, event.longitude]}
                zoom={13}
                style={{
                  height: "300px",
                  width: "100%"
                }}
              >

                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker
                  position={[event.latitude, event.longitude]}
                  icon={markerIcon}
                >

                  <Popup>{event.title}</Popup>

                </Marker>

              </MapContainer>

            ) : (

              <p className="text-muted">
                Location not available
              </p>

            )}

            {event.latitude && event.longitude && (

              <a
                href={`https://www.google.com/maps?q=${event.latitude},${event.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline-primary mt-3 w-100"
              >

                Open in Google Maps

              </a>

            )}

          </div>

        </div>

      </div>

    </div>

  );

};

export default EventDetails;