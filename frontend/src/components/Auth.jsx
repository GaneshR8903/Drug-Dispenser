import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Auth = () => {
  const apiBaseUrl = "http://localhost:5000/api/auth";
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handles input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handles login/signup submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const endpoint = isLogin ? "login" : "signup";
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : { username: formData.username, email: formData.email, password: formData.password, role: "user" };

      const response = await axios.post(`${apiBaseUrl}/${endpoint}`, payload);

      if (isLogin) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard", { replace: true }); // ✅ Redirect instantly
        window.location.reload(); // ✅ Ensures state updates properly
      } else {
        alert("Signup successful! Redirecting to login...");
        setIsLogin(true);
        navigate("/login", { replace: true }); // ✅ Redirect instantly to login
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main">
      <div className="center">
        <div className="auth-container">
          <h2 className="auth-title">{isLogin ? "Login" : "Signup"}</h2>
          {error && <p className="auth-error">{error}</p>}

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="input-box">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="auth-input"
                />
              </div>
            )}

            <div className="input-box">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="auth-input"
              />
            </div>

            <div className="input-box">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="auth-input"
              />
            </div>

            {!isLogin && (
              <div className="input-box">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="auth-input"
                />
              </div>
            )}

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? (isLogin ? "Logging in..." : "Signing up...") : isLogin ? "Login" : "Signup"}
            </button>
          </form>

          <p className="auth-text">
            {isLogin ? "New User?" : "Already have an account?"}{" "}
            <button type="button" className="auth-toggle" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Signup" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
