const City = require("../models/City");
const Club = require("../models/Club");

// Add a new city
exports.addCity = async (req, res) => {
  try {
    const city = await City.create(req.body);
    res.status(201).json(city);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all cities
exports.getCities = async (req, res) => {
  try {
    const cities = await City.find();
    res.status(200).json(cities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add club under a city
exports.addClub = async (req, res) => {
  try {
    const club = await Club.create(req.body);
    res.status(201).json(club);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get clubs by city
exports.getClubsByCity = async (req, res) => {
  try {
    const clubs = await Club.find({ city: req.params.cityId }).populate("city");
    res.status(200).json(clubs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// 📍 Get a single club by ID
exports.getClubById = async (req, res) => {
  try {
    const { clubId } = req.params;
    const club = await Club.findById(clubId).populate("city");
    if (!club) return res.status(404).json({ message: "Club not found" });
    res.status(200).json(club);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
