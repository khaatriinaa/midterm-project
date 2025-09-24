import { useBookings } from "../contexts/BookingContext";
import { useState } from "react";
import ConfirmationModal from "../components/ConfirmationModal";

export default function Dashboard() {
  const { bookings, cancelBooking } = useBookings();
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div className="container py-4">
      <h2>My Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <ul className="list-group">
          {bookings.map((b) => (
            <li key={b.id} className="list-group-item d-flex justify-content-between align-items-center">
              {b.spaceName} - {b.slot}
              <button className="btn btn-danger btn-sm" onClick={() => setSelectedId(b.id)}>
                Cancel
              </button>
            </li>
          ))}
        </ul>
      )}
      <ConfirmationModal
        show={!!selectedId}
        onConfirm={() => {
          cancelBooking(selectedId);
          setSelectedId(null);
        }}
        onCancel={() => setSelectedId(null)}
      />
    </div>
  );
}
