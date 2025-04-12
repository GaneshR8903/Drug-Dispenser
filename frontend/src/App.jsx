import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import { FindPatient } from "./components/FindPatient";
import { NewPatient } from "./components/NewPatient";
import { Doctor } from "./components/Doctor";
import { Pharmacy } from "./components/Pharmacy";
import Auth from "./components/auth"; // Unified Login & Signup Component

function App() {
  const activeMenu = useSelector((state) => state.menu.activeMenu);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <div className="main">
      {isAuthenticated ? (
        <>
          <Navbar />
          <div className="center">
            {activeMenu === "Home" && (
              <div className="homeBox">
                <FindPatient />
                <NewPatient />
              </div>
            )}
            {activeMenu === "Doctor" && <Doctor />}
            {activeMenu === "Pharmacy" && <Pharmacy />}
          </div>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<Auth />} />  {/* Default to login/signup */}
          <Route path="*" element={<Navigate to="/" />} /> {/* Redirect unknown routes */}
        </Routes>
      )}
    </div>
  );
}

export default App;
