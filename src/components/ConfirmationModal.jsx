export default function ConfirmationModal({ 
  show, 
  onClose, 
  onConfirm 
}) {
  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-3">
          <div className="modal-header">
            <h5 className="modal-title fw-bold text-danger">
              Cancel Booking
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <p className="mb-1">
              Are you sure you want to cancel this booking?
            </p>
            <small className="text-muted">
              This action cannot be undone.
            </small>
          </div>
          <div className="modal-footer d-flex justify-content-center gap-1 border-0">
            <button
              type="button"
              className="btn btn-outline-secondary px-4 rounded-pill"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger px-4 rounded-pill shadow-sm"
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
