import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        height: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "var(--clr-bg)", gap: "16px"
      }}>
        <span style={{ fontSize: "48px" }}>🌟</span>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "18px", color: "var(--clr-primary)" }}>
          Loading ParentPal…
        </p>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}