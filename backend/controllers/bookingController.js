const Booking = require("../models/Booking");
const Club = require("../models/Club");
const nodemailer = require("nodemailer");

// 📦 Add a new booking
exports.addBooking = async (req, res) => {
  try {
    const { clubId, name, email, mobile, people, event, date, description } =
      req.body;

    const club = await Club.findById(clubId);
    if (!club) return res.status(404).json({ message: "Club not found" });

    const existingBooking = await Booking.findOne({
      club: clubId,
      email,
      date: {
        $gte: new Date(date),
        $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
      },
    });

    // ❌ If found, block repeat booking
    if (existingBooking) {
      return res.status(400).json({
        message:
          "You already have a booking on this date for this club with this email.",
      });
    }

    const booking = await Booking.create({
      club: clubId,
      name,
      email,
      mobile,
      people,
      event,
      date,
      description,
    });

    // --- Send email ---
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const FRONTEND_URL = "http://localhost:5173"; // adjust if deployed

    const confirmUrl = `${FRONTEND_URL}/confirm-booking/${booking._id}`;

    const editUrl = `${FRONTEND_URL}/club/${clubId}?editBooking=${booking._id}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Confirm your booking for ${club.name}`,
      html: `
        <h2>Booking Details</h2>
        <p><strong>Club:</strong> ${club.name}</p>
        <p><strong>Date:</strong> ${new Date(date).toDateString()}</p>
        <p><strong>Guests:</strong> ${people}</p>
        <p>You can confirm or edit your booking below:</p>
        <a href="${confirmUrl}" style="padding:10px 15px;background:#4CAF50;color:#fff;text-decoration:none;">Confirm Booking</a>
        &nbsp;&nbsp;
        <a href="${editUrl}" style="padding:10px 15px;background:#f39c12;color:#fff;text-decoration:none;">Edit Booking</a>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "Booking created! Confirmation email sent.",
      booking,
    });
  } catch (err) {
    console.error("Booking Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 📜 Get all bookings (for admin or debugging)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("club");
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📍 Get booking by club ID
exports.getBookingsByClub = async (req, res) => {
  try {
    const { clubId } = req.params;
    const bookings = await Booking.find({ club: clubId }).populate("club");
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.confirmBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // 1️⃣ Validate booking ID
    if (!bookingId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    // 2️⃣ Find booking with club info
    const booking = await Booking.findById(bookingId).populate("club");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 3️⃣ Check if already confirmed
    if (booking.status === "confirmed") {
      return res.status(200).json({
        message: "Booking already confirmed",
        booking: {
          clubName: booking.club.name,
          date: booking.date,
        },
      });
    }

    // 4️⃣ Optional expiry: confirm link valid for 24 hours
    const createdAt = new Date(booking.createdAt);
    const now = new Date();
    const diffHours = (now - createdAt) / (1000 * 60 * 60);
    if (diffHours > 24) {
      return res.status(400).json({
        message: "Confirmation link expired (valid for 24 hours only).",
      });
    }

    // 5️⃣ Mark booking confirmed
    booking.status = "confirmed";
    await booking.save();

    res.status(200).json({
      message: "Booking confirmed successfully!",
      booking: {
        clubName: booking.club.name,
        date: booking.date,
      },
    });
  } catch (err) {
    console.error("Error confirming booking:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId).populate(
      "club",
      "name image city description"
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ booking }); // ✅ return wrapped object
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const updates = req.body;

    const booking = await Booking.findById(bookingId).populate("club");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.status === "confirmed") {
      return res.status(400).json({
        message: "This booking is already confirmed and cannot be edited.",
      });
    }
    if (new Date(booking.date) < new Date()) {
      return res.status(400).json({
        message: "You cannot edit a booking for a past date.",
      });
    }
    if (booking.editCount >= 2) {
      // ✅ Check edit limit
      return res
        .status(400)
        .json({ message: "You have reached the maximum of 2 edits." });
    }

    // ✅ Update fields
    Object.assign(booking, updates);
    booking.editCount = (booking.editCount || 0) + 1;
    await booking.save();

    // ✅ Re-send confirmation email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const FRONTEND_URL = "http://localhost:5173";
    const confirmUrl = `${FRONTEND_URL}/confirm-booking/${booking._id}`;
    const editUrl = `${FRONTEND_URL}/club/${booking.club._id}?editBooking=${booking._id}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: booking.email,
      subject: `Updated Booking - Please Confirm Again for ${booking.club.name}`,
      html: `
        <h2>Your booking details were updated</h2>
        <p><strong>Club:</strong> ${booking.club.name}</p>
        <p><strong>Date:</strong> ${new Date(booking.date).toDateString()}</p>
        <p><strong>Guests:</strong> ${booking.people}</p>
        <p>Please confirm or edit your updated booking below:</p>
        <a href="${confirmUrl}" style="padding:10px 15px;background:#4CAF50;color:#fff;text-decoration:none;">Confirm Updated Booking</a>
        &nbsp;&nbsp;
        <a href="${editUrl}" style="padding:10px 15px;background:#f39c12;color:#fff;text-decoration:none;">Edit Again</a>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      message: `Booking updated successfully (${booking.editCount}/2 edits used). Confirmation email sent.`,
      booking,
    });
  } catch (err) {
    console.error("Update Booking Error:", err);
    res.status(500).json({ message: err.message });
  }
};
exports.getBookedDates = async (req, res) => {
  try {
    const { clubId } = req.params;

    const bookings = await Booking.find({ club: clubId }).select("date");
    const bookedDates = bookings.map(
      (b) => new Date(b.date).toISOString().split("T")[0]
    );

    res.json({ bookedDates });
  } catch (err) {
    console.error("Error fetching booked dates:", err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.checkDateAvailability = async (req, res) => {
  try {
    const { clubId, date } = req.query;

    if (!date) {
      return res.status(400).json({
        available: false,
        message: "Date required",
      });
    }

    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);

    const existing = await Booking.findOne({
      club: clubId,
      date: { $gte: start, $lt: end },
    });

    if (existing) {
      return res.json({ available: false });
    }

    res.json({ available: true });
  } catch (err) {
    console.error("Error checking date:", err);
    res.status(500).json({ message: "Server error" });
  }
};
