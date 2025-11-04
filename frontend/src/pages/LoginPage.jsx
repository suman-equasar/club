// LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import ForgotPasswordModal from "./ForgotPasswordModal";
import Swal from "sweetalert2";

export default function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 👉 Add state for modal open/close
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleLogin = async ({ email, password }) => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://192.168.1.74:5006/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);

      localStorage.setItem("user", JSON.stringify(data.user));
      Swal.fire({
        icon: "success",
        title: "Login Successful 🎉",
        text: "Redirecting...",
        timer: 1800,
        showConfirmButton: false,
      });

      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/cities");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Login Failed ❌",
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AuthForm
        mode="login"
        onSubmit={handleLogin}
        // 👇 Pass a prop to open modal
        onForgotPassword={() => setShowForgotModal(true)}
      />

      {/* 👇 Render modal conditionally */}
      <ForgotPasswordModal
        open={showForgotModal}
        onClose={() => setShowForgotModal(false)}
      />
    </div>
  );
}
