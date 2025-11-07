import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import ForgotPasswordModal from "./ForgotPasswordModal";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const { login } = useContext(AuthContext); // ✅ use context

  const handleLogin = async ({ email, password }) => {
    setLoading(true);

    try {
      const res = await fetch("http://192.168.1.90:5006/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // ✅ Save to context (automatically handles localStorage)
      login(data.user, data.token);

      toast.success(`Welcome, ${data.user.username || "User"} 👋`, {
        autoClose: 1500,
      });

      const redirectPath = data.user.role === "admin" ? "/admin" : "/cities";
      setTimeout(() => navigate(redirectPath), 800);
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AuthForm
        mode="login"
        onSubmit={handleLogin}
        onForgotPassword={() => setShowForgotModal(true)}
      />

      <ForgotPasswordModal
        open={showForgotModal}
        onClose={() => setShowForgotModal(false)}
      />
    </div>
  );
}
