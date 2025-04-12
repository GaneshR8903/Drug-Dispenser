const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  batchNo: { type: String, required: true },
  medicineName: { type: String, required: true },
  mrp: { type: Number, required: true },
  wholesaleName: { type: String, required: true },
  stockCount: { type: Number, required: true },
  manufacturingDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  vendorName: { type: String, required: true },
  vendorAddress: { type: String, required: true },
  vendorPhoneNo: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }, // Automatically stores the date when stock is added
});

module.exports = mongoose.model("Stock", stockSchema);