import React from "react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div
      className="relative min-h-dvh w-full bg-cover bg-center grid place-items-center"
      style={{ backgroundImage: "url('/image1.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_45%,#000_40%,transparent_100%)] bg-black/40" />
      <div className="relative z-10 row-start-1">
        <Outlet />
      </div>
    </div>
  );
}
