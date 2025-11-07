import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function ClubDetails() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const editBookingId = queryParams.get("editBooking");

  const [club, setClub] = useState(null);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [errors, setErrors] = useState({}); // ❗ Error messages for each field

  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    mobile: "",
    people: "",
    event: "",
    date: "",
    description: "",
  });

  useEffect(() => {
    const fetchClub = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5006/api/club/${clubId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setClub(data);
    };
    fetchClub();
  }, [clubId]);

  // ✅ Fetch booking once if editing
  useEffect(() => {
    if (editBookingId) {
      setLoadingEdit(true);
      const token = localStorage.getItem("token"); // ✅ get token

      fetch(`http://localhost:5006/api/booking/${editBookingId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ required for protected route
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch booking");
          return res.json();
        })
        .then((data) => {
          const booking = data.booking || data;

          if (!booking) return;

          if (booking.status === "confirmed") {
            alert("Your booking is already confirmed. You cannot edit it.");
            navigate("/my-bookings");
            return;
          }

          // ✅ Pre-fill form
          setFormData({
            mobile: booking.mobile || "",
            date: booking.date ? booking.date.split("T")[0] : "",
            people: booking.people || "",
            event: booking.event || "",
            description: booking.description || "",
          });

          if (booking.club) setClub(booking.club);
        })
        .catch((err) => {
          console.error("Error fetching booking:", err);
        })
        .finally(() => setLoadingEdit(false));
    }
  }, [editBookingId, navigate]);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const token = localStorage.getItem("token");

    if (name === "date" && value) {
      try {
        const res = await fetch(
          `http://localhost:5006/api/booking/check-date?clubId=${clubId}&date=${value}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!data.available) {
          setErrors((prev) => ({
            ...prev,
            date: "This date is already booked. Please choose another date.",
          }));

          setFormData((prev) => ({ ...prev, date: "" }));
        } else {
          setErrors((prev) => ({ ...prev, date: "" }));
        }
      } catch (err) {
        console.error("Date check error", err);
      }
    }
  };
  // ✅ Regex-based validation function
  const validateForm = () => {
    const newErrors = {};

    const mobileRegex = /^[0-9]{10}$/;

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required.";
    } else if (!mobileRegex.test(formData.mobile)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number.";
    }

    if (!formData.people || formData.people <= 0) {
      newErrors.people = "Enter number of guests.";
    }

    if (!formData.event) {
      newErrors.event = "Please select an event type.";
    }

    if (!formData.date) {
      newErrors.date = "Select a date for your booking.";
    }

    if (formData.description && formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const token = localStorage.getItem("token");

    // ✅ If editing booking
    if (editBookingId) {
      const res = await fetch(
        `http://localhost:5006/api/booking/${editBookingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      alert(data.message || "Booking updated!");

      // ✅ Send confirmation email again
      await fetch(`http://localhost:5006/api/booking/confirm/${editBookingId}`);
      alert("Confirmation email sent again with updated details!");
      return;
    }

    // ✅ Otherwise normal booking creation
    const res = await fetch(`http://localhost:5006/api/booking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        clubId,
        ...formData,
      }),
    });
    const data = await res.json();
    alert(data.message || "Booking successful!");

    setFormData({
      mobile: "",
      people: "",
      event: "",
      date: "",
      description: "",
    });
  };
  if (!club) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-purple-950 via-fuchsia-900 to-pink-800 text-white">
        <p className="text-lg text-gray-300 animate-pulse">
          Loading club details...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-fuchsia-900 to-pink-800 text-white relative overflow-hidden">
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute left-8 top-8 bg-white/15 hover:bg-white/25 border border-white/20 
                   backdrop-blur-md rounded-full p-3 text-white transition-all duration-300 
                   hover:scale-110 shadow-lg z-10"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      {/* 🖼️ Banner Section */}
      <div className="relative w-full h-[60vh] flex items-center justify-center">
        <img
          src={club.image || "https://via.placeholder.com/1200x600"}
          alt={club.name}
          className="absolute inset-0 w-full h-full object-cover brightness-[0.5]"
        />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-6xl md:text-7xl font-extrabold mb-4 bg-gradient-to-r from-pink-300 via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-xl">
            {club.name}
          </h1>
          <p className="text-gray-200 text-lg max-w-2xl mx-auto">
            {club.description ||
              "Experience the heartbeat of nightlife — music, lights, and unforgettable vibes."}
          </p>
        </div>
      </div>

      {/* 🧩 Info + Booking Section */}
      <div className="max-w-7xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-2 gap-14 px-8 pb-24">
        {/* 💫 Left: Club Info */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl hover:bg-white/15 transition">
          <h2 className="text-3xl font-semibold mb-5 text-pink-300">
            ✨ Club Highlights
          </h2>

          <ul className="space-y-4 text-gray-200 leading-relaxed">
            <li>
              🎉 <b>Vibe:</b> Themed nights, top DJs, and live shows.
            </li>
            <li>
              📍 <b>Location:</b> {club.city?.name || "Unknown City"}
            </li>
            <li>
              🕓 <b>Hours:</b> 7:00 PM – 3:00 AM
            </li>
            <li>
              🎶 <b>Music:</b> EDM, House, Pop, and more
            </li>
            <li>
              🍸 <b>Drinks:</b> Signature cocktails & premium bar service
            </li>
          </ul>

          <div className="mt-8 border-t border-white/20 pt-6 text-gray-200 space-y-2">
            <p>
              📞 <b>Contact:</b> +1 987 654 3210
            </p>
            <p>
              📧 <b>Email:</b> info@
              {club.name?.toLowerCase().replace(/\s/g, "")}.com
            </p>
            <p>
              📍 <b>Address:</b> {club.address || "Main Street, Downtown"}
            </p>
          </div>

          <div className="mt-10">
            <h3 className="text-xl font-semibold text-pink-300 mb-4">
              💖 Why You'll Love It
            </h3>
            <ul className="list-disc ml-6 text-gray-200 space-y-2">
              <li>Free entry for ladies on Fridays</li>
              <li>VIP table service available</li>
              <li>Photo booth & live performance area</li>
              <li>Special discounts for group bookings</li>
            </ul>
          </div>

          <div className="mt-8 border-t border-white/20 pt-6 text-gray-300 text-sm italic">
            “Dance like nobody’s watching — because everyone’s too busy
            enjoying.”
          </div>
        </div>

        {/* 📝 Right: Booking Form */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl hover:bg-white/15 transition">
          <h2 className="text-3xl font-semibold mb-8 text-cyan-300">
            🎟️ Book Your Spot
          </h2>

          {loadingEdit && (
            <div className="flex justify-center items-center mb-4">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mobile */}
            <div>
              <input
                type="tel"
                name="mobile"
                placeholder="Mobile Number"
                value={formData.mobile}
                onChange={handleChange}
                className={`w-full p-4 rounded-xl bg-white/20 border ${
                  errors.mobile ? "border-red-400" : "border-white/30"
                } placeholder-gray-300 text-white focus:ring-2 focus:ring-fuchsia-400 outline-none`}
              />
              {errors.mobile && (
                <p className="text-red-400 text-sm mt-1">{errors.mobile}</p>
              )}
            </div>

            {/* Guests */}
            <div>
              <select
                name="people"
                value={formData.people}
                onChange={handleChange}
                className={`w-full p-4 rounded-xl bg-white/20 border ${
                  errors.people ? "border-red-400" : "border-white/30"
                } text-white focus:ring-2 focus:ring-fuchsia-400 outline-none`}
                required
              >
                <option value="" disabled>
                  Select number of guests
                </option>
                {[...Array(20)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              {errors.people && (
                <p className="text-red-400 text-sm mt-1">{errors.people}</p>
              )}
            </div>

            {/* Event */}
            <div>
              <select
                name="event"
                value={formData.event}
                onChange={handleChange}
                className={`w-full p-4 rounded-xl bg-white/20 border ${
                  errors.event ? "border-red-400" : "border-white/30"
                } text-white focus:ring-2 focus:ring-fuchsia-400 outline-none`}
              >
                <option value="" disabled className="text-gray-400">
                  Select Event Type
                </option>
                <option value="Birthday">🎂 Birthday</option>
                <option value="Anniversary">💍 Anniversary</option>
                <option value="Retirement">🎖️ Retirement</option>
                <option value="College Party">🎓 College Party</option>
                <option value="Other">✨ Other</option>
              </select>
              {errors.event && (
                <p className="text-red-400 text-sm mt-1">{errors.event}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className={`w-full p-4 rounded-xl bg-white/20 border ${
                  errors.date ? "border-red-400" : "border-white/30"
                } text-white`}
              />
              {errors.date && (
                <p className="text-red-400 text-sm mt-1">{errors.date}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <textarea
                name="description"
                placeholder="Add any special requests or event details..."
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className={`w-full p-4 rounded-xl bg-white/20 border ${
                  errors.description ? "border-red-400" : "border-white/30"
                } placeholder-gray-300 text-white focus:ring-2 focus:ring-fuchsia-400 outline-none resize-none`}
              />
              {errors.description && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={errors.date}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-cyan-400 hover:from-fuchsia-500 hover:to-pink-400 transition-all duration-300 font-semibold text-white shadow-lg hover:scale-[1.03]"
            >
              {editBookingId ? "Update Booking" : "Confirm Booking"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
