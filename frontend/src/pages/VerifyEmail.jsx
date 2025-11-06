import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Invalid link. No token found. Redirecting to signup...");
      setTimeout(() => navigate("/signup"), 3000);
      return;
    }

    const alreadyVerified = localStorage.getItem("verifiedToken");
    if (alreadyVerified === token) {
      setStatus("success");
      setMessage("Email already verified! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2500);
      return;
    }

    fetch(`http://192.168.1.90:5006/api/auth/verify-email?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          localStorage.setItem("verifiedToken", token);
          setStatus("success");
          setMessage(
            "Your email has been successfully verified! Redirecting to login..."
          );
          setTimeout(() => navigate("/login"), 2500);
        } else {
          setStatus("error");
          setMessage(
            `Verification failed: ${data.message}. Redirecting to signup...`
          );
          setTimeout(() => navigate("/signup"), 3000);
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Server error. Please try again later.");
        setTimeout(() => navigate("/signup"), 3000);
      });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 w-[22rem] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] text-white">
        <div className="absolute inset-0 rounded-3xl ring-1 ring-white/15 pointer-events-none" />

        <div className="text-center">
          {/* Header */}
          <h2 className="text-2xl font-semibold mb-3 text-white/95">
            {status === "loading" && "Verifying Your Email 🔄"}
            {status === "success" && "Email Verified 🎉"}
            {status === "error" && "Verification Failed ❌"}
          </h2>

          {/* Animated Icon */}
          <div className="my-5">
            {status === "loading" && (
              <div className="w-12 h-12 mx-auto border-4 border-fuchsia-400 border-t-transparent rounded-full animate-spin" />
            )}
            {status === "success" && (
              <div className="text-green-400 text-5xl">✅</div>
            )}
            {status === "error" && (
              <div className="text-red-400 text-5xl">❌</div>
            )}
          </div>

          {/* Message */}
          <p className="text-white/70">{message}</p>

          {status === "success" && (
            <p className="mt-4 text-fuchsia-300 text-sm">
              Redirecting to login page...
            </p>
          )}
          {status === "error" && (
            <p className="mt-4 text-fuchsia-300 text-sm">
              Redirecting to signup page...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
