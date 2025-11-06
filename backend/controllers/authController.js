const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const FRONTEND_URL = "http://192.168.1.90:5173"; // change to your frontend IP or domain

// Helper function to send emails
const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // App password if 2FA enabled
    },
  });

  await transporter.sendMail({ to, subject, html });
};

// ---------- SIGNUP ----------
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    let existingUser = await User.findOne({ email });

    // ✅ If user already exists
    if (existingUser) {
      // ❌ If user is not verified
      if (!existingUser.isVerified) {
        return res.status(200).json({
          message:
            "Email already registered but not verified. Please check your inbox to verify your account.",
        });
      }

      // ✅ If user already verified
      return res.status(400).json({ message: "Email already registered" });
    }

    // ✅ Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
      verificationTokenExpires,
    });

    await newUser.save();

    // ✅ Send verification email for new account
    const verifyLink = `${FRONTEND_URL}/verify-email?token=${verificationToken}`;

    await sendEmail(
      email,
      "Verify Your Account",
      `<h2>Welcome, ${username} 👋</h2>
       <p>Click the link below to verify your account:</p>
       <a href="${verifyLink}" style="padding:10px 15px;background:#4F46E5;color:white;text-decoration:none;border-radius:6px;">Verify Account</a>
       <p>This link will expire in 24 hours.</p>`
    );

    return res.status(201).json({
      message:
        "Signup successful! Please check your email to verify your account.",
    });
  } catch (err) {
    console.error("Signup Error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// ---------- LOGIN ----------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });
    if (!user.isVerified)
      return res
        .status(403)
        .json({ message: "Please verify your email first." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      {
        _id: user._id, // use _id to match req.user._id
        username: user.username, // include name for booking
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // ✅ increase expiry
    );
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const token = req.query.token?.trim();

    // ✅ Log token received from frontend
    console.log("📩 Received token from URL:", token);

    if (!token) {
      console.log("❌ No token received");
      return res.status(400).json({
        status: "error",
        message: "Invalid or missing token",
      });
    }

    const user = await User.findOne({
      verificationToken: token,
      isVerified: false,
      verificationTokenExpires: { $gt: Date.now() },
    });

    // ✅ Log if user found or not
    if (!user) {
      console.log("❌ No user found for token OR token expired");
      return res.status(400).json({
        status: "error",
        message: "Expired or invalid verification link. Request a new one.",
      });
    }

    console.log("✅ User found for token:", user.email);

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    console.log("✅ Email verified successfully for:", user.email);

    return res.status(200).json({
      status: "success",
      message: "Email verified successfully",
    });
  } catch (err) {
    console.error("❌ Email verify error:", err);
    return res.status(500).json({
      status: "error",
      message: "Server error while verifying email",
    });
  }
};

// ---------- FORGOT PASSWORD ----------
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(400)
        .json({ message: "User with this email does not exist" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}`;
    await sendEmail(
      email,
      "Password Reset Request",
      `<p>Click here to reset your password:</p>
       <a href="${resetLink}">${resetLink}</a>
       <p>This link is valid for 15 minutes.</p>`
    );

    res.status(200).json({ message: "Password reset link sent to email" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ---------- RESET PASSWORD ----------
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Email login

exports.emailLogin = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  let user = await User.findOne({ email });

  if (user && user.isSignup) {
    // Already registered
    return res
      .status(400)
      .json({ message: "Email already registered. Please login normally." });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expires = Date.now() + 15 * 60 * 1000;

  if (!user) user = new User({ email });

  user.magicLoginToken = token;
  user.magicLoginExpires = expires;
  await user.save();

  const link = `${FRONTEND_URL}/register?token=${token}&email=${encodeURIComponent(
    email
  )}`;
  const htmlContent = `
<html>
  <body style="font-family:sans-serif; text-align:center; background:#f4f4f4; padding:20px;">
    <div style="max-width:500px; margin:auto; background:#111; padding:30px; border-radius:12px; color:white;">
      <h2 style="color:#4F46E5;">✨ Complete Your Registration</h2>
      <p>Click the button below to complete your registration:</p>
      <a href="${link}" 
         style="display:inline-block; padding:12px 20px; background:#4F46E5; color:white; text-decoration:none; border-radius:8px; margin-top:10px;">
        Complete Registration
      </a>
      <p style="margin-top:20px; font-size:12px; color:#ccc;">
        This link expires in 15 minutes.
      </p>
    </div>
  </body>
</html>
`;
  await sendEmail(email, "Complete your registration", htmlContent);

  res.json({ message: "Registration link sent to email!" });
};

// ---------- VERIFY MAGIC LOGIN ----------
exports.verifyMagicLogin = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).send("Missing token");

    const user = await User.findOne({
      magicLoginToken: token,
      magicLoginExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send(`
        <h2>❌ Invalid or expired link</h2>
        <p>Please request a new registration email.</p>
      `);
    }

    // Redirect frontend to registration page with token & email
    res.redirect(
      `${FRONTEND_URL}/register?token=${token}&email=${encodeURIComponent(
        user.email
      )}`
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.completeRegistration = async (req, res) => {
  try {
    console.log("📩 Received body:", req.body);

    const { email, token, name, dob, gender, city, state, phone } = req.body;

    if (!email || !token)
      return res.status(400).json({ message: "Token and email are required" });

    console.log("🔍 Finding user with email:", email, "and token:", token);

    const user = await User.findOne({
      email,
      magicLoginToken: token,
      magicLoginExpires: { $gt: Date.now() },
    });

    console.log("👤 Found user:", user);

    if (!user)
      return res
        .status(400)
        .json({ message: "Invalid or expired registration link" });

    user.name = name;
    user.dob = dob;
    user.gender = gender;
    user.city = city;
    user.state = state;
    user.phone = phone;
    user.isVerified = true;
    user.isSignup = true;
    user.magicLoginToken = undefined;
    user.magicLoginExpires = undefined;

    console.log("💾 Saving updated user...");
    await user.save();

    console.log("✅ Registration completed for:", email);
    res.json({ message: "Registration completed successfully" });
  } catch (err) {
    console.error("❌ Complete Registration Error:", err);
    res.status(500).json({
      message: "Server error while completing registration",
      error: err.message,
    });
  }
};
