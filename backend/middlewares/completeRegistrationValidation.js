const { body, validationResult } = require("express-validator");

exports.completeRegistrationValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),

  body("dob")
    .notEmpty()
    .withMessage("Date of birth is required")
    .isISO8601()
    .toDate()
    .withMessage("Invalid date format")
    .custom((value) => {
      const today = new Date();
      let age = today.getFullYear() - value.getFullYear();
      const m = today.getMonth() - value.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < value.getDate())) {
        age--;
      }
      if (age < 18) {
        throw new Error("You must be 18 years or older");
      }
      return true;
    }),

  body("gender")
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be male, female, or other"),

  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^\+?[0-9]{7,15}$/)
    .withMessage("Invalid phone number format"),

  body("city")
    .notEmpty()
    .withMessage("City is required")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("City can only contain letters and spaces"),

  body("state")
    .notEmpty()
    .withMessage("State is required")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("State can only contain letters and spaces"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
