const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const cityRoutes = require("./routes/cityRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const cors = require("cors");
dotenv.config();
const app = express();

const corsOptions = {
  origin: true,
  credentials: true, // Allow cookies and authorization headers
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Middleware to parse JSON
app.use(express.json());

// Connect to DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);

app.use("/api", cityRoutes);
app.use("/api/booking", bookingRoutes);

// Error handler (optional)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`)
);
