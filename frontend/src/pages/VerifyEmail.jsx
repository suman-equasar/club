import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying your account...");
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setError("Invalid verification link.");
      setMessage("");
      return;
    }

    const verifyAccount = async () => {
      try {
        const res = await fetch(
          `http://192.168.1.74:5006/api/auth/verify-email?token=${token}`
        );

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Verification failed");
        }

        // Optionally show a success message before redirect
        setMessage(
          "✅ Your account has been verified! Redirecting to login..."
        );
        setTimeout(() => navigate("/login"), 3000); // 3 seconds delay
      } catch (err) {
        setError(err.message);
        setMessage("");
      }
    };

    verifyAccount();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg text-center max-w-md w-full">
        {message && <p className="text-green-400">{message}</p>}
        {error && <p className="text-red-400">{error}</p>}
      </div>
    </div>
  );
}
