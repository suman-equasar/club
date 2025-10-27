const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // 👤 Basic Info
    name: {
      type: String,
      trim: true,
    },

    // Username is optional (auto-generated or unused for magic link login)
    username: {
      type: String,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [20, "Username cannot exceed 20 characters"],
      unique: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        "Please provide a valid email",
      ],
    },

    // Password is optional (since you're using email magic link)
    password: {
      type: String,
      minlength: [8, "Password must be at least 8 characters"],
    },

    // Role for admin/user differentiation
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // 👇 Extra Profile Info
    dob: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      match: [/^\+?[0-9]{7,15}$/, "Please provide a valid phone number"],
    },

    // ✅ Magic login fields
    magicLoginToken: String,
    magicLoginExpires: Date,

    // ✅ Email verification fields
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpires: Date,

    // ✅ Password reset
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    // ✅ Registration flow flag
    isSignup: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Auto-generate username if empty
userSchema.pre("save", async function (next) {
  if (!this.username && this.email) {
    let baseUsername = this.email
      .split("@")[0]
      .toLowerCase()
      .replace(/\s+/g, "");
    let username = baseUsername;

    const User = mongoose.model("User"); // Reference to the model
    let exists = await User.findOne({ username });
    let attempt = 0;

    while (exists) {
      // Append random string if username exists
      username = `${baseUsername}${Math.floor(100 + Math.random() * 900)}`; // 3-digit random
      exists = await User.findOne({ username });

      attempt++;
      if (attempt > 10) {
        // fallback if too many collisions
        username = `${baseUsername}${Date.now()}`;
        break;
      }
    }

    this.username = username;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
