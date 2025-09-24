import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import SpaceDetail from "./pages/SpaceDetail";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";
import ScrollToTop from "./components/ScrollToTop"; // ✅ add this

export default function App() {
  const { user } = useAuth();

  return (
    <div>
      <Header />
      <ScrollToTop /> {/* Makes detail page open at top */}
      <Routes>
        {/* Default route → redirect to Login if not logged in */}
        <Route
          path="/"
          element={user ? <Navigate to="/login" /> : <Navigate to="/home" />}
        />
        <Route path="/home" element={<Home />} />
        <Route path="/space/:spaceId" element={<SpaceDetail />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard/my-bookings"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
