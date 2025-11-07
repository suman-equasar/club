import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ConfirmBooking() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Confirming your booking...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const confirmBooking = async () => {
      try {
        const res = await fetch(
          `http://localhost:5006/api/booking/confirm/${bookingId}`
        );

        const data = await res.json();

        if (res.ok && data.booking) {
          const formattedDate = new Date(
            data.booking.date
          ).toLocaleDateString();
          setMessage(
            `🎉 Booking confirmed!\nClub: ${data.booking.clubName}\nDate: ${formattedDate}`
          );
        } else {
          setMessage(data.message || "Failed to confirm booking.");
        }
      } catch (err) {
        setMessage("Server error while confirming booking.");
      } finally {
        setLoading(false);
        setTimeout(() => navigate("/my-bookings"), 2000);
      }
    };

    confirmBooking();
  }, [bookingId, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-950 via-fuchsia-900 to-pink-800 text-white text-center px-4">
      {loading ? (
        <p className="animate-pulse text-lg">⏳ Please wait...</p>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-4">{message}</h1>
        </>
      )}
    </div>
  );
}
