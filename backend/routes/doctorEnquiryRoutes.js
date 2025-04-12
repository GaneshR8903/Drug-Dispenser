const express = require("express");
const { addDoctorEnquiry, getDoctorEnquiries, getDoctorEnquiryByPatientID, getDoctorEnquiryByRFID, getMedicinesByRFID } = require("../controllers/doctorEnquiryController");

const router = express.Router();

router.post("/", addDoctorEnquiry);
router.get("/", getDoctorEnquiries);
router.get("/patient/:id", getDoctorEnquiryByPatientID); // Fetch by patient ID
router.get("/rfid/:rfidUID", getDoctorEnquiryByRFID); // Fetch by RFID UID
router.get("/medicines/rfid/:rfidUID", getMedicinesByRFID);


module.exports = router;