import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Gates nested routes behind an authenticated admin session.
 * - Not logged in -> /login (with the attempted location, like ProtectedRoute).
 * - Logged in but not an admin -> /dashboard (normal users never see admin UI).
 */
export default function AdminRoute() {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
