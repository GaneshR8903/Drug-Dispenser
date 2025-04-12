import React, { useState } from 'react';
import { StockAvailabilty } from './StockAvailabilty';
import { StockExpire } from './StockExpire';
import "../css/Pharmacy.css";

export const StockMonitor = () => {
  const [activeTab, setActiveTab] = useState("availability");

  return (
    <div className="mainMonitor">
      <div className="topMonitor">
        <button 
          className={activeTab === "availability" ? "active" : ""} 
          onClick={() => setActiveTab("availability")}
        >
          Availability
        </button>
        
        <button 
          className={activeTab === "expire" ? "active" : ""} 
          onClick={() => setActiveTab("expire")}
        >
          Expire Status
        </button>
      </div>

      <div className="downMonitor">
        {activeTab === "availability" && <StockAvailabilty />}
        {activeTab === "expire" && <StockExpire />}
      </div>
    </div>
  );
};
