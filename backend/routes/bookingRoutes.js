const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");
const {
  addBooking,
  getAllBookings,
  getBookingsByClub,
  confirmBooking,
  getBookingById,
  updateBooking,
  getBookedDates,
  checkDateAvailability,
  getUserBookings,
} = require("../controllers/bookingController");
const { verify } = require("jsonwebtoken");

router.post("/", verifyToken, addBooking);
router.get("/", verifyToken, getAllBookings);
router.get("/club/:clubId", verifyToken, getBookingsByClub);
router.get("/confirm/:bookingId", confirmBooking);
router.get("/my-bookings", verifyToken, getUserBookings);
// ✅ Always place these BEFORE dynamic routes
router.get("/booked-dates/:clubId", verifyToken, getBookedDates);
router.get("/check-date", verifyToken, checkDateAvailability);

// ✅ Dynamic routes should ALWAYS be last
router.get("/:bookingId", verifyToken, getBookingById);
router.put("/:bookingId", verifyToken, updateBooking);

module.exports = router;
