const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const FRONTEND_URL = "http://192.168.1.74:5173"; // change to your frontend IP or domain

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

    if (existingUser) {
      if (!existingUser.isVerified) {
        // Only generate new token if expired
        if (
          !existingUser.verificationTokenExpires ||
          existingUser.verificationTokenExpires < Date.now()
        ) {
          const token = crypto.randomBytes(32).toString("hex");
          existingUser.verificationToken = token;
          existingUser.verificationTokenExpires =
            Date.now() + 24 * 60 * 60 * 1000; // 24 hours
          await existingUser.save();
        }

        // Send verification email
        const verifyLink = `${FRONTEND_URL}/verify-email?token=${existingUser.verificationToken}`;
        await sendEmail(
          email,
          "Verify Your Account",
          `<h2>Welcome Back, ${existingUser.username} 👋</h2>
           <p>Click the link below to verify your account:</p>
           <a href="${verifyLink}" style="padding:10px 15px;background:#4F46E5;color:white;text-decoration:none;border-radius:6px;">Verify Account</a>
           <p>This link will expire in 24 hours.</p>`
        );

        return res.status(200).json({
          message:
            "Email already registered but not verified. Verification link sent.",
        });
      }

      return res.status(400).json({ message: "Email already registered" });
    }

    // Create new user
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

    const verifyLink = `${FRONTEND_URL}/verify-email?token=${verificationToken}`;
    await sendEmail(
      email,
      "Verify Your Account",
      `<h2>Welcome, ${username} 👋</h2>
       <p>Click the link below to verify your account:</p>
       <a href="${verifyLink}" style="padding:10px 15px;background:#4F46E5;color:white;text-decoration:none;border-radius:6px;">Verify Account</a>
       <p>This link will expire in 24 hours.</p>`
    );

    res.status(201).json({
      message:
        "Signup successful! Please check your email to verify your account.",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
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
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
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
    // 1️⃣ Get token and trim spaces
    console.log("Received token:", token); // Add this line
    const token = req.query.token?.trim();

    if (!token) {
      return res.send(`
        <html>
          <body style="display:flex;align-items:center;justify-content:center;height:100vh;background:#111;color:white;font-family:sans-serif;">
            <div style="text-align:center">
              <h2>❌ Invalid verification link</h2>
              <p>Please check your email and try again.</p>
            </div>
          </body>
        </html>
      `);
    }

    // 2️⃣ Find user with token that hasn't expired
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.send(`
        <html>
          <body style="display:flex;align-items:center;justify-content:center;height:100vh;background:#111;color:white;font-family:sans-serif;">
            <div style="text-align:center">
              <h2>❌ Invalid or expired verification link</h2>
              <p>Please request a new verification email.</p>
            </div>
          </body>
        </html>
      `);
    }

    // 3️⃣ Mark user as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    // 4️⃣ Show success message and redirect to login
    res.send(`
      <html>
        <body style="display:flex;align-items:center;justify-content:center;height:100vh;background:#111;color:white;font-family:sans-serif;">
          <div style="text-align:center">
            <h2>✅ Account Verified!</h2>
            <p>Redirecting to login...</p>
            <script>
              setTimeout(() => {
                window.location.href = 'http://192.168.1.43:5173/login';
              }, 2500);
            </script>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send(`
      <html>
        <body style="display:flex;align-items:center;justify-content:center;height:100vh;background:#111;color:white;font-family:sans-serif;">
          <div style="text-align:center">
            <h2>❌ Server Error</h2>
            <p>Please try again later.</p>
          </div>
        </body>
      </html>
    `);
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
