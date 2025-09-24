import React from "react";
import { Link } from "react-router-dom";

export default function SpaceCard({ space }) {
  if (!space) return null;

  const { main_image, name, location, description, price, id } = space;

  return (
    <div className="row g-0 border rounded-3 shadow-sm mb-3 space-card">
      <div className="col-md-4">
        {main_image ? (
          <img
            src={main_image}
            alt={name || "space image"}
            className="w-100 space-card-img"
            style={{ height: "220px", objectFit: "cover" }}
          />
        ) : (
          <div className="w-100 placeholder-img">No image</div>
        )}
      </div>

      <div className="col-md-5 col-12 p-3 details">
        <h5 className="fw-bold">{name || "Untitled space"}</h5>
        <p className="text-muted small">{location || "Unknown location"}</p>
        <p className="small">{description || "No description available."}</p>
      </div>

      <div className="col-md-3 col-12 p-3 d-flex flex-column justify-content-between pricing">
        <div>
          <span className="text-muted small">From</span>
          <h5 className="fw-bold mb-0">₱{price ?? "—"}</h5>
          <span className="text-muted small">/ day</span>
        </div>
        <Link className="btn mt-2" to={`/space/${id ?? ""}`}>
          View Details
        </Link>
      </div>
    </div>
  );
}
