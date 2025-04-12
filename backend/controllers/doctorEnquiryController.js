const DoctorEnquiry = require("../models/DoctorEnquiry");
const Patient = require("../models/Patient");

const addDoctorEnquiry = async (req, res) => {
  try {
    const { doctorName, patientID, pressure, temperature, heartRate, weight, description, medicines } = req.body;

    if (!doctorName) {
      return res.status(400).json({ message: "Doctor name is required" });
    }

    if (!patientID) {
      return res.status(400).json({ message: "Patient ID is required" });
    }

    if (!Array.isArray(medicines) || medicines.some(medicine => !medicine.name || !medicine.dosage)) {
      return res.status(400).json({ message: "Each medicine should have a name and dosage" });
    }

    // Fetch patient using `findOne` instead of `findById`
    const patient = await Patient.findOne({ patientID });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Get current IST date & time in a proper format
    const currentISTDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    const formattedDate = new Date(currentISTDate);

    // Create new DoctorEnquiry document
    const newEnquiry = new DoctorEnquiry({
      doctorName,
      patientID,
      pressure,
      temperature,
      heartRate,
      weight,
      description,
      medicines,
      date: formattedDate,
    });

    const savedEnquiry = await newEnquiry.save();
    res.status(201).json(savedEnquiry);
  } catch (error) {
    console.error("Error in addDoctorEnquiry:", error);
    res.status(500).json({ message: "Error saving doctor enquiry", error: error.message });
  }
};

// Get all doctor enquiries
const getDoctorEnquiries = async (req, res) => {
  try {
    const enquiries = await DoctorEnquiry.find().populate("patientID", "name age gender");
    res.status(200).json(enquiries);
  } catch (error) {
    console.error("Error in getDoctorEnquiries:", error);
    res.status(500).json({ message: "Error fetching doctor enquiries", error: error.message });
  }
};

// Get doctor enquiries by Patient ID
const getDoctorEnquiryByPatientID = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findOne({ _id: id });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const enquiries = await DoctorEnquiry.find({ patientID: patient.patientID });

    if (enquiries.length === 0) {
      return res.status(404).json({ message: "No doctor enquiries found for this patient" });
    }

    res.status(200).json(enquiries);
  } catch (error) {
    console.error("Error in getDoctorEnquiryByPatientID:", error);
    res.status(500).json({ message: "Error fetching doctor enquiries", error: error.message });
  }
};

// Get doctor enquiries by RFID UID
const getDoctorEnquiryByRFID = async (req, res) => {
  try {
    const { rfidUID } = req.params;

    // Find the patient using the RFID UID
    const patient = await Patient.findOne({ rfidUID });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found for this RFID UID" });
    }

    // Retrieve doctor enquiries based on the found patient ID
    const enquiries = await DoctorEnquiry.find({ patientID: patient.patientID });

    if (enquiries.length === 0) {
      return res.status(404).json({ message: "No doctor enquiries found for this patient" });
    }

    res.status(200).json(enquiries);
  } catch (error) {
    console.error("Error in getDoctorEnquiryByRFID:", error);
    res.status(500).json({ message: "Error fetching doctor enquiries", error: error.message });
  }
};

const getMedicinesByRFID = async (req, res) => {
  try {
    const { rfidUID } = req.params;

    // Find patient using RFID UID
    const patient = await Patient.findOne({ rfidUID });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found for this RFID UID" });
    }

    // Find the latest doctor enquiry by date
    const latestEnquiry = await DoctorEnquiry.findOne({ patientID: patient.patientID })
      .sort({ date: -1 })  // Get the most recent enquiry
      .select("medicines"); // Select only the medicines field

    if (!latestEnquiry || !latestEnquiry.medicines || latestEnquiry.medicines.length === 0) {
      return res.status(404).json({ message: "No medicines found for this patient" });
    }

    res.status(200).json({ medicines: latestEnquiry.medicines });
  } catch (error) {
    console.error("Error in getMedicinesByRFID:", error);
    res.status(500).json({ message: "Error retrieving medicines", error: error.message });
  }
};


module.exports = { addDoctorEnquiry, getDoctorEnquiries, getDoctorEnquiryByPatientID, getDoctorEnquiryByRFID, getMedicinesByRFID };
