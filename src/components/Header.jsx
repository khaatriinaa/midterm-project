import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar px-3">
      <Link className="navbar-brand" to="/home">
        StudyNook
      </Link>

      <div className="ms-auto d-flex align-items-center gap-3">
        {user ? (
          <>
            <span className="text-white fw-semibold">
              Hello, {user.fullName === "Guest" ? "Guest" : user.fullName}!
            </span>

            {/* Show My Bookings only for logged-in users */}
            {user.fullName !== "Guest" && (
              <button
                className="btn btn-info"
                onClick={() => navigate("/dashboard/my-bookings")}
              >
                My Bookings
              </button>
            )}

            {user.fullName === "Guest" ? (
              <button
                className="btn btn-info"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            ) : (
              <button className="btn btn-danger" onClick={handleLogout}>
                Logout
              </button>
            )}
          </>
        ) : (
          <button
            className="btn btn-info"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
