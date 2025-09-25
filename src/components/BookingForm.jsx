import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useBookings } from "../contexts/BookingContext";
import { useNavigate } from "react-router-dom";

export default function BookingForm({ space }) {
  const { user } = useAuth();
  const { bookings, addBooking } = useBookings();
  const [slot, setSlot] = useState(space.time_slots?.[0] || "");
  const [seats, setSeats] = useState(1);
  const [date, setDate] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const capacity = space.capacity || 50;
  const totalBooked = bookings
    .filter((b) => b.spaceId === space.id)
    .reduce((sum, b) => sum + (b.seats || 1), 0);

  // Parse time string into minutes since midnight
  const parseTime = (timeStr) => {
    const match = timeStr.match(/(\d+)(?::(\d+))?\s*(am|pm)/i);
    if (!match) return 0;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2] || "0", 10);
    const period = match[3].toLowerCase();
    if (period === "pm" && hours !== 12) hours += 12;
    if (period === "am" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  // Get current date + time
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Filter out expired slots (but keep Full Day / 24 Hours)
  const validSlots = (space.time_slots || []).filter((t) => {
    if (!date || date !== today) return true; // future dates = all slots available

    // Always keep full-day or 24-hour slots
    if (/full\s*day/i.test(t) || /24\s*hours?/i.test(t)) {
      return true;
    }

    // Otherwise, check time range
    const [start, end] = t.split("-");
    if (!end) return true; // in case of badly formatted slot
    const endMinutes = parseTime(end);
    return currentMinutes < endMinutes;
  });

  // Count how many are booked for this space + slot + date
  const bookedCount = bookings
    .filter((b) => b.spaceId === space.id && b.slot === slot && b.date === date)
    .reduce((sum, b) => sum + (b.seats || 1), 0);

  const available = capacity - bookedCount;

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
          onChange={(e) => {
            const newDate = e.target.value;
            setDate(newDate);

            if (newDate === today) {
              // Auto-pick first still-valid slot for today
              const nextValid =
                (space.time_slots || []).filter((t) => {
                  if (/full\s*day/i.test(t) || /24\s*hours?/i.test(t)) return true;
                  const [start, end] = t.split("-");
                  if (!end) return true;
                  const endMinutes = parseTime(end);
                  return currentMinutes < endMinutes;
                })[0] || "";
              setSlot(nextValid);
            } else {
              // Future dates → first slot
              setSlot(space.time_slots?.[0] || "");
            }
          }}
        />

        {/* ✅ Dynamic Time Slots */}
        <label className="form-label">Select Time Slot</label>
        <select
          className="form-select mb-3"
          value={slot}
          onChange={(e) => setSlot(e.target.value)}
        >
          {validSlots.length > 0 ? (
            validSlots.map((t, i) => (
              <option key={i} value={t}>
                {t}
              </option>
            ))
          ) : (
            <option disabled>No time slots available today</option>
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
          Already booked: {totalBooked} <br />
          Available: {capacity - totalBooked}
        </p>

        <button
          type="submit"
          className="book-btn px-4 py-2 fw-semibold text-white w-100"
          disabled={available <= 0 || validSlots.length === 0}
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
                  className="fw-semibold btn-secondary"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
                <button className="btn-primary" onClick={confirmBooking}>
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
