import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { MapPin, Users, Award, Globe, Shield } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  // Refs for sections
  const clubsRef = useRef(null);
  const citiesRef = useRef(null);
  const aboutRef = useRef(null);

  // Scroll functions
  const scrollToClubs = () =>
    clubsRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToCities = () =>
    citiesRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToAbout = () =>
    aboutRef.current?.scrollIntoView({ behavior: "smooth" });

  const clubs = [
    {
      name: "The Luxe Lounge",
      city: "New York",
      image:
        "https://images.stockcake.com/public/6/8/0/68099bed-a20a-4ac5-ac86-38bba253e499_large/vibrant-club-night-stockcake.jpg",
      description: "Premium rooftop experience with panoramic city views",
    },
    {
      name: "Neon Nights",
      city: "Miami",
      image:
        "https://i.pinimg.com/736x/d1/01/00/d10100eec8aaa564fd3ae3592e453840.jpg",
      description: "Electric atmosphere with world-class DJs",
    },
    {
      name: "Crystal Palace",
      city: "Las Vegas",
      image:
        "https://i.pinimg.com/1200x/99/ec/e8/99ece8ed2be74cc8f7cf5f3c8ff93d28.jpg",
      description: "Lavish VIP experience in the heart of the strip",
    },
    {
      name: "Underground Elite",
      city: "Los Angeles",
      image:
        "https://i.pinimg.com/736x/a5/66/fd/a566fd8828cac84208bfb5207bc0e997.jpg",
      description: "Exclusive members-only club with celebrity appearances",
    },
  ];

  const cities = [
    {
      name: "New York",
      clubs: 24,
      image:
        "https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "The city that never sleeps offers unmatched nightlife",
    },
    {
      name: "Miami",
      clubs: 18,
      image:
        "https://images.pexels.com/photos/2433351/pexels-photo-2433351.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Beach vibes meet electric nightlife energy",
    },
    {
      name: "Las Vegas",
      clubs: 32,
      image:
        "https://images.pexels.com/photos/161772/las-vegas-nevada-cities-urban-161772.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "The entertainment capital of the world",
    },
    {
      name: "Los Angeles",
      clubs: 21,
      image:
        "https://images.pexels.com/photos/313782/pexels-photo-313782.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Celebrity hotspots and exclusive venues",
    },
    {
      name: "Chicago",
      clubs: 15,
      image:
        "https://images.pexels.com/photos/1823680/pexels-photo-1823680.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Sophisticated nightlife in the Windy City",
    },
    {
      name: "San Francisco",
      clubs: 12,
      image:
        "https://images.pexels.com/photos/208745/pexels-photo-208745.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Tech meets trendy in Bay Area nightlife",
    },
  ];

  const features = [
    {
      icon: Users,
      title: "Exclusive Access",
      description:
        "Connect with premium nightclubs and skip the lines with VIP entry",
    },
    {
      icon: Award,
      title: "Curated Selection",
      description: "Only the finest venues make it to our platform",
    },
    {
      icon: Globe,
      title: "Global Network",
      description: "Access elite nightlife experiences in cities worldwide",
    },
    {
      icon: Shield,
      title: "Trusted & Secure",
      description: "Your privacy and security are our top priorities",
    },
  ];

  return (
    <div className="w-full">
      <Navbar
        scrollToClubs={scrollToClubs}
        scrollToCities={scrollToCities}
        scrollToAbout={scrollToAbout}
      />

      {/* HERO */}
      <div
        className="min-h-screen bg-cover bg-center relative"
        style={{ backgroundImage: "url('/image1.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative min-h-screen flex flex-col items-center justify-center text-white text-center px-6 pt-24">
          <h1 className="text-5xl font-extrabold mb-6">
            Discover Elite Nightlife
          </h1>

          <p className="text-xl text-gray-200 mb-10">
            Premium clubs, VIP access & global nightlife experiences
          </p>

          <div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10 backdrop-blur-sm">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full h-[400px] md:h-[500px] object-cover"
            >
              <source src="/club-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>

      {/* CLUBS */}
      <section
        ref={clubsRef}
        className="bg-black text-white pt-24 pb-16 px-6 lg:px-14"
      >
        <h2 className="text-5xl font-extrabold text-center mb-6">
          Featured Clubs
        </h2>
        <p className="text-center text-gray-400 mb-10 text-lg">
          Top VIP nightclubs around the world
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {clubs.map((club) => (
            <div
              key={club.name}
              className="bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-700 hover:scale-105 transition"
            >
              <img src={club.image} className="w-full h-64 object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-bold">{club.name}</h3>
                <p className="text-purple-400">{club.city}</p>
                <p className="text-gray-300 mb-4">{club.description}</p>
                <button className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CITIES */}
      <section
        ref={citiesRef}
        className="bg-gradient-to-b from-black to-gray-900 text-white pt-24 pb-16 px-6 lg:px-14"
      >
        <h2 className="text-5xl font-extrabold mb-4 text-center">
          Explore Cities
        </h2>
        <p className="text-center text-gray-400 mb-12 text-lg">
          Premium nightlife destinations
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {cities.map((city) => (
            <div
              key={city.name}
              className="relative rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition"
            >
              <img src={city.image} className="w-full h-80 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              <div className="absolute bottom-0 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="text-purple-400" size={18} />
                  <h3 className="text-3xl font-bold">{city.name}</h3>
                </div>
                <p className="text-gray-300">{city.description}</p>
                <p className="text-purple-400 font-semibold mt-1">
                  {city.clubs} Premium Clubs
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section
        ref={aboutRef}
        className="bg-gradient-to-b from-gray-900 to-black text-white pt-24 pb-20 px-6 lg:px-14"
      >
        <h2 className="text-5xl font-extrabold text-center mb-10">About Us</h2>

        <p className="text-center text-gray-400 max-w-3xl mx-auto mb-14 text-lg">
          We connect nightlife lovers to the most exclusive clubs with VIP
          access and elite experiences.
        </p>

        {/* features */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-20">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 hover:border-purple-500"
            >
              <feature.icon className="text-purple-400 mb-4" size={40} />
              <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 p-12 rounded-2xl max-w-6xl mx-auto border border-purple-500/30">
          <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
          <p className="text-gray-300 text-lg">
            Bringing you VIP tables, exclusive events, and unforgettable
            nightlife experiences worldwide.
          </p>
        </div>

        <div className="text-center mt-14">
          <button
            className="px-12 py-4 bg-purple-600 rounded-full text-lg hover:bg-purple-700"
            onClick={() => navigate("/login")}
          >
            Join the Experience
          </button>
        </div>
      </section>
    </div>
  );
}
