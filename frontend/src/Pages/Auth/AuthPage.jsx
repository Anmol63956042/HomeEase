import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AuthPage.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [serverStatus, setServerStatus] = useState("checking");

  // Check backend server status on mount
  useEffect(() => {
    checkServerStatus();
  }, []);

  const checkServerStatus = async () => {
    try {
      setServerStatus("checking");
      await axios.get(`${API_BASE_URL}/health-check`, { timeout: 5000 });
      setServerStatus("online");
    } catch (err) {
      console.error("Backend server appears offline:", err);
      setServerStatus("offline");
    }
  };

  const handleRequestOtp = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await axios.post(`${API_BASE_URL}/auth/request-otp`, { email }, { timeout: 10000 });
      if (response.data.success) {
        alert("OTP sent to your email.");
        setOtpRequested(true);
      } else {
        setError(response.data.message || "Failed to send OTP");
        alert(response.data.message);
      }
    } catch (err) {
      console.error("Error requesting OTP:", err);
      setError(err.code === "ERR_NETWORK" 
        ? "Cannot connect to server. Please check backend." 
        : err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !otp) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, { email, password, otp }, { timeout: 10000 });
      if (response.data.success) {
        localStorage.setItem("userEmail", email);
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          alert("Account created successfully! Redirecting to homepage...");
          window.location.href = "/";
        } else {
          alert("Account created successfully! Please log in.");
          setOtp(""); setPassword(""); setOtpRequested(false); setIsSignUp(false);
        }
      } else {
        setError(response.data.message || "Signup failed");
        alert(response.data.message);
      }
    } catch (err) {
      console.error("Error signing up:", err);
      setError(err.code === "ERR_NETWORK"
        ? "Cannot connect to server. Please check backend."
        : err.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password }, { timeout: 10000 });
      if (response.data.success) {
        localStorage.setItem("userEmail", email);
        localStorage.setItem("token", response.data.token);
        alert("Logged in successfully!");
        window.location.href = "/";
      } else {
        setError(response.data.message || "Login failed");
        alert(response.data.message || "Wrong username or password.");
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setError(err.code === "ERR_NETWORK"
        ? "Cannot connect to server. Please check backend."
        : err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!otpRequested) {
      await handleRequestOtp();
    } else {
      if (!otp || !newPassword) {
        setError("Please enter OTP and new password");
        return;
      }

      try {
        setLoading(true);
        setError("");
        const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, { email, otp, newPassword }, { timeout: 10000 });
        if (response.data.success) {
          alert("Password reset successfully!");
          setForgotPassword(false); setOtpRequested(false); setIsSignUp(false);
        } else {
          setError(response.data.message || "Failed to reset password");
          alert(response.data.message);
        }
      } catch (err) {
        console.error("Error resetting password:", err);
        setError(err.code === "ERR_NETWORK"
          ? "Cannot connect to server. Please check backend."
          : err.response?.data?.message || "Failed to reset password.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="auth-page">
      <h2>{forgotPassword ? "Forgot Password" : isSignUp ? "Sign Up" : "Log In"}</h2>

      {serverStatus === "offline" && (
        <div className="server-status-error">
          <p>Backend server appears offline. Please start it or try again later.</p>
          <button onClick={checkServerStatus} className="retry-button">Retry Connection</button>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={loading || serverStatus === "offline"}
      />

      {forgotPassword ? (
        <>
          {otpRequested && (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                disabled={loading || serverStatus === "offline"}
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={loading || serverStatus === "offline"}
              />
            </>
          )}
          <button onClick={handleForgotPassword} disabled={loading || serverStatus === "offline"}>
            {loading ? "Processing..." : otpRequested ? "Reset Password" : "Request OTP"}
          </button>
        </>
      ) : isSignUp ? (
        <>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading || serverStatus === "offline"}
          />
          {otpRequested && (
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              disabled={loading || serverStatus === "offline"}
            />
          )}
          <button
            onClick={otpRequested ? handleSignUp : handleRequestOtp}
            disabled={loading || serverStatus === "offline"}
          >
            {loading ? "Processing..." : otpRequested ? "Sign Up" : "Request OTP"}
          </button>
        </>
      ) : (
        <>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading || serverStatus === "offline"}
          />
          <button onClick={handleLogin} disabled={loading || serverStatus === "offline"}>
            {loading ? "Processing..." : "Log In"}
          </button>
          <p onClick={() => setForgotPassword(true)} className="forgot-password">Forgot Password?</p>
        </>
      )}

      {!forgotPassword && (
        <p
          onClick={() => { setIsSignUp(!isSignUp); setOtpRequested(false); setError(""); }}
          className="toggle-auth-mode"
        >
          {isSignUp ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
        </p>
      )}

      {forgotPassword && (
        <p
          onClick={() => { setForgotPassword(false); setOtpRequested(false); setError(""); }}
          className="back-to-login"
        >
          Back to {isSignUp ? "Sign Up" : "Login"}
        </p>
      )}
    </div>
  );
};

export default AuthPage;
