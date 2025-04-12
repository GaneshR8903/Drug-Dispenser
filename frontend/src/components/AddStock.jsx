import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedPharmacyMenu } from "../redux/pharmacyMenuSlice";
import "../css/Pharmacy.css";
import "../css/AddStock.css";

import { MedicineDispense } from "./MedicineDispense";
import { StockMonitor } from "./StockMonitor";

export const AddStock = () => {
  const dispatch = useDispatch();
  const selectedPharmacyMenu = useSelector((state) => state.pharmacyMenu.selectedPharmacyMenu);
  const apiBaseUrl = useSelector((state) => state.global.backendUrl);

  // State for Add Stock inputs
  const [stockData, setStockData] = useState({
    batchNo: "",
    medicineName: "",
    mrp: "",
    wholesaleName: "",
    stockCount: "",
    manufacturingDate: "",
    expiryDate: "",
    vendorName: "",
    vendorAddress: "",
    vendorPhoneNo: "",
  });

  // Handle input change
  const handleInputChange = (e) => {
    setStockData({ ...stockData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`${apiBaseUrl}/api/stock`, stockData);
      // Reset form after successful submission
      setStockData({
        batchNo: "",
        medicineName: "",
        mrp: "",
        wholesaleName: "",
        stockCount: "",
        manufacturingDate: "",
        expiryDate: "",
        vendorName: "",
        vendorAddress: "",
        vendorPhoneNo: "",
      });

      alert("Stock added successfully!");
    } catch (error) {
      console.error("Error submitting stock data", error);
    }
  };

  return (
    <div className="mainphar">
      <div className="addStockDiv">
        {selectedPharmacyMenu === "Medicine Dispense" && <MedicineDispense />}
        {selectedPharmacyMenu === "Stock Monitor" && <StockMonitor />}

        {selectedPharmacyMenu === "Add Stock" && (
          <div className="add-stock-form">
            <h2>Add New Stock</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Batch No:
                <input type="text" name="batchNo" value={stockData.batchNo} onChange={handleInputChange} required />
              </label>

              <label>
                Medicine Name:
                <input type="text" name="medicineName" value={stockData.medicineName} onChange={handleInputChange} required />
              </label>

              <label>
                MRP:
                <input type="number" name="mrp" value={stockData.mrp} onChange={handleInputChange} required />
              </label>

              <label>
                Wholesale Name:
                <input type="text" name="wholesaleName" value={stockData.wholesaleName} onChange={handleInputChange} required />
              </label>

              <label>
                Stock Count:
                <input type="number" name="stockCount" value={stockData.stockCount} onChange={handleInputChange} required />
              </label>

              <label>
                Manufacturing Date:
                <input type="date" name="manufacturingDate" value={stockData.manufacturingDate} onChange={handleInputChange} required />
              </label>

              <label>
                Expiry Date:
                <input type="date" name="expiryDate" value={stockData.expiryDate} onChange={handleInputChange} required />
              </label>

              <label>
                Vendor Name:
                <input type="text" name="vendorName" value={stockData.vendorName} onChange={handleInputChange} required />
              </label>

              <label>
                Vendor Address:
                <input type="text" name="vendorAddress" value={stockData.vendorAddress} onChange={handleInputChange} required />
              </label>

              <label>
                Vendor Phone No:
                <input type="text" name="vendorPhoneNo" value={stockData.vendorPhoneNo} onChange={handleInputChange} required />
              </label>

              <button type="submit">Add Stock</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
