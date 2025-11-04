import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function VerifyEmail() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Invalid Link ❌",
        text: "Verification link is missing or invalid.",
      });
      return;
    }

    const verifyAccount = async () => {
      try {
        const res = await fetch(
          `http://192.168.1.74:5006/api/auth/verify-email?token=${token}`
        );

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        Swal.fire({
          icon: "success",
          title: "Email Verified ✅",
          text: "Redirecting to login...",
          timer: 2000,
          showConfirmButton: false,
        });

        setTimeout(() => navigate("/login"), 2000);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Verification Failed ❌",
          text: err.message || "Invalid or expired link.",
        });
      }
    };

    verifyAccount();
  }, []);

  return null; // no UI shown
}
