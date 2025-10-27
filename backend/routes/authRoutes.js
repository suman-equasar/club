const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
  emailLogin,
  verifyMagicLogin,
  completeRegistration,
} = require("../controllers/authController");
const { signupValidation } = require("../middlewares/validateSignup");
const { loginValidation } = require("../middlewares/validateLogin");
const {
  forgotPasswordValidation,
} = require("../middlewares/forgotPasswordValidation");
const {
  resetPasswordValidation,
} = require("../middlewares/resetPasswordValidation");

const {
  completeRegistrationValidation,
} = require("../middlewares/completeRegistrationValidation");
const { verifyToken } = require("../middlewares/auth");
const User = require("../models/User");
router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);
router.post("/forgot-password", forgotPasswordValidation, forgotPassword);
router.post("/reset-password/:token", resetPasswordValidation, resetPassword);
router.get("/verify-email", verifyEmail);
router.post("/email-login", emailLogin);
router.get("/verify-magic", verifyMagicLogin);
router.post(
  "/completeRegistration",
  completeRegistrationValidation,
  completeRegistration
);

router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("username email role");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
