const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true },
  description: String,
  image: String,
});

module.exports = mongoose.model("Club", clubSchema);
