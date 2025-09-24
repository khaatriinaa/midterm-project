import { useParams, useNavigate } from "react-router-dom"; // <-- added useNavigate
import { useState } from "react";
import spaces from "../data/spaces.json";
import BookingForm from "../components/BookingForm";
import { useBookings } from "../contexts/BookingContext";

export default function SpaceDetail() {
  const { spaceId } = useParams();
  const navigate = useNavigate(); // <-- added navigate
  const space = spaces.find((s) => s.id === parseInt(spaceId));
  const { bookings } = useBookings();
  const [showModal, setShowModal] = useState(false);

  if (!space) return <p>Space not found.</p>;

  const capacity = space.capacity || 50;
  const totalBooked = bookings
    .filter((b) => b.spaceId === space.id)
    .reduce((sum, b) => sum + (b.seats || 1), 0);

  return (
    <div className="container py-4">
      {/* Back Button */}
      <button
        className="btn btn-secondary mb-3"
        onClick={() => navigate(-1)} // <-- go back to previous page
      >
        &larr; Back
      </button>

      {/* Top full image */}
      <div className="card shadow-sm border-0 mb-4">
        <img
          src={space.main_image}
          alt={space.name}
          className="card-img-top"
          style={{ objectFit: "cover", height: "400px" }}
        />
      </div>

      {/* Details */}
      <div className="card shadow-sm border-0 p-4 mb-4">
        <h2 className="fw-bold mb-2">{space.name}</h2>
        <p className="text-muted mb-3">{space.location}</p>
        <p className="mb-4">{space.description}</p>

        {/* Amenities */}
        <h5 className="fw-semibold">Amenities</h5>
        <ul className="mb-4">
          {space.amenities.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>

        {/* Capacity info */}
        <div className="capacity-box">
          <strong>Capacity:</strong> {capacity} <br />
          <strong>Currently Booked:</strong> {totalBooked} <br />
          <strong>Available:</strong> {capacity - totalBooked}
        </div>
      </div>

      {/* Booking Button */}
      <div className="text-center">
        <button
          className="btn btn-primary px-4 py-2 fw-semibold"
          onClick={() => setShowModal(true)}
        >
          Book Now
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header">
                <h5 className="modal-title">Book {space.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <BookingForm space={space} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
