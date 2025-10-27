const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String },
});

module.exports = mongoose.model("City", citySchema);
