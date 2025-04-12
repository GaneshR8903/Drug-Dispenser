import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export const StockExpire = () => {
  const [stockData, setStockData] = useState([]);
  const apiBaseUrl = useSelector((state) => state.global.backendUrl);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/stock`);
        setStockData(response.data);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchStockData();
  }, [apiBaseUrl]);

  return (
    <div className="stockExpire">
      <h2>Stock Expiry Report</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Batch No</th>
            <th>Medicine Name</th>
            <th>MRP</th>
            <th>Wholesale Name</th>
            <th>Stock Count</th>
            <th>Manufacturing Date</th>
            <th>Expiry Date</th>
            <th>Vendor Name</th>
            <th>Vendor Address</th>
            <th>Vendor Phone No</th>
          </tr>
        </thead>
        <tbody>
          {stockData.length > 0 ? (
            stockData.map((stock) => (
              <tr key={stock._id}>
                <td>{stock.batchNo}</td>
                <td>{stock.medicineName}</td>
                <td>{stock.mrp}</td>
                <td>{stock.wholesaleName}</td>
                <td>{stock.stockCount}</td>
                <td>{new Date(stock.manufacturingDate).toLocaleDateString("en-GB")}</td>
                <td>{new Date(stock.expiryDate).toLocaleDateString("en-GB")}</td>
                <td>{stock.vendorName}</td>
                <td>{stock.vendorAddress}</td>
                <td>{stock.vendorPhoneNo}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10">No Stock Available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};