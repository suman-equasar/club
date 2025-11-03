import React, { useState } from "react";
import AuthForm from "../components/AuthForm";

export default function SignupPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSignup = async ({ email, password, username }) => {
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://192.168.1.74:5006/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      // ✅ Instead of navigating, show a message
      setSuccessMessage(
        "✅ Signup successful! Please check your email to verify your account before logging in."
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <AuthForm mode="signup" onSubmit={handleSignup} />

      {error && (
        <p className="mt-4 text-center text-red-400 font-medium">{error}</p>
      )}
      {successMessage && (
        <p className="mt-4 text-center text-green-400 font-medium">
          {successMessage}
        </p>
      )}
    </div>
  );
}
