import React, { useState } from "react";
import AuthForm from "../components/AuthForm";
import Swal from "sweetalert2";
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
      Swal.fire({
        title: "Verify Your Email 🎉",
        html: `
          <p>We have sent a verification link to:</p>
          <strong>${email}</strong><br><br>
          <p>Please check your inbox & spam folder.</p>
        `,
        icon: "success",
        confirmButtonColor: "#4F46E5",
        confirmButtonText: "OK",
      });
    } catch (err) {
      Swal.fire({
        title: "Error ❌",
        text: err.message,
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
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
