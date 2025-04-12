import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Doctor.css";
import PlusIcon from "../images/plus.png";
import MinusIcon from "../images/minus.png";
import { useSelector } from "react-redux";

export const Doctor = () => {
  const apiBaseUrl = useSelector((state) => state.global.backendUrl);
  const [formData, setFormData] = useState({
    doctorName: "",
    patientID: "",
    pressure: "",
    temperature: "",
    heartRate: "",
    weight: "",
    description: "",
    date: "",
    medicines: [{ name: "", dosage: "" }],
  });
  const [patients, setPatients] = useState([]);
  const [availableMedicines, setAvailableMedicines] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const patientsResponse = await axios.get(`${apiBaseUrl}/api/patients`);
        setPatients(patientsResponse.data);

        const stockResponse = await axios.get(`${apiBaseUrl}/api/stock/stockAvailability`);
        setAvailableMedicines(stockResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error fetching initial data");
      }
    };

    fetchInitialData();
  }, [apiBaseUrl]);

  const addMedicineField = () => {
    setFormData({
      ...formData,
      medicines: [...formData.medicines, { name: "", dosage: "" }],
    });
  };

  const removeMedicineField = () => {
    if (formData.medicines.length > 1) {
      setFormData({
        ...formData,
        medicines: formData.medicines.slice(0, -1),
      });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMedicineChange = (index, field, value) => {
    const newMedicines = [...formData.medicines];
    newMedicines[index][field] = value;
    setFormData({ ...formData, medicines: newMedicines });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiBaseUrl}/api/doctor-enquiries`, formData);
      alert("Patient Enquiry Added Successfully!");
      console.log(response.data);
      setFormData({
        doctorName: "",
        patientID: "",
        pressure: "",
        temperature: "",
        heartRate: "",
        weight: "",
        description: "",
        date: "",
        medicines: [{ name: "", dosage: "" }],
      });
    } catch (error) {
      console.error(error);
      alert("Error adding patient enquiry");
    }
  };

  return (
    <div className="doctorMain">
      <h1>Patient Enquiry</h1>
      <form onSubmit={handleSubmit}>
        <div className="intbox">
          <label>Doctor Name</label>
          <input type="text" name="doctorName" value={formData.doctorName} onChange={handleChange} required />
        </div>

        <div className="intbox">
          <label>Patient ID</label>
          <select name="patientID" value={formData.patientID} onChange={handleChange} required>
            <option value="">Select a Patient</option>
            {patients.map((patient) => (
              <option key={patient._id} value={patient.patientID}>
                {patient.patientID} - {patient.name}
              </option>
            ))}
          </select>
        </div>

        <div className="intbox"><label>Pressure</label><input type="text" name="pressure" value={formData.pressure} onChange={handleChange} /></div>
        <div className="intbox"><label>Temperature</label><input type="text" name="temperature" value={formData.temperature} onChange={handleChange} /></div>
        <div className="intbox"><label>Heart Rate</label><input type="text" name="heartRate" value={formData.heartRate} onChange={handleChange} /></div>
        <div className="intbox"><label>Weight</label><input type="text" name="weight" value={formData.weight} onChange={handleChange} /></div>
        <div className="intbox full-width">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
        </div>
        <div className="intbox full-width">
          <label>Date</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} />
        </div>

        <div className="intbox full-width mediInput">
          <label>Medicines</label>
          <div className="mediMain">
            {formData.medicines.map((medicine, index) => (
              <div key={index} className="medicineRow">
                <select
                  value={medicine.name}
                  onChange={(e) => handleMedicineChange(index, "name", e.target.value)}
                >
                  <option value="">Select Medicine</option>
                  {availableMedicines.map((med, i) => (
                    <option key={i} value={med.medicineName}>
                      {med.medicineName} ({med.stockCount})
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Dosage"
                  value={medicine.dosage}
                  onChange={(e) => handleMedicineChange(index, "dosage", e.target.value)}
                />
              </div>
            ))}
            <div>
              <img src={PlusIcon} alt="Add Medicine" onClick={addMedicineField} className="plusIcon" />
              <img src={MinusIcon} alt="Remove Medicine" onClick={removeMedicineField} className="minusIcon" />
            </div>
          </div>
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};