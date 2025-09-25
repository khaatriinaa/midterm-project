import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useBookings } from "../contexts/BookingContext";
import { useNavigate } from "react-router-dom";

export default function BookingForm({ space }) {
  const { user } = useAuth();
  const { bookings, addBooking } = useBookings();
  const [slot, setSlot] = useState(space.time_slots?.[0] || ""); // ✅ first slot by default
  const [seats, setSeats] = useState(1);
  const [date, setDate] = useState(""); // ✅ booking date
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const capacity = space.capacity || 50;

  // ✅ Count how many are booked for this space + slot + date
  const bookedCount = bookings
    .filter((b) => b.spaceId === space.id && b.slot === slot && b.date === date)
    .reduce((sum, b) => sum + (b.seats || 1), 0);

  const available = capacity - bookedCount;

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      alert("You need to log in first.");
      navigate("/login");
      return;
    }

    if (user.fullName === "Guest") {
      alert("Guests cannot book. Please log in with an account.");
      navigate("/login");
      return;
    }

    if (!date) {
      alert("Please select a booking date.");
      return;
    }

    if (date < today) {
      alert("You cannot book past dates.");
      return;
    }

    if (!slot) {
      alert("Please select a time slot.");
      return;
    }

    if (available <= 0) {
      alert("This slot is full, please try another time.");
      return;
    }

    if (seats > available) {
      alert("Not enough seats available.");
      return;
    }

    setShowConfirm(true);
  };

  const confirmBooking = () => {
    addBooking({
      id: Date.now(),
      spaceId: space.id,
      spaceName: space.name,
      slot,
      date,
      seats,
      user: user.fullName,
    });
    setShowConfirm(false);

    navigate("/dashboard/my-bookings");
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mt-3">
        {/* ✅ Date Picker */}
        <label className="form-label">Select Date</label>
        <input
          type="date"
          className="form-control mb-3"
          value={date}
          min={today}
          onChange={(e) => setDate(e.target.value)}
        />

        {/* ✅ Dynamic Time Slots */}
        <label className="form-label">Select Time Slot</label>
        <select
          className="form-select mb-3"
          value={slot}
          onChange={(e) => setSlot(e.target.value)}
        >
          {space.time_slots && space.time_slots.length > 0 ? (
            space.time_slots.map((t, i) => (
              <option key={i} value={t}>
                {t}
              </option>
            ))
          ) : (
            <option disabled>No time slots available</option>
          )}
        </select>

        <label className="form-label">Number of Seats</label>
        <input
          type="number"
          className="form-control mb-3"
          min="1"
          max={available}
          value={seats}
          onChange={(e) => setSeats(parseInt(e.target.value) || 1)}
          disabled={available <= 0}
        />

        <p className="text-muted small mb-3">
          Capacity: {capacity} <br />
          Already booked: {bookedCount} <br />
          Available:{" "}
          <strong className={available <= 0 ? "text-danger" : ""}>
            {available}
          </strong>
        </p>

        <button
          type="submit"
          className="btn btn-success w-100"
          disabled={available <= 0}
        >
          Book Now
        </button>
      </form>

      {showConfirm && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Booking</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowConfirm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  You are booking <strong>{seats}</strong> seat(s) at{" "}
                  <strong>{space.name}</strong> on <strong>{date}</strong> for
                  the slot: <strong>{slot}</strong>.
                </p>
                <p>
                  Remaining after booking:{" "}
                  <strong>{available - seats}</strong> seats.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={confirmBooking}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
