import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import Thumbnail from '../thumbnail/thumnail';
import UpdateImg from '../updateImg/UpdateImg';
import '../../styles/AccountButton.css';
import ColorPicker from '../colorpicker/ColorPicker';

const AccountButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [isOpenColor, setOpenColor] = useState(false);
  const { handleLogout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogoutClick = async () => {
    await handleLogout();
    navigate('/login');
  };

  const handleOpenForm = () => {
    setIsOpenForm(true);
    setIsOpen(false); // Close the dropdown when the form opens
  };

  const handleOpenColor = () => {
    setOpenColor(true);
    setIsOpen(false); // Close the dropdown when the form opens
  };

  const handleCloseForm = () => {
    setIsOpenForm(false);
  };

  const handleCloseColor = () => {
    setOpenColor(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <div className="account-button" ref={dropdownRef}>
      <Thumbnail onClick={handleToggleDropdown} />

      {isOpen && !isOpenColor && (
        <div className="dropdown-menu">
          {user ? (
            <ul className="menu-options">
              <div className="thumbnail-wrapper">
                <Thumbnail style={{ height: '40px', width: '40px' }} />
                <span className="edit-icon" onClick={handleOpenForm}>
                  <svg width="18" height="18" viewBox="0 0 24 24" focusable="false" className="edit-svg">
                    <path d="M20.41 4.94l-1.35-1.35c-.78-.78-2.05-.78-2.83 0L3 16.82V21h4.18L20.41 7.77c.79-.78.79-2.05 0-2.83zm-14 14.12L5 19v-1.36l9.82-9.82 1.41 1.41-9.82 9.83z"></path>
                  </svg>
                </span>
              </div>
              <li>
                <Link to="/profile">View Profile</Link>
              </li>
              <li>
                <Link to="/settings">Settings</Link>
              </li>
              <li>
                <Link to="/" onClick={handleLogoutClick}>
                  Logout
                </Link>
              </li>
              <li>
                <div onClick={handleOpenColor}>Theme</div>
              </li>
              {user.isAdmin && (
                <li>
                  <Link to="/admin">Admin Page</Link>
                </li>
              )}
            </ul>
          ) : (
            <ul className="menu-options">
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </ul>
          )}
        </div>
      )}
      {isOpenForm && <UpdateImg onClose={handleCloseForm} />}
      {isOpenColor && <ColorPicker onClose={handleCloseColor} />}
    </div>
  );
};

export default AccountButton;