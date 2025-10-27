import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem("currentUser")); // ✅ use same key

  if (!user) return <Navigate to="/email-login" />; // or your entry page
  if (role && user.role !== role) return <Navigate to="/email-login" />;

  return children;
}
