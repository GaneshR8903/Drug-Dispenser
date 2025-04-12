import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedPharmacyMenu } from "../redux/pharmacyMenuSlice";
import "../css/Pharmacy.css";
import { MedicineDispense } from "./MedicineDispense";
import { StockMonitor } from "./StockMonitor";
import { AddStock } from "./AddStock";
import { DispenseUpdate } from "./DispenseUpdate";

export const Pharmacy = () => {
  const dispatch = useDispatch();
  const selectedPharmacyMenu = useSelector(
    (state) => state.pharmacyMenu.selectedPharmacyMenu
  );

  const menuItems = [
    "Medicine Dispense",
    "Stock Monitor",
    "Add Stock",
    "Dispense Update"
  ];

  return (
    <div className="pharmacy-container">
      <div className="pharmacy-sidebar">
        <ul>
          {menuItems.map((menu) => (
            <li
              key={menu}
              className={selectedPharmacyMenu === menu ? "active" : ""}
              onClick={() => dispatch(setSelectedPharmacyMenu(menu))}
            >
              {menu}
            </li>
          ))}
        </ul>
      </div>

      <div className="pharmacy-content">
        {selectedPharmacyMenu === "Medicine Dispense" && <MedicineDispense />}
        {selectedPharmacyMenu === "Stock Monitor" && <StockMonitor />}
        {selectedPharmacyMenu === "Add Stock" && <AddStock />}
        {selectedPharmacyMenu === "Dispense Update" && <DispenseUpdate />}
      </div>
    </div>
  );
};
