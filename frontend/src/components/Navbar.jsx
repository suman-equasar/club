import { useNavigate } from "react-router-dom";

export default function Navbar({
  scrollToClubs,
  scrollToCities,
  scrollToAbout,
}) {
  const navigate = useNavigate();

  return (
    <nav className="absolute top-0 w-full flex justify-between items-center px-14 py-6 z-50">
      <h2
        className="text-2xl font-extrabold text-white tracking-wider cursor-pointer"
        onClick={() => navigate("/")}
      >
        Experience Elite Nightlife
      </h2>

      <div className="hidden md:flex gap-10 text-white text-lg font-medium">
        <button onClick={() => navigate("/")} className="hover:text-gray-300">
          Home
        </button>

        {/* Scroll instead of navigate */}
        <button onClick={scrollToClubs} className="hover:text-gray-300">
          Clubs
        </button>

        <button onClick={scrollToCities} className="hover:text-gray-300">
          Cities
        </button>

        <button onClick={scrollToAbout} className="hover:text-gray-300">
          About
        </button>
      </div>

      <button
        onClick={() => navigate("/login")}
        className="px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition"
      >
        Login
      </button>
    </nav>
  );
}
