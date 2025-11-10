import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Bookmark } from "lucide-react";
import logo from "../assets/logo.jpg";
import { AuthContext } from "../context/AuthContext";

export default function CitiesPage() {
  const [cities, setCities] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5006/api/cities", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCities(data);
      } catch (err) {
        console.error("Error fetching cities:", err);
      }
    };
    fetchCities();
  }, []);

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout(); // ✅ clears user + token from context and localStorage
    navigate("/login");
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/image1.jpg')" }}
    >
      {/* Overlays */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_40%_at_50%_0%,rgba(255,255,255,0.25),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70" />

      {/* 🌆 Top Bar */}
      <div
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] 
        flex items-center justify-between px-6 py-2.5 rounded-2xl 
        backdrop-blur-lg bg-white/10 border border-white/10 shadow-lg"
      >
        {/* Left: Logo + Title */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={logo}
            alt="Logo"
            className="w-8 h-8 rounded-full object-cover shadow-md"
          />
          <h1 className="text-white text-lg font-semibold tracking-wide">
            City Explorer
          </h1>
        </div>

        {/* Right: Profile Icon + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition-all"
            title="Your Profile"
          >
            <User size={20} className="text-white" />
          </button>

          {open && (
            <div
              className="absolute right-0 mt-2 w-48 rounded-xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-lg text-white text-sm overflow-hidden animate-fadeIn"
              style={{ zIndex: 60 }}
            >
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-white/20"
              >
                <User size={16} /> View Profile
              </button>
              <button
                onClick={() => navigate("/my-bookings")}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-white/20"
              >
                <Bookmark size={16} /> My Bookings
              </button>
              <hr className="border-white/10" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 text-red-300 hover:bg-red-500/20"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 🌆 Main Content */}
      <div className="relative mx-auto max-w-6xl px-4 py-28">
        <div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl ring-1 ring-black/20">
          <div className="px-8 sm:px-10 py-8">
            <h1 className="text-center text-4xl font-extrabold tracking-tight text-white drop-shadow mb-10">
              🌆 Explore Cities
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {cities.map((city) => (
                <button
                  key={city._id}
                  onClick={() =>
                    navigate(`/clubs/${city._id}`, {
                      state: { cityName: city.name },
                    })
                  }
                  className="group relative overflow-hidden rounded-2xl text-left outline-none focus:ring-4 focus:ring-fuchsia-400/40 transition-all duration-300"
                >
                  <div className="bg-white/5 hover:bg-white/10 border border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="relative h-48">
                      <img
                        src={
                          city.image || "https://via.placeholder.com/600x400"
                        }
                        alt={city.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/20 text-white text-xs px-2 py-1 opacity-0 translate-y-1 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                        View clubs →
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-white">
                        {city.name}
                      </h3>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Animation Keyframe */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
