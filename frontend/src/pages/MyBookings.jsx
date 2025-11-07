import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, CalendarDays, Users, MapPin, Info } from "lucide-react";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5006/api/booking/my-bookings",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4c0d6f] via-[#9b166b] to-[#ff417c] text-white py-12 px-6">
      <h1 className="text-6xl md:text-7xl font-extrabold mb-4 bg-gradient-to-r from-pink-300 via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-xl text-center ">
        🎟️ My Bookings
      </h1>

      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin w-8 h-8 mr-3 text-fuchsia-300" />
          <span className="text-lg text-pink-200">
            Loading your bookings...
          </span>
        </div>
      ) : bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076505.png"
            alt="No Bookings"
            className="w-24 opacity-80 mb-4"
          />
          <p className="text-lg text-pink-100 font-medium">No bookings found</p>
          <p className="text-sm text-pink-200 mt-1">
            Once you book a club, your details will appear here!
          </p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(255,64,129,0.6)] transition-all duration-300"
            >
              <img
                src={b.club?.image || "https://via.placeholder.com/300x180"}
                alt={b.club?.name}
                className="w-full h-40 object-cover rounded-2xl mb-4 border border-white/20"
              />

              <h2 className="text-2xl font-semibold text-fuchsia-300 mb-1">
                {b.club?.name || "Unnamed Club"}
              </h2>

              <div className="space-y-2 text-pink-100 text-sm">
                <div className="flex items-center gap-2">
                  <CalendarDays size={16} className="text-fuchsia-300" />
                  <span>{new Date(b.date).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users size={16} className="text-fuchsia-300" />
                  <span>{b.people} Guests</span>
                </div>

                <div className="flex items-center gap-2">
                  <Info size={16} className="text-fuchsia-300" />
                  <span>{b.event || "General Event"}</span>
                </div>

                {b.description && (
                  <p className="text-pink-200 text-xs border-t border-white/10 mt-3 pt-2">
                    {b.description}
                  </p>
                )}
              </div>

              <div className="mt-5 flex justify-between items-center">
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                    b.status === "confirmed"
                      ? "bg-green-500/30 text-green-300"
                      : "bg-fuchsia-400/20 text-fuchsia-200"
                  }`}
                >
                  {b.status?.toUpperCase() || "PENDING"}
                </span>

                <span className="text-xs text-pink-300">
                  📱 {b.mobile || "N/A"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
