import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CitiesPage() {
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCities = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5006/api/cities", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCities(data);
    };
    fetchCities();
  }, []);

  return (
    <div
      className="min-h-screen relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/image1.jpg')" }}
    >
      {/* soft glow + vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_40%_at_50%_0%,rgba(255,255,255,0.25),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70" />

      <div className="relative mx-auto max-w-6xl px-4 py-16">
        {/* glassmorphism panel */}
        <div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl ring-1 ring-black/20">
          <div className="px-8 sm:px-10 py-8">
            <h1 className="text-center text-4xl font-extrabold tracking-tight text-white drop-shadow mb-10">
              <span role="img" aria-label="city">
                🌆
              </span>{" "}
              Explore Cities
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {cities.map((city) => (
                <button
                  key={city._id}
                  onClick={() =>
                    navigate(`/clubs/${city._id}`, {
                      state: { cityName: city.name },
                      viewTransition: true, // smooth route transition
                    })
                  }
                  aria-label={`View clubs in ${city.name}`}
                  className="group relative overflow-hidden rounded-2xl text-left outline-none focus:ring-4 focus:ring-fuchsia-400/40 transition-all duration-300"
                >
                  <div className="bg-white/5 hover:bg-white/10 border border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 will-change-transform">
                    <div className="relative h-48">
                      <img
                        src={
                          city.image || "https://via.placeholder.com/600x400"
                        }
                        alt={city.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/20 text-white text-xs px-2 py-1 opacity-0 translate-y-1 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                        View clubs →
                      </span>
                      <div className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-fuchsia-400/20 via-sky-300/10 to-purple-500/20 pointer-events-none" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-white drop-shadow-sm">
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

      {/* prefers-reduced-motion: dampen big transforms */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .group:hover img { transform: none !important; }
        }
      `}</style>
    </div>
  );
}
