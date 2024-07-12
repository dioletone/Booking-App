import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import '../../styles/Register.css'; // Adjust the import path for your CSS file
import { io } from "socket.io-client";

const socket = io('http://localhost:8800');

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const { dispatch } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (confirmPassword !== password) {
      setError("Password and Confirm Password do not match");
      return;
    }

    setLoading(true); // Set loading state to true

    try {
      const response = await axios.post("http://localhost:8800/api/auth/register", {
        username,
        email,
        password,
      }, { withCredentials: true });

      socket.emit('newUser', response.data); // Emit the newUser event

      navigate("/login"); // Redirect user to login page after successful registration
    } catch (error) {
      console.error("Error registering user:", error); // Log the error for debugging

      if (error.response && error.response.data && error.response.data.errors) {
        const errorMessages = error.response.data.errors.map((err) => err.msg).join(", ");
        setError(errorMessages); // Set specific error message from server response
      } else {
        setError("Failed to register user"); // Set a generic error message
      }
    } finally {
      setLoading(false); // Always set loading state to false after completion (success or error)
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading}>Register</button>
        {loading && <div className="loading-message">Loading...</div>}
      </form>
    </div>
  );
};

export default Register;