import React, { useState } from "react";

export default function ForgotPasswordModal({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch(
        "http://localhost:5006/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setMessage("✅ Reset link sent! Check your email.");
      setEmail("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl w-[350px] relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-white text-lg"
        >
          ✕
        </button>

        <h2 className="text-white text-xl font-semibold mb-4 text-center">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/15 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-fuchsia-500 via-violet-500 to-indigo-500 text-white font-semibold hover:opacity-90 transition"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          {message && (
            <p className="text-green-400 text-sm text-center">{message}</p>
          )}
          {error && (
            <p className="text-rose-400 text-sm text-center">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}
