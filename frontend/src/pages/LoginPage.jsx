// LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import ForgotPasswordModal from "./ForgotPasswordModal";

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
      const res = await fetch("http://localhost:5006/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);

      localStorage.setItem("user", JSON.stringify(data.user));
      alert("Login successful");

      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/cities");
      }
    } catch (err) {
      setError(err.message);
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
