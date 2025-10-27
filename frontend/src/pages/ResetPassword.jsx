import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // ✅ Get token from query param: /reset-password?token=abc123
  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // ✅ Password match validation
    if (password !== confirm) {
      return setError("❌ Passwords do not match");
    }

    // ✅ Strong password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      return setError(
        "❌ Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
    }

    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:5006/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newPassword: password }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reset password");

      setMessage("✅ Password reset successful! Redirecting to login...");
      setPassword("");
      setConfirm("");

      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl w-[400px] text-white shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Reset Password
      </h2>

      {/* ✅ Token check */}
      {!token ? (
        <p className="text-red-400 text-center">
          ❌ Invalid or missing reset token. Please request a new link.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full px-3 py-2 rounded-lg bg-white/15 text-white/90 placeholder-white/50 
  transition focus:outline-none focus:ring-2 focus:ring-fuchsia-400/60 
  focus:bg-white/25 focus:shadow-[0_8px_30px_-12px_rgba(217,70,239,0.35)] 
  focus:-translate-y-[1px]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full px-3 py-2 rounded-lg bg-white/15 text-white/90 placeholder-white/50 
  transition focus:outline-none focus:ring-2 focus:ring-fuchsia-400/60 
  focus:bg-white/25 focus:shadow-[0_8px_30px_-12px_rgba(217,70,239,0.35)] 
  focus:-translate-y-[1px]"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-fuchsia-500 via-violet-500 to-indigo-500 text-white font-semibold hover:opacity-90 transition"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
          {message && (
            <p className="text-green-400 text-sm text-center mt-2">{message}</p>
          )}
          {error && (
            <p className="text-rose-400 text-sm text-center mt-2">{error}</p>
          )}
        </form>
      )}
    </div>
  );
}
