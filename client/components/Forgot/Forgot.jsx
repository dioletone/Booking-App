import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/Forgot.css'; // Adjust the path to your CSS file
import { useNavigate } from 'react-router-dom';

const Forgot = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showOTPForm, setShowOTPForm] = useState(false); // Flag to toggle OTP form display
  const [showResetForm, setShowResetForm] = useState(false); // Flag to toggle reset password form display
  const navigate = useNavigate();

  const handleSubmitSendOTP = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8800/api/auth/forgot-password', { email });
      setMessage('Check your Spam or Trash folder if you cannot find the email.');
      setError('');
      setShowOTPForm(true); // Show OTP input form after successful email submission
    } catch (error) {
      setError(error.response.data.message || 'Failed to send reset email');
      setMessage('');
    }
  };

  const handleSubmitVerifyOTP = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8800/api/auth/verify-otp', { email, otp });
      setMessage('');
      setError('');
      setShowResetForm(true); // Show reset password form after successful OTP verification
    } catch (error) {
      setError(error.response.data.message || 'Invalid OTP');
      setMessage('');
    }
  };

  const handleSubmitResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8800/api/auth/reset-password', { email, newPassword });
      setMessage(response.data.message);
      setError('');
      navigate('/login');
    } catch (error) {
      setError(error.response.data.message || 'Failed to reset password');
      setMessage('');
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      {!showOTPForm && !showResetForm && (
        <form onSubmit={handleSubmitSendOTP}>
          <div className="form-group">
            <label htmlFor="email">Enter your email address:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
          <button type="submit" className="submit-btn">Send OTP</button>
        </form>
      )}

      {showOTPForm && !showResetForm && (
        <form onSubmit={handleSubmitVerifyOTP}>
          <div className="form-group">
            <label htmlFor="otp">Enter OTP:</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
          <button type="submit" className="submit-btn">Verify OTP</button>
        </form>
      )}

      {showResetForm && (
        <form onSubmit={handleSubmitResetPassword}>
          <div className="form-group">
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmNewPassword">Confirm New Password:</label>
            <input
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="submit-btn">Reset Password</button>
        </form>
      )}
    </div>
  );
};

export default Forgot;
