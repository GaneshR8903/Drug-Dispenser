const mongoose = require("mongoose");

const doctorEnquirySchema = new mongoose.Schema({
  doctorName: { type: String, required: true }, // Added doctor name
  patientID: { type: String, required: true },
  pressure: { type: String, required: true },
  temperature: { type: String, required: true },
  heartRate: { type: String, required: true },
  weight: { type: String, required: true },
  description: { type: String, required: true },
  medicines: [
    {
      name: { type: String, required: true },
      dosage: { type: String, required: true }, // Dosage field for each medicine
    },
  ],
  date: { type: Date, default: Date.now }, // Automatically stores the current date and time
});


module.exports = mongoose.model("DoctorEnquiry", doctorEnquirySchema);
