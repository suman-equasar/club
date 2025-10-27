import React, { useState } from "react";
import axios from "axios";
import { Mail } from "lucide-react";

export default function EmailLogin() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageVisible(false); // hide previous message
    try {
      const res = await axios.post(
        "http://localhost:5006/api/auth/email-login",
        { email }
      );

      setMessage(res.data.message);
      setEmail(""); // clear input
      setMessageVisible(true); // show message

      // Hide message after 5 seconds
      setTimeout(() => setMessageVisible(false), 5000);
    } catch (err) {
      setMessage(err?.response?.data?.message || "Something went wrong");
      setMessageVisible(true);

      setTimeout(() => setMessageVisible(false), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl grid md:grid-cols-2 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-2xl border border-white/10 bg-white/5">
      {/* ---------- Left Side (Image + Branding) ---------- */}
      <div
        className="relative hidden md:flex flex-col justify-between bg-cover bg-center p-10 text-white"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519677100203-a0e668c92439?q=80&w=1200')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>

        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
            ✨ Join the <span className="text-indigo-400">Vibe</span>
          </h1>
          <p className="mt-4 text-lg text-white/80">
            Access exclusive events and experiences with just your email. No
            password. No hassle.
          </p>
        </div>
      </div>

      {/* ---------- Right Side (Form) ---------- */}
      <div className="flex items-center justify-center p-10">
        <div
          className="w-full max-w-sm 
                bg-gradient-to-br from-white/20 via-white/10 to-white/5 
                backdrop-blur-xl 
                border border-white/30 
                rounded-3xl 
                shadow-2xl 
                p-8 animate-fadeIn"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-indigo-600 rounded-full shadow-lg">
              <Mail className="h-6 w-6 text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-white mb-2">
            Login with Email ✉️
          </h2>
          <p className="text-center text-white/70 mb-8">
            We'll send you a secure magic link to log in instantly.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white/80 mb-1"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                inputMode="email"
                autoComplete="email"
                placeholder="Enter Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/60 p-3 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold transition transform hover:scale-[1.02] active:scale-[0.98] ${
                loading
                  ? "bg-indigo-400/50 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              {loading ? "Sending Magic Link..." : "Login "}
            </button>

            {message && (
              <p
                className={`text-center text-sm text-emerald-200 bg-emerald-600/30 border border-emerald-400/30 rounded-xl p-2 transition-opacity duration-500 ${
                  messageVisible ? "opacity-100" : "opacity-0"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
