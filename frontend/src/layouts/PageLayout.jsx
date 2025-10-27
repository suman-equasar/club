import React from "react";

export default function PageLayout({
  children,
  backgroundImage = "/image1.jpg",
}) {
  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center grid place-items-center"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      {/* Dark overlays */}
      <div className="absolute inset-0 bg-black/60" />
      <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_45%,#000_40%,transparent_100%)] bg-black/40" />

      {/* ✅ Remove fixed width container */}
      <div className="relative z-10 w-full px-4 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
