import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // ✅ Icon

export default function ClubsPage() {
  const { cityId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const cityName = location.state?.cityName || "Selected City";

  useEffect(() => {
    const fetchClubs = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5006/api/clubs/${cityId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setClubs(data);
    };
    fetchClubs();
  }, [cityId]);

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center px-6 py-12"
      style={{
        backgroundImage: "url('/image1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* 🔙 Back Arrow Button - fixed on the left */}
      <button
        onClick={() => navigate("/cities")}
        className="absolute left-8 top-8 bg-white/15 hover:bg-white/25 border border-white/20 
                   backdrop-blur-md rounded-full p-3 text-white transition-all duration-300 
                   hover:scale-110 shadow-lg"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      {/* 🌆 Main Container */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-10 w-full max-w-5xl text-center">
        <h2
          className="text-5xl font-extrabold text-transparent bg-clip-text
               bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-pink-500
               drop-shadow-[0_0_10px_white] mb-10"
        >
          🎶 Clubs in {cityName}
        </h2>
        {/* 🏙️ Clubs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
          {clubs.length > 0 ? (
            clubs.map((club) => (
              <div
                key={club._id}
                onClick={() => navigate(`/club/${club._id}`)}
                className="group bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden 
                           hover:scale-105 hover:bg-white/25 transition-all duration-300 shadow-lg w-full max-w-xs"
              >
                <img
                  src={club.image || "https://via.placeholder.com/400x250"}
                  alt={club.name}
                  className="w-full h-44 object-cover group-hover:opacity-90 transition"
                />
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-white mb-1 tracking-wide">
                    {club.name}
                  </h3>
                  <p className="text-sm text-gray-200">
                    {club.description || "No description available."}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-300 text-lg col-span-3">
              No clubs found in this city yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
