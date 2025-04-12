const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({
  medicineName: { type: String, required: true, unique: true },
  stockCount: { type: Number, required: true },
});
module.exports = mongoose.model("Availability", availabilitySchema);
