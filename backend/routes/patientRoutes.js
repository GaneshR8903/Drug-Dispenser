const express = require("express");
const { addPatient, getPatients, getPatientByID, getPatientByUID } = require("../controllers/patientController");
const Patient = require('../models/Patient');

const router = express.Router();

// Route to add a new patient
router.post("/", addPatient);

// Route to fetch all patients
router.get("/", getPatients); 

// Route to fetch a patient by ID
router.get("/:id", getPatientByID); 

// Route to fetch a patient by UID (RFID)
router.get("/rfid/:uid", getPatientByUID);

module.exports = router;
