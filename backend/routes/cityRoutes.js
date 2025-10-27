const express = require("express");

const {
  addCity,
  getCities,
  addClub,
  getClubsByCity,
  getClubById,
} = require("../controllers/cityController");

const router = express.Router();

// Cities
router.post("/add-city", addCity);
router.get("/cities", getCities);

// Clubs
router.post("/add-club", addClub);
router.get("/clubs/:cityId", getClubsByCity);
router.get("/club/:clubId", getClubById);
module.exports = router;
