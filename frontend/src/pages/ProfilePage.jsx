import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { CalendarDays, Mail, User } from "lucide-react";

export default function ProfilePage() {
  const { user, logout } = useContext(AuthContext);
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") ||
      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
  );

  // 📸 Save profile image to localStorage
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result);
        localStorage.setItem("profileImage", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4c0d6f] via-[#9b166b] to-[#ff417c] text-white flex items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] border border-white/20 hover:shadow-[0_0_25px_rgba(255,64,129,0.6)] transition-all duration-300">
        <div className="absolute inset-0 rounded-3xl ring-1 ring-white/15 pointer-events-none" />

        {/* Profile Header */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <img
              src={profileImage}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-2 border-pink-300/40"
            />
            <label
              htmlFor="imageUpload"
              className="absolute bottom-1 right-1 bg-pink-400/30 hover:bg-pink-400/50 rounded-full p-1 cursor-pointer transition-all"
              title="Change photo"
            >
              📷
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-pink-300 via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-md">
            {user?.username || "User"}
          </h2>
          <p className="text-pink-200 text-sm">{user?.email}</p>
        </div>

        {/* User Info Section */}
        <div className="mt-8 bg-white/10 rounded-2xl p-5 space-y-3 text-sm border border-white/20">
          <div className="flex items-center gap-2">
            <User size={16} className="text-fuchsia-300" />
            <span>
              <span className="text-white/60">Name:</span>{" "}
              {user?.username || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-fuchsia-300" />
            <span>
              <span className="text-white/60">Email:</span>{" "}
              {user?.email || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="text-fuchsia-300" />
            <span>
              <span className="text-white/60">Member Since:</span>{" "}
              {new Date(user?.createdAt || Date.now()).toDateString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mt-8">
          <button
            onClick={logout}
            className="bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-fuchsia-500 hover:to-pink-600 px-6 py-2 rounded-full font-semibold shadow-md hover:shadow-[0_0_20px_rgba(255,64,129,0.6)] transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
