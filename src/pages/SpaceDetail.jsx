import { useParams, useNavigate } from "react-router-dom"; 
import { useState } from "react";
import spaces from "../data/spaces.json";
import BookingForm from "../components/BookingForm";
import { useBookings } from "../contexts/BookingContext";
import { useAuth } from "../contexts/AuthContext";

export default function SpaceDetail() {
  const { spaceId } = useParams();
  const navigate = useNavigate();
  const space = spaces.find((s) => s.id === parseInt(spaceId));
  const { bookings } = useBookings();
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  if (!space) return <p>Space not found.</p>;

  const capacity = space.capacity || 50;
  const totalBooked = bookings
    .filter((b) => b.spaceId === space.id)
    .reduce((sum, b) => sum + (b.seats || 1), 0);

  return (
    <div className="container py-4 animated">

      {/* Back and Book Button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button
          className="btn btn-secondary px-4 py-2 fw-semibold"
          onClick={() => navigate(-1)}
          style={{ width: "auto" }}
        >
          &larr; Back
        </button>

        {!user || user.fullName === "Guest" ? (
          <button
            className="btn btn-warning px-4 py-2 fw-semibold"
            onClick={() => {
              alert("You need to log in first.");
              navigate("/login");
            }}
            style={{ width: "auto" }}
          >
            Log in to Book
          </button>
        ) : (
          <button
            className="book-btn px-4 py-2 fw-semibold text-white"
            onClick={() => setShowModal(true)}
            style={{ width: "auto" }}
          >
            Book Now
          </button>
        )}
        </div>

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

        {/* Hours of Operation */}
        <h5 className="fw-semibold">Hours</h5>
        <p className="mb-4">{space.hours}</p>

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
