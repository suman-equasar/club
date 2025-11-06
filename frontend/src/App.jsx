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

// 🧩 Import React Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <>
      {/* 🧭 Your main app routes */}
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

        <Route path="/clubs/:cityId" element={<ClubsPage />} />
        <Route path="/club/:clubId" element={<ClubDetails />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route
          path="/confirm-booking/:bookingId"
          element={<ConfirmBooking />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* ✅ Global toast container */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
    </>
  );
}
