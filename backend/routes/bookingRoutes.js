const express = require("express");
const router = express.Router();
const {
  addBooking,
  getAllBookings,
  getBookingsByClub,
  confirmBooking,
  getBookingById,
  updateBooking,
} = require("../controllers/bookingController");

router.post("/", addBooking);

router.get("/", getAllBookings);

router.get("/club/:clubId", getBookingsByClub);
router.get("/confirm/:bookingId", confirmBooking);
router.get("/:bookingId", getBookingById);
router.put("/:bookingId", updateBooking);

module.exports = router;
