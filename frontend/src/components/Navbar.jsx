import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setActiveMenu } from "../redux/menuSlice";
import { logoutUser } from "../redux/authSlice"; 
import MediIcon from "../images/medicine.png";
import "../css/Navbar.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const activeMenu = useSelector((state) => state.menu.activeMenu);

    const handleLogout = async () => {
      const token = localStorage.getItem("token");
    
      if (!token) {
        console.warn("No auth token found. Redirecting to login...");
        navigate("/login");
        return;
      }
    
      try {
        const response = await fetch("http://localhost:5000/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
    
        if (response.ok) {
          localStorage.removeItem("token"); // Remove token
          navigate("/login", { replace: true }); // ✅ Redirect without needing refresh
          window.location.reload(); // ✅ Ensures the state resets properly
        } else {
          console.error("Logout request failed:", response.statusText);
        }
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };
    
  

  return (
    <div className="navbar">
      <div className="imgBox">
        <img src={MediIcon} alt="Medi Track Logo" />
        <p>Drug Dispenser</p>
      </div>
      <ul className="menu">
        {["Pharmacy", "Home", "Doctor"].map((item) => (
          <li
            key={item}
            className={activeMenu === item ? "active" : ""}
            onClick={() => dispatch(setActiveMenu(item))}
          >
            {item}
          </li>
        ))}
        <li className="logout-button" onClick={handleLogout}>
          Logout
        </li>
      </ul>
    </div>
  );
};

export default Navbar;