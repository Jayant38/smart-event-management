import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

const AdminBookings = () => {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5;

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {

    api.get("/admin/bookings")
      .then(res => {

        const result = res.data?.data || [];

        setBookings(result);
        setLoading(false);

      })
      .catch(err => {

        console.log("Error loading bookings:", err);
        setLoading(false);

      });

  }, []);

  // Row click
  const handleRowClick = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  // ⭐ Confirm Booking
  const confirmBooking = async (id) => {

    try {

      await api.put(`/bookings/${id}/confirm`);

      alert("Booking Confirmed");

      window.location.reload();

    } catch (err) {

      console.log(err);

    }

  };

  // ⭐ Cancel Booking
  const cancelBooking = async (id) => {

    try {

      await api.put(`/bookings/${id}/cancel`);

      alert("Booking Cancelled");

      window.location.reload();

    } catch (err) {

      console.log(err);

    }

  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <p>Loading bookings...</p>
      </div>
    );
  }

  // Search + Filter
  const filteredBookings = bookings.filter((b) => {

    const matchSearch =
      b.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
      b.eventTitle?.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "ALL" || b.status === statusFilter;

    return matchSearch && matchStatus;

  });

  // Pagination
  const indexOfLast = currentPage * bookingsPerPage;
  const indexOfFirst = indexOfLast - bookingsPerPage;

  const currentBookings = filteredBookings.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  return (
    <div className="container mt-5">

      <h2 className="mb-4">All Bookings</h2>

      {/* Search + Filter */}
      <div className="d-flex gap-3 mb-3">

        <input
          type="text"
          className="form-control"
          placeholder="Search by email or event..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        <select
          className="form-select"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
        >

          <option value="ALL">All</option>
          <option value="PENDING">Pending</option>
          <option value="CREATED">Created</option>
          <option value="CONFIRMED">Confirmed</option>

        </select>

      </div>

      {/* Table */}
      <div className="card p-3 shadow-sm">

        <table className="table table-bordered table-hover">

          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Event</th>
              <th>Status</th>
              <th>Payment ID</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>

            {currentBookings.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center">
                  No bookings found.
                </td>
              </tr>
            )}

            {currentBookings.map((b) => (

              <tr
                key={b.bookingId}
                style={{ cursor: "pointer" }}
                onClick={() => handleRowClick(b)}
              >

                <td>{b.bookingId}</td>

                <td>{b.userEmail}</td>

                <td>{b.eventTitle}</td>

                <td>

                  {b.status === "CONFIRMED" && (
                    <span className="badge bg-success">CONFIRMED</span>
                  )}

                  {b.status === "CREATED" && (
                    <span className="badge bg-warning text-dark">CREATED</span>
                  )}

                  {b.status === "PENDING" && (
                    <span className="badge bg-secondary">PENDING</span>
                  )}

                </td>

                <td>{b.paymentId || "-"}</td>

                <td>{b.date || "-"}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center align-items-center gap-3 mt-4">

        <button
          className="btn btn-outline-primary"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          className="btn btn-outline-primary"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>

      </div>

      {/* Modal */}
      {showModal && selectedBooking && (

        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >

          <div className="modal-dialog modal-dialog-centered">

            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Booking Details</h5>

                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>

              </div>

              <div className="modal-body">

                <p><strong>User:</strong> {selectedBooking.userEmail}</p>

                <p><strong>Event:</strong> {selectedBooking.eventTitle}</p>

                <p><strong>Status:</strong> {selectedBooking.status}</p>

                <p><strong>Payment ID:</strong> {selectedBooking.paymentId}</p>

                <p><strong>Date:</strong> {selectedBooking.date}</p>

              </div>

              <div className="modal-footer">

                <button
                  className="btn btn-success"
                  onClick={() => confirmBooking(selectedBooking.bookingId)}
                >
                  Confirm Booking
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() => cancelBooking(selectedBooking.bookingId)}
                >
                  Cancel Booking
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );

};

export default AdminBookings;