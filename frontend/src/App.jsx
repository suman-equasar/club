import React, { useContext } from "react";
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
import MyBookings from "./pages/MyBookings";

// ✅ Import Context
import { AuthContext } from "./context/AuthContext";

// 🧩 Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  const { isAuthenticated, user, loading } = useContext(AuthContext);

  if (loading) return null; // Wait for auth to load before showing routes

  return (
    <>
      <Routes>
        {/* 🔐 AuthLayout routes (login/signup/etc) */}
        <Route element={<AuthLayout />}>
          {/* Redirect if already logged in */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate
                  to={user.role === "admin" ? "/admin" : "/cities"}
                  replace
                />
              ) : (
                <LoginPage />
              )
            }
          />
          <Route
            path="/signup"
            element={
              isAuthenticated ? (
                <Navigate
                  to={user.role === "admin" ? "/admin" : "/cities"}
                  replace
                />
              ) : (
                <SignupPage />
              )
            }
          />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/email-login" element={<EmailLogin />} />
          <Route path="/" element={<Home />} />
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
        <Route path="/profile" element={<ProfilePage />} />
        <Route
          path="/confirm-booking/:bookingId"
          element={<ConfirmBooking />}
        />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Toasts */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
    </>
  );
}
