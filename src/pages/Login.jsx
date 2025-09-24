import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, login, loginAsGuest } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    let success = false;

    if (isSignup) {
      success = signup(fullName, email, password);
    } else {
      success = login(email, password);
    }

    if (success) navigate("/home"); // ✅ Redirect to Home
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    navigate("/home"); // ✅ Redirect to Home
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">{isSignup ? "Sign Up" : "Login"}</h2>
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <input
              className="login-input"
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          )}

          <input
            className="login-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="btn-primary" type="submit">
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <button
          className="btn-link"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup
            ? "Already have an account? Login"
            : "Don't have an account? Sign Up"}
        </button>

        <button onClick={handleGuestLogin} className="btn-secondary">
          Continue as Guest
        </button>
      </div>
    </div>
  );
}
