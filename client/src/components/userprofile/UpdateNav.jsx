import React, { useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import '../../styles/UpdateNav.css';

const UpdateNav = ({ formType, onClose }) => {
  const { handleUpdate } = useAuth();
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('@gmail.com');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  function handleClose(){
    onClose();
  }
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const newErrors = [];

    if (formType === 'name') {
      if (!fname) newErrors.push('Vui lòng nhập tên của bạn.');
      if (!lname) newErrors.push('Vui lòng nhập họ của bạn.');
    } else if (formType === 'phone') {
      if (!phone) {
        newErrors.push('Vui lòng nhập số điện thoại của bạn.');
      } else if (!/^\d+$/.test(phone) || phone.length < 9) {
        newErrors.push('Số điện thoại không hợp lệ.');
      }
    } else if (formType === 'email') {
      if (!email) newErrors.push('Vui lòng nhập email của bạn.');
      else if (!isValidEmail(email)) newErrors.push('Định dạng email không hợp lệ.');
    } else if (formType === 'password') {
      if (!password) newErrors.push('Vui lòng nhập mật khẩu mới của bạn.');
      if (password !== confirmPassword) newErrors.push('Mật khẩu xác nhận không khớp.');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setSuccessMessage(''); // Clear success message if there were errors
    } else {
      try {
        const userData = {};
        if (formType === 'name') {
          userData.fname = fname;
          userData.lname = lname;
        } else if (formType === 'phone') {
          userData.phone = phone;
        } else if (formType === 'email') {
          userData.email = email;
        } else if (formType === 'password') {
          userData.password = password;
        }

        await handleUpdate(userData);
        console.log('Update successful:', userData);
        setErrors([]);
        setSuccessMessage('Update successful.'); // Set success message
      } catch (error) {
        console.error('Error updating user:', error);
        setErrors(['Update failed. Please try again later.']);
        setSuccessMessage(''); // Clear success message on failure
      }
    }
  };


  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (!e.target.value.includes('@')) {
      // Auto-fill @gmail.com if '@' is not already included
      setEmail(e.target.value + '@gmail.com');
    }
  };

  const isValidEmail = (email) => {
    // Simple email validation for @gmail.com domain
    return /\S+@\S+\.\S+/.test(email) && email.endsWith('@gmail.com');
  };
  return (
    <div id="mmb-name-component-change" data-selenium="mmb-name-component-change" style={{ opacity: 1, display: 'block' }}>
      {errors.length > 0 && (
        <div id="mmb-name-component-change-alert" className="alert alert-danger mmb-alert-component" role="alert">
          Đã xảy ra lỗi :
          <i aria-label="Close" id="mmb-name-component-change-alert-close-button" className="close ficon ficon-control-close-circle" onClick={() => setErrors([])}></i>
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
          <button type="button" className="close" onClick={() => setSuccessMessage('')}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        {formType === 'name' && (
          <>
            <h2 data-selenium="mmb-name-component-change-firstname-label">First Name</h2>
            <input
              id="mmb-name-component-change-firstname"
              type="text"
              className="form-control"
              value={fname}
              placeholder="First Name"
              data-selenium="mmb-name-component-change-firstname-field"
              maxLength="64"
              onChange={(e) => setFname(e.target.value)}
            />

            <h2 data-selenium="mmb-name-component-change-lastname-label">Last Name</h2>
            <input
              id="mmb-name-component-change-lastname"
              type="text"
              className="form-control"
              value={lname}
              placeholder="Last Name"
              data-selenium="mmb-name-component-change-lastname-field"
              maxLength="64"
              onChange={(e) => setLname(e.target.value)}
            />
          </>
        )}
        {formType === 'phone' && (
          <>
            <h2 data-selenium="mmb-name-component-change-phone-label">Phone</h2>
            <input
              id="mmb-name-component-change-phone"
              type="tel"
              className="form-control"
              value={phone}
              placeholder="Phone"
              data-selenium="mmb-name-component-change-phone-field"
              maxLength="64"
              onChange={(e) => setPhone(e.target.value)}
            />
          </>
        )}
        {formType === 'email' && (
          <>
            <h2 data-selenium="mmb-name-component-change-email-label">Email</h2>
            <input
              id="mmb-name-component-change-email"
              type="email"
              className="form-control"
              value={email}
              placeholder="Email"
              data-selenium="mmb-name-component-change-email-field"
              maxLength="64"
              onChange={handleEmailChange}
            />
          </>
        )}
        {formType === 'password' && (
          <>
            <h2 data-selenium="mmb-name-component-change-password-label">New Password</h2>
            <input
              id="mmb-name-component-change-password"
              type="password"
              className="form-control"
              value={password}
              placeholder="New Password"
              data-selenium="mmb-name-component-change-password-field"
              maxLength="64"
              onChange={(e) => setPassword(e.target.value)}
            />

            <h2 data-selenium="mmb-name-component-change-confirm-password-label">Confirm Password</h2>
            <input
              id="mmb-name-component-change-confirm-password"
              type="password"
              className="form-control"
              value={confirmPassword}
              placeholder="Confirm Password"
              data-selenium="mmb-name-component-change-confirm-password-field"
              maxLength="64"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </>
        )}
        <div className="mmb-component-buttons">
          <input
            id="mmb-name-component-change-cancel"
            type="button"
            className="btn btn-blueline"
            value="Hủy"
            data-selenium="mmb-name-component-change-cancel-button"
            onClick={() => handleClose()}
          />

          <button
            id="mmb-name-component-change-save"
            type="submit"
            className="btn btn-primary"
            data-selenium="mmb-name-component-change-save-button"
          >
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateNav;
