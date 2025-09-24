export default function ConfirmationModal({ show, onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-body">Are you sure you want to cancel this booking?</div>
          <div className="modal-footer">
            <button className="btn btn-danger" onClick={onConfirm}>Yes, Cancel</button>
            <button className="btn btn-secondary" onClick={onCancel}>No</button>
          </div>
        </div>
      </div>
    </div>
  );
}
