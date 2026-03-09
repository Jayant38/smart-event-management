import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const MyBookings = () => {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {

    try {

      const res = await api.get("/bookings/my");

      const bookingData = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];

      setBookings(bookingData);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  const getStatusBadge = (status) => {

    if (status === "CONFIRMED")
      return <span className="badge bg-success">Confirmed</span>;

    if (status === "PENDING")
      return <span className="badge bg-secondary">Pending</span>;

    if (status === "CREATED")
      return <span className="badge bg-warning text-dark">Created</span>;

    return <span className="badge bg-danger">Failed</span>;

  };

  // ⭐ Download Ticket PDF
  const downloadTicket = async (id) => {

    const element = document.getElementById(`ticket-${id}`);

    const canvas = await html2canvas(element);

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();

    pdf.addImage(imgData, "PNG", 10, 10, 180, 100);

    pdf.save(`ticket-${id}.pdf`);

  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div>

      <h2 className="fw-bold mb-4">My Bookings</h2>

      <div className="row">

        {bookings.map((b) => (

          <div key={b.bookingId} className="col-md-6 mb-4">

            {/* ⭐ Ticket Card */}
            <div
              id={`ticket-${b.bookingId}`}
              className="card shadow border-0 p-4"
            >

              <h4 className="fw-bold mb-3">🎟 Event Ticket</h4>

              <p>
                <strong>Event:</strong> {b.eventTitle}
              </p>

              {/* ⭐ Event Date */}
              {b.eventDate && (
             <p>
             <strong>Date:</strong>{" "}
             {new Date(b.eventDate).toLocaleString()}
             </p>
              )}
              <p>
                <strong>Status:</strong>{" "}
                {getStatusBadge(b.status)}
              </p>

              <p>
                <strong>Payment ID:</strong>{" "}
                {b.paymentId || "-"}
              </p>

              {/* ⭐ Divider */}
              <hr className="my-3"/>

              {/* ⭐ QR Code */}
              {b.qrCode && b.status === "CONFIRMED" && (

                <div className="text-center mt-3">

                  <img
                    src={`data:image/png;base64,${b.qrCode}`}
                    width="140"
                    alt="QR"
                  />

                </div>

              )}

              {/* ⭐ Download Button */}
              {b.status === "CONFIRMED" && (

                <button
                  className="btn btn-outline-primary w-100 mt-3"
                  onClick={() => downloadTicket(b.bookingId)}
                >
                  Download PDF Ticket
                </button>

              )}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default MyBookings;