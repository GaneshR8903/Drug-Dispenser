import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedPharmacyMenu, setSelectedEnquiry } from "../redux/pharmacyMenuSlice";
import "../css/MedicineDispense.css";

export const MedicineDispense = () => {
  const dispatch = useDispatch();
  const [enquiries, setEnquiries] = useState([]);
  const apiBaseUrl = useSelector((state) => state.global.backendUrl);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const { data } = await axios.get(`${apiBaseUrl}/api/doctor-enquiries`);
        const enrichedData = await Promise.all(
          data.map(async (enquiry, index) => {
            const patientRes = await axios.get(`${apiBaseUrl}/api/patients/${enquiry.patientID}`);
            
            // Convert date to IST
            const enquiryDate = new Date(enquiry.date);
            const indianTime = enquiryDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", hour12: true });
            const [datePart, timePart] = indianTime.split(", ");
            const formattedDate = datePart.split("/").reverse().join("/");

            return {
              sno: index + 1,
              patientID: enquiry.patientID,
              name: patientRes.data.name,
              age: patientRes.data.age,
              date: formattedDate,
              time: timePart,
              medicines: enquiry.medicines.join(", "),
            };
          })
        );
        setEnquiries(enrichedData);
      } catch (error) {
        console.error("Error fetching enquiries:", error);
      }
    };
    fetchEnquiries();
  }, []);

  // Function to handle button click and store selected row in Redux
  const handleDispenseClick = (enquiry) => {
    dispatch(setSelectedEnquiry(enquiry)); // Store row data
    dispatch(setSelectedPharmacyMenu("Dispense Update")); // Change menu
  };

  return (
    <div className="mainMedicine">
      <h2>Recent Doctor Enquiries</h2>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Patient ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Date</th>
            <th>Time (IST)</th>
            <th>Medicines</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {enquiries.length > 0 ? (
            enquiries.map((item) => (
              <tr key={item.sno}>
                <td>{item.sno}</td>
                <td>{item.patientID}</td>
                <td>{item.name}</td>
                <td>{item.age}</td>
                <td>{new Date(item.date).toLocaleDateString("en-GB")}</td>
                <td>{item.time}</td>
                <td>{item.medicines || "No Medicines"}</td>
                <td>
                  <button onClick={() => handleDispenseClick(item)}>Dispense</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No recent enquiries found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
