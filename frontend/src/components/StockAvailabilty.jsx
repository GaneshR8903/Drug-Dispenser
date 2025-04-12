import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "../css/Pharmacy.css"; // Adjust the path as necessary

export const StockAvailabilty = () => {
  const [stockData, setStockData] = useState([]);
  const apiBaseUrl = useSelector((state) => state.global.backendUrl);

  // Fetch stock availability
  useEffect(() => {
    const fetchStockAvailability = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/stock/stockAvailability`);
        setStockData(response.data);
      } catch (error) {
        console.error("Error fetching stock availability:", error.response?.data || error.message);
      }
    };

    fetchStockAvailability();
  }, [apiBaseUrl]); // Ensure dependency is included

  return (
    <div className="stockAvail">
      <h2>Stock Availability</h2>
      <div className="stockBoxMain">
        {stockData.length > 0 ? (
          stockData.map((item, index) => (
            <div key={index} className="stockInnerBox">
              <p>{item.stockCount}</p>
              <label>{item.medicineName}</label>
            </div>
          ))
        ) : (
          <p>No Stock</p>
        )}
      </div>
    </div>
  );
};
