import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "../css/HomeBox.css";

export const NewPatient = () => {
  const apiBaseUrl = useSelector((state) => state.global.backendUrl);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    dob: "",
    weight: "",
    height: "",
    gender: "",
    phone: "",
    address: "",
    rfidUID: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "dob") {
      const birthDate = new Date(value);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }

      setFormData({
        ...formData,
        dob: value,
        age: calculatedAge.toString(),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert("Invalid phone number! Please enter a 10-digit number.");
      return;
    }

    try {
      const response = await axios.post(`${apiBaseUrl}/api/patients`, formData);
      alert(`Patient added successfully! Patient ID: ${response.data.patientID}`);
      setFormData({
        name: "",
        age: "",
        dob: "",
        weight: "",
        height: "",
        gender: "",
        phone: "",
        address: "",
        rfidUID: "",
      });
    } catch (error) {
      console.error("Error adding patient:", error);
      alert(error.response?.data?.message || "Error adding patient");
    }
  };

  return (
    <div className="NewPatientBox">
      <h2>New Patient</h2>
      <form onSubmit={handleSubmit}>
        <div className="PatientDetails">
          <div className="left-section">
            <label>Patient Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />

            <label>Age:</label>
            <input type="number" name="age" value={formData.age} readOnly />

            <label>Date of Birth:</label>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />

            <label>Weight (kg):</label>
            <input type="number" name="weight" value={formData.weight} onChange={handleChange} required />

            <label>Gender:</label>
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Transgender">Transgender</option>
            </select>
          </div>

          <div className="right-section">
            <label>Height (cm):</label>
            <input type="number" name="height" value={formData.height} onChange={handleChange} required />

            <label>Phone No:</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />

            <label>Address:</label>
            <textarea name="address" value={formData.address} onChange={handleChange} required></textarea>

            <label>RFID UID:</label>
            <input type="text" name="rfidUID" value={formData.rfidUID} onChange={handleChange} required />
          </div>
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
