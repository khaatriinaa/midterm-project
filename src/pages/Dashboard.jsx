import { useBookings } from "../contexts/BookingContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../components/ConfirmationModal";

export default function Dashboard() {
  const { bookings, cancelBooking } = useBookings();
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  const handleConfirm = () => {
    cancelBooking(selectedId);
    setSelectedId(null);
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold text-theme">My Bookings</h2>

      {bookings.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-3 text-center p-5">
          <h5 className="fw-bold text-secondary mb-3">
            You don’t have any bookings yet
          </h5>
          <p className="text-muted mb-4">
            Start booking your space now to secure your slot.
          </p>
          <button
            className="book-btn px-4 py-2 fw-semibold text-white w-100"
            onClick={() => navigate("/home")}
          >
            <i className="bi bi-plus-circle me-2"></i> Book a Space
          </button>
        </div>
      ) : (
        <div className="row g-3">
          {bookings.map((b) => (
            <div key={b.id} className="col-md-6 col-lg-4">
              <div className="card shadow-sm border-0 rounded-3 h-100 booking-card">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-dark fw-bold">{b.spaceName}</h5>
                  <p className="card-text text-muted mb-1">
                    <i className="bi bi-calendar-event me-2"></i>
                    <strong>Date:</strong> {b.date}
                  </p>
                  <p className="card-text text-muted mb-1">
                    <i className="bi bi-clock me-2"></i>
                    <strong>Slot:</strong> {b.slot}
                  </p>
                  <p className="card-text text-muted mb-3">
                    <i className="bi bi-people me-2"></i>
                    <strong>Seats:</strong> {b.seats}
                  </p>

                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <span className="badge bg-success px-3 py-2">
                      Active Booking
                    </span>
                    <button
                      className="btn btn-danger btn-sm rounded-pill shadow-sm"
                      onClick={() => setSelectedId(b.id)}
                    >
                      <i className="bi bi-x-circle me-1"></i> Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal 
        show={!!selectedId} 
        onClose={() => setSelectedId(null)} 
        onConfirm={handleConfirm} 
      />
    </div>
  );
}
