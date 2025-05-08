import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Auth = () => {
  const apiBaseUrl = "http://localhost:5000/api/auth";
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isForgotPassword) {
        if (!otpSent) {
          // Step 1: Send OTP
          await axios.post(`${apiBaseUrl}/forgot-password`, {
            email: formData.email,
          });
          setOtpSent(true);
          alert("OTP sent to your email.");
        } else {
          // Step 2: Verify OTP and reset password
          if (formData.newPassword !== formData.confirmNewPassword) {
            setError("New passwords do not match!");
            setLoading(false);
            return;
          }

          await axios.post(`${apiBaseUrl}/reset-password`, {
            email: formData.email,
            otp: formData.otp,
            password: formData.newPassword, // ✅ Matches backend's expected field
          });
          

          alert("Password successfully reset. Please login.");
          setIsForgotPassword(false);
          setOtpSent(false);
          setFormData({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            otp: "",
            newPassword: "",
            confirmNewPassword: "",
          });
        }
      } else {
        // Login or Signup
        if (!isLogin && formData.password !== formData.confirmPassword) {
          setError("Passwords do not match!");
          setLoading(false);
          return;
        }

        const endpoint = isLogin ? "login" : "signup";
        const payload = isLogin
          ? { email: formData.email, password: formData.password }
          : {
              username: formData.username,
              email: formData.email,
              password: formData.password,
              role: "user",
            };

        const response = await axios.post(`${apiBaseUrl}/${endpoint}`, payload);

        if (isLogin) {
          localStorage.setItem("token", response.data.token);
          navigate("/dashboard", { replace: true });
          window.location.reload();
        } else {
          alert("Signup successful! Redirecting to login...");
          setIsLogin(true);
          navigate("/login", { replace: true });
        }
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
          <h2 className="auth-title">
            {isForgotPassword ? "Reset Password" : isLogin ? "Login" : "Signup"}
          </h2>
          {error && <p className="auth-error">{error}</p>}

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && !isForgotPassword && (
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

            {!isForgotPassword && (
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
            )}

            {!isLogin && !isForgotPassword && (
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

            {isForgotPassword && otpSent && (
              <>
                <div className="input-box">
                  <label>OTP</label>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    required
                    className="auth-input"
                  />
                </div>
                <div className="input-box">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    className="auth-input"
                  />
                </div>
                <div className="input-box">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    value={formData.confirmNewPassword}
                    onChange={handleChange}
                    required
                    className="auth-input"
                  />
                </div>
              </>
            )}

            <button type="submit" className="auth-button" disabled={loading}>
              {loading
                ? isForgotPassword
                  ? otpSent
                    ? "Resetting..."
                    : "Sending OTP..."
                  : isLogin
                  ? "Logging in..."
                  : "Signing up..."
                : isForgotPassword
                ? otpSent
                  ? "Reset Password"
                  : "Send OTP"
                : isLogin
                ? "Login"
                : "Signup"}
            </button>
          </form>

          {!isForgotPassword && isLogin && (
            <p className="auth-text">
              <button
                type="button"
                className="auth-toggle"
                onClick={() => {
                  setIsForgotPassword(true);
                  setError("");
                }}
              >
                Forgot Password?
              </button>
            </p>
          )}

          <p className="auth-text">
            {isForgotPassword ? "Back to" : isLogin ? "New User?" : "Already have an account?"}{" "}
            <button
              type="button"
              className="auth-toggle"
              onClick={() => {
                if (isForgotPassword) {
                  setIsForgotPassword(false);
                  setOtpSent(false);
                } else {
                  setIsLogin(!isLogin);
                }
                setError("");
              }}
            >
              {isForgotPassword ? "Login" : isLogin ? "Signup" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;