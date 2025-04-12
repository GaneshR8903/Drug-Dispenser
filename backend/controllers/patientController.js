const Patient = require("../models/Patient");

// Generate Next Patient ID
const generatePatientID = async () => {
  const lastPatient = await Patient.findOne().sort({ _id: -1 }); // Get last added patient
  if (!lastPatient || !lastPatient.patientID) {
    return "MEDI000001"; // If no previous patient, start with MEDI000001
  }

  const lastIDNumber = parseInt(lastPatient.patientID.replace("MEDI", ""), 10);
  const newID = lastIDNumber + 1;
  return `MEDI${newID.toString().padStart(6, "0")}`; // Format as MEDI000001
};

// @desc    Add new patient
// @route   POST /api/patients
// @access  Public
const addPatient = async (req, res) => {
  try {
    const { name, age, dob, weight, height, gender, phone, address, rfidUID } = req.body;

    // Validate required fields
    if (!name || !age || !dob || !weight || !height || !gender|| !phone || !address || !rfidUID) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if RFID UID already exists
    const existingPatient = await Patient.findOne({ rfidUID });
    if (existingPatient) {
      return res.status(400).json({ message: "RFID UID already assigned to another patient." });
    }

    // ✅ Generate patientID before using it
    const patientID = await generatePatientID();

    // ✅ Save new patient with generated patientID
    const newPatient = new Patient({ patientID, name, age, dob, weight, height, gender, phone, address, rfidUID });
    await newPatient.save();

    res.status(201).json({ message: "Patient added successfully!", patientID });
  } catch (error) {
    console.error("Error adding patient:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};



// @desc    Get all patients
// @route   GET /api/patients
// @access  Public
const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error.message);
    res.status(500).json({ message: "Error fetching patients", error: error.message });
  }
};

// @desc    Get patient by ID
// @route   GET /api/patients/:id
// @access  Public
const getPatientByID = async (req, res) => {
  try {
    const patient = await Patient.findOne({ patientID: req.params.id });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    console.error("Error fetching patient by ID:", error.message);
    res.status(500).json({ message: "Error fetching patient", error: error.message });
  }
};


// @desc    Get patient by RFID UID
// @route   GET /api/patients/rfid/:uid
// @access  Public
const getPatientByUID = async (req, res) => {
  try {
    const patient = await Patient.findOne({ rfidUID: req.params.uid }); // Search for patient by RFID UID
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    console.error("Error fetching patient by RFID UID:", error.message);
    res.status(500).json({ message: "Error fetching patient", error: error.message });
  }
};


module.exports = { addPatient, getPatients, getPatientByID, getPatientByUID };
