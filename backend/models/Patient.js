const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    patientID: { type: String, unique: true, required: true }, // Auto-generated patient ID
    rfidUID: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    dob: { type: String, required: true },
    weight: { type: Number, required: true },
    height: { type: Number, required: true },
    gender: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
