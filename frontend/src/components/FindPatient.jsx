import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "../css/HomeBox.css";

export const FindPatient = () => {
  const apiBaseUrl = useSelector((state) => state.global.backendUrl);
  const [searchQuery, setSearchQuery] = useState("");
  const [patientData, setPatientData] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a Patient ID or RFID UID.");
      return;
    }

    try {
      let response;
      if (searchQuery.startsWith("MEDI")) {
        // Search by Patient ID
        response = await axios.get(`${apiBaseUrl}/api/patients/${searchQuery}`);
      } else {
        // Search by RFID UID
        response = await axios.get(`${apiBaseUrl}/api/patients/rfid/${searchQuery}`);
      }

      setPatientData(response.data);
      setError("");
    } catch (error) {
      setError("Patient not found.");
      setPatientData(null);
    }
  };

  return (
    <div className="FindPatientDiv">
      <h3>Search Patient</h3>
      <input
        type="text"
        placeholder="Enter Patient ID or RFID UID"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Find</button>

      {error && <p className="error">{error}</p>}

      {patientData && (
        <div className="PatientDetails">
          <h3>Patient Details</h3>
          <p><strong>ID:</strong> {patientData.patientID}</p>
          <p><strong>Name:</strong> {patientData.name}</p>
          <p><strong>Age:</strong> {patientData.age}</p>
          <p><strong>DOB:</strong> {new Date(patientData.dob).toLocaleDateString("en-GB")}</p>
          <p><strong>Weight:</strong> {patientData.weight} kg</p>
          <p><strong>Height:</strong> {patientData.height} cm</p>
          <p><strong>Phone:</strong> {patientData.phone}</p>
          <p><strong>Address:</strong> {patientData.address}</p>
          <p><strong>RFID UID:</strong> {patientData.rfidUID}</p>
        </div>
      )}
    </div>
  );
};
