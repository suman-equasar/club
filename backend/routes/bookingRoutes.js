const express = require("express");
const router = express.Router();
const {
  addBooking,
  getAllBookings,
  getBookingsByClub,
  confirmBooking,
  getBookingById,
  updateBooking,
  getBookedDates,
  checkDateAvailability,
} = require("../controllers/bookingController");

router.post("/", addBooking);
router.get("/", getAllBookings);
router.get("/club/:clubId", getBookingsByClub);
router.get("/confirm/:bookingId", confirmBooking);

// ✅ Always place these BEFORE dynamic routes
router.get("/booked-dates/:clubId", getBookedDates);
router.get("/check-date", checkDateAvailability);

// ✅ Dynamic routes should ALWAYS be last
router.get("/:bookingId", getBookingById);
router.put("/:bookingId", updateBooking);

module.exports = router;
