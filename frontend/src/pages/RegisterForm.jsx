import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { User } from "lucide-react";
import PageLayout from "../layouts/PageLayout";

export default function RegisterForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const emailFromLink = searchParams.get("email") || "";

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    city: "",
    state: "",
    phone: "",
    email: emailFromLink,
    token: token,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Update formData if token/email changes
  useEffect(() => {
    if (token && emailFromLink) {
      setFormData((prev) => ({
        ...prev,
        email: emailFromLink,
        token: token,
      }));
    }
  }, [token, emailFromLink]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const nameRegex = /^[A-Za-z\s]{3,}$/;
    if (!nameRegex.test(formData.name))
      return "Name must be at least 3 letters and contain only letters and spaces.";

    const dob = new Date(formData.dob);
    if (isNaN(dob.getTime())) return "Invalid date of birth.";
    let age = new Date().getFullYear() - dob.getFullYear();
    const m = new Date().getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && new Date().getDate() < dob.getDate())) age--;
    if (age < 18) return "You must be 18 years or older.";

    if (!["male", "female", "other"].includes(formData.gender.toLowerCase()))
      return "Gender must be Male, Female, or Other.";

    const phoneRegex = /^\+?[0-9]{7,15}$/;
    if (!phoneRegex.test(formData.phone)) return "Invalid phone number.";

    const cityStateRegex = /^[A-Za-z\s]+$/;
    if (!cityStateRegex.test(formData.city))
      return "City can only contain letters and spaces.";
    if (!cityStateRegex.test(formData.state))
      return "State can only contain letters and spaces.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return "Invalid email format.";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const validationError = validateForm();
    if (validationError) {
      setMessage(validationError);
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "http://192.168.1.74:5006/api/auth/completeRegistration",
        formData
      );

      // Save user info to localStorage so /cities works as "logged in"
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          email: formData.email,
          name: formData.name,
          isSignup: true,
        })
      );

      setMessage(res.data.message);

      // Clear sensitive fields
      setFormData((prev) => ({
        ...prev,
        name: "",
        dob: "",
        gender: "",
        city: "",
        state: "",
        phone: "",
      }));

      // Redirect to cities automatically after 1–2 seconds
      setTimeout(() => {
        navigate("/cities");
      }, 1500);
    } catch (err) {
      if (err.response?.data?.errors) {
        setMessage(err.response.data.errors[0].msg);
      } else {
        setMessage(err?.response?.data?.message || "Error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout backgroundImage="./image1.jpg">
      <div className="w-full max-w-6xl grid md:grid-cols-2 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-2xl border border-white/10 bg-white/5">
        {/* Left Hero */}
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
              ✨ Complete{" "}
              <span className="text-indigo-400">Your Registration</span>
            </h1>
            <p className="mt-4 text-lg text-white/80">
              Fill in your details to join the Vibe and unlock exclusive events.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="flex items-center justify-center p-10">
          <div className="w-full max-w-sm bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-8 animate-fadeIn">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-indigo-600 rounded-full shadow-lg">
                <User className="h-6 w-6 text-white" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-center text-white mb-2">
              Complete Registration
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
                className="w-full rounded-xl border border-white/20 bg-white/20 text-white placeholder-white/60 p-3 shadow-sm"
              />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/60 p-3 shadow-sm"
              />
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/60 p-3 shadow-sm"
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/60 p-3 shadow-sm"
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="male">male</option>
                <option value="female">female</option>
                <option value="other">other</option>
              </select>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/60 p-3 shadow-sm"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/60 p-3 shadow-sm"
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/60 p-3 shadow-sm"
              />

              <button
                type="submit"
                disabled={loading || message.toLowerCase().includes("success")}
                className={`w-full py-3 rounded-xl font-semibold transition transform hover:scale-[1.02] active:scale-[0.98] ${
                  loading || message.toLowerCase().includes("success")
                    ? "bg-indigo-400/50 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                {loading ? "Registering..." : "Register"}
              </button>

              {message && (
                <p
                  className={`text-center text-sm p-2 rounded-xl border transition-all duration-500 ${
                    message.toLowerCase().includes("success")
                      ? "text-emerald-200 bg-emerald-600/30 border-emerald-400/30"
                      : "text-red-200 bg-red-600/30 border-red-400/30"
                  }`}
                >
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
