const mongoose = require("mongoose");

const DispenseUpdateSchema = new mongoose.Schema({
  patientID: { type: String, required: true },
  patientName: { type: String, required: true },
  dispensedMedicines: { type: Object, required: true }, // { "Paracetamol": 2, "Ibuprofen": 1 }
  staffName: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("DispenseUpdate", DispenseUpdateSchema);
