import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      className="h-screen w-full bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: "url('/image1.jpg')" }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/70 to-black" />

      {/* NAVBAR */}
      <div className="absolute top-0 w-full px-6 py-5 flex justify-between items-center z-50">
        <h2 className="text-2xl font-bold text-white tracking-wide">
          ClubVerse
        </h2>

        <button
          onClick={() => navigate("/login")}
          className="px-6 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Login
        </button>
      </div>

      {/* HERO CONTENT */}
      <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-5">
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight drop-shadow-xl mb-4">
          Elite Club Network
        </h1>

        <p className="text-lg sm:text-xl text-gray-200 mb-10 max-w-xl">
          Play · Connect · Experience world-class sports & luxury clubs across
          cities.
        </p>

        {/* ✅ STATIC IMAGES ROW */}
        <div className="flex gap-4 justify-center">
          <img
            src="/city1.jpg"
            alt="Club 1"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl object-cover border border-white/30"
          />
          <img
            src="/club1.jpg"
            alt="Club 2"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl object-cover border border-white/30"
          />
          <img
            src="/event1.jpg"
            alt="Club 3"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl object-cover border border-white/30"
          />
        </div>

        {/* tagline */}
        <div className="mt-10 text-sm text-gray-300 opacity-70">
          Trusted by premium sports & community clubs 🏆
        </div>
      </div>
    </div>
  );
}
