const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },
    user: {
      // ✅ Add this
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    people: {
      type: Number,
      required: true,
      min: 1,
    },
    event: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed"],
      default: "pending",
    },
    // ✅ Used to limit edit attempts
    editCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true } // ✅ Automatically adds createdAt and updatedAt
);

module.exports = mongoose.model("Booking", bookingSchema);
