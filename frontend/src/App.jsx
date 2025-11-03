import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import CitiesPage from "./pages/CitiesPage";
import ClubsPage from "./pages/ClubsPage";
import EmailLogin from "./pages/EmailLogin";
import RegisterForm from "./pages/RegisterForm";
import ClubDetails from "./pages/ClubDetails";
import ConfirmBooking from "./pages/ConfirmBooking";
import Home from "./pages/Home";

export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/email-login" element={<EmailLogin />} />
      </Route>

      {/* ✅ Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/cities"
        element={
          <ProtectedRoute>
            <CitiesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/clubs/:cityId"
        element={
          <ProtectedRoute>
            <ClubsPage />
          </ProtectedRoute>
        }
      />

      <Route path="/club/:clubId" element={<ClubDetails />} />

      <Route path="/register" element={<RegisterForm />} />
      <Route path="/confirm-booking/:bookingId" element={<ConfirmBooking />} />

      {/* Default route */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
