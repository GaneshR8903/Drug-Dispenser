import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import PlusIcon from "../images/plus.png";
import MinusIcon from "../images/minus.png";
import "../css/MedicineDispense.css"; // Adjust the path as necessary


export const DispenseUpdate = () => {
  const selectedEnquiry = useSelector((state) => state.pharmacyMenu.selectedEnquiry);
  const apiBaseUrl = useSelector((state) => state.global.backendUrl);
  const [medicineStock, setMedicineStock] = useState([]);  // Stores all medicines from MongoDB
  const [distributedMedicines, setDistributedMedicines] = useState({});
  const [pharmacyStaff, setPharmacyStaff] = useState("");  // Input field for staff name

  // Fetch all medicine stock from MongoDB (Availability Collection)
  useEffect(() => {
    const fetchMedicineStock = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/stock/stockAvailability`);
        console.log("Fetched Medicine Data:", response.data);  // Debugging log
        setMedicineStock(response.data);
      } catch (error) {
        console.error("Error fetching medicine stock:", error);
      }
    };

    fetchMedicineStock();
  }, [apiBaseUrl]);

  // Handle increment and decrement for distribution count
  const updateDistributedCount = (medicineName, operation) => {
    setDistributedMedicines((prev) => {
      const currentCount = prev[medicineName] || 0;
      const stockItem = medicineStock.find((item) => 
        item.name === medicineName || item.medicineName === medicineName
      );
      const stockCount = stockItem ? stockItem.stockCount : 0;

      console.log(`Updating ${medicineName}: Current=${currentCount}, Stock=${stockCount}`);

      if (operation === "increase" && currentCount < stockCount) {
        return { ...prev, [medicineName]: currentCount + 1 };
      }
      if (operation === "decrease" && currentCount > 0) {
        return { ...prev, [medicineName]: currentCount - 1 };
      }
      return prev;
    });
  };

  // Function to handle submit
  const handleSubmit = async () => {
    if (!pharmacyStaff.trim()) {
      alert("Please enter pharmacy staff name.");
      return;
    }
  
    const dispensedData = {
      patientID: selectedEnquiry.patientID,
      patientName: selectedEnquiry.name,
      dispensedMedicines: distributedMedicines,
      staffName: pharmacyStaff,
      date: new Date().toISOString(),
    };
  
    try {
      // 1. Store dispense data in DispenseUpdate collection
      await axios.post(`${apiBaseUrl}/api/dispense/update`, dispensedData);
      console.log("Dispensed data saved successfully");
  
      // 2. Update stock availability in the database
      await axios.put(`${apiBaseUrl}/api/stock/updateStock`, { distributedMedicines });
      console.log("Stock updated successfully");
  
      // 3. Update stock count in the frontend immediately
      setMedicineStock((prevStock) =>
        prevStock.map((medicine) => {
          const medicineName = medicine.medicineName;
          const dispensedAmount = distributedMedicines[medicineName] || 0;
          return {
            ...medicine,
            stockCount: medicine.stockCount - dispensedAmount, // Reduce the stock in UI
          };
        })
      );
  
      // Reset distributed medicines after submission
      setDistributedMedicines({});
      setPharmacyStaff("");
  
      alert("Medicine dispensed and stock updated successfully!");
    } catch (error) {
      console.error("Error submitting dispense update:", error);
      alert("Failed to dispense medicines. Try again.");
    }
  };
  

  if (!selectedEnquiry) {
    return <div>No Enquiry Selected</div>;
  }

  return (
    <div className="dispenseUpdate">
      <h2>Dispense Update</h2>

      {/* Patient Information Table */}
      <div className="patientDispense">
        <h3>Patient Details</h3>
        <table border="1">
          <tbody>
            <tr><td><strong>Patient ID:</strong></td><td>{selectedEnquiry.patientID}</td></tr>
            <tr><td><strong>Name:</strong></td><td>{selectedEnquiry.name}</td></tr>
            <tr><td><strong>Age:</strong></td><td>{selectedEnquiry.age}</td></tr>
            <tr><td><strong>Date:</strong></td><td>{new Date(selectedEnquiry.date).toLocaleDateString("en-GB")}</td></tr>
            <tr><td><strong>Time:</strong></td><td>{selectedEnquiry.time}</td></tr>
            <tr><td><strong>Medicines Prescribed:</strong></td><td>{selectedEnquiry.medicines || "No Medicines"}</td></tr>
          </tbody>
        </table>
      </div>

      {/* Medicine Distribution Table */}
      <div className="mediDispenseTable">
        <h3>Distribute Medicines</h3>
        <table border="1">
          <thead>
            <tr>
              <th>Medicine Name</th>
              <th>Stock Count</th>
              <th>Action</th>
              <th>Current Count</th>
            </tr>
          </thead>
          <tbody>
            {medicineStock.length > 0 ? (
              medicineStock.map((medicine, index) => {
                console.log("Rendering Medicine:", medicine);
                const medicineName = medicine.medicineName || "Unknown Medicine";
                const stockCount = medicine.stockCount || 0;
                const currentCount = distributedMedicines[medicineName] || 0;

                return (
                  <tr key={index}>
                    <td>{medicineName}</td>
                    <td>{stockCount}</td>
                    <td>
                      <button 
                        onClick={() => updateDistributedCount(medicineName, "increase")}
                        disabled={currentCount >= stockCount}
                      >
                        <img src={PlusIcon} alt="Increase" className="icon" />
                      </button>
                      <button 
                        onClick={() => updateDistributedCount(medicineName, "decrease")}
                        disabled={currentCount <= 0}
                      >
                        <img src={MinusIcon} alt="Decrease" className="icon" />
                      </button>
                    </td>
                    <td>{currentCount}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4">No Medicines Available</td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* Staff Name Input */}
        <div>
          <label>Pharmacy Staff Name </label>
          <input 
            type="text" 
            value={pharmacyStaff} 
            onChange={(e) => setPharmacyStaff(e.target.value)}
            placeholder="Enter staff name"
          />
        </div>

        {/* Submit Button */}
        <button className="submitBtn" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};
