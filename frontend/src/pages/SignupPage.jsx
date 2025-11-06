import React, { useState } from "react";
import AuthForm from "../components/AuthForm";

export default function SignupPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const handleSignup = async ({ email, password, username }) => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://192.168.1.90:5006/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Signup failed");
      }

      setUserEmail(email);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ If submitted, replace form content only (AuthForm handles layout)
  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative bg-white/8 backdrop-blur-xl rounded-3xl p-8 w-[22rem] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] text-white">
          <div className="absolute inset-0 rounded-3xl ring-1 ring-white/15 pointer-events-none" />
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-3 text-white/95">
              Verify Your Email 🎉
            </h2>
            <p className="text-white/70 mb-2">
              We’ve sent a verification link to:
            </p>
            <p className="font-medium text-fuchsia-300">{userEmail}</p>
            <p className="mt-4 text-white/60">
              Please check your inbox and click the link to activate your
              account.
            </p>
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative bg-red-500/10 backdrop-blur-xl rounded-3xl p-8 w-[22rem] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] text-white">
          <div className="absolute inset-0 rounded-3xl ring-1 ring-red-400/25 pointer-events-none" />
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-3 text-red-400">
              Signup Failed ❌
            </h2>
            <p className="text-white/80">{error}</p>
            <button
              onClick={() => setError("")}
              className="mt-6 px-5 py-2 rounded-xl bg-red-400/20 hover:bg-red-400/30 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen realtive">
      <AuthForm mode="signup" onSubmit={handleSignup} />
    </div>
  );
}
