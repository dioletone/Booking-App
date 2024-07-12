import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import '../../styles/Dashboard.css'; // Adjust the import path as necessary
import Thumbnail from '../thumbnail/thumnail';
import UpdateImg from '../updateImg/UpdateImg'; // Import UpdateImg component
import VerifySwitch from './VerifySwitch';

const Dashboard = () => {
  const { user, handleLogout } = useAuth(); // Assuming useAuth provides user and logout function
  const [isOpenForm, setIsOpenForm] = useState(false);

  const handleLogoutClick = async () => {
    await handleLogout(); // Call the logout function from useAuth
    window.location.href = '/login'; // Redirect to the login page after logout
  };

  const handleOpenForm = () => {
    setIsOpenForm(true);
  };

  const handleCloseForm = () => {
    setIsOpenForm(false);
  };

  return (
    <div className="dashboard-container">
      <div className="header-dashboard">
       
        <div className="thumbnail-wrapper" onClick={handleOpenForm}>
          <Thumbnail style={{ height: '80px', width: '80px' }} />
          <span className="edit-icon">
            
            <svg width="18" height="18" viewBox="0 0 24 24" focusable="false" className="edit-svg">
              <path d="M20.41 4.94l-1.35-1.35c-.78-.78-2.05-.78-2.83 0L3 16.82V21h4.18L20.41 7.77c.79-.78.79-2.05 0-2.83zm-14 14.12L5 19v-1.36l9.82-9.82 1.41 1.41-9.82 9.83z"></path>
            </svg>
          </span>
          
        </div>
       <VerifySwitch />
        <div className="profile-details">
          <h3 className="name">{user.fname + ' ' + user.lname}</h3>
          <div className="email">{user.email}</div> {/* Replace with actual user data */}
        </div>
      </div>
      <div className="menu-items">
        <MenuItem
          iconUrl="https://d1785e74lyxkqq.cloudfront.net/_next/static/v2/8/825f4dbdd091e72c803ff3a24ca58c26.svg"
          label="Thông tin của tôi"
          link="/profile"
        />
        <MenuItem
          iconUrl="https://d1785e74lyxkqq.cloudfront.net/_next/static/v2/f/f883d30731f5559aadffe0c6060fdded.svg"
          label="Thẻ của tôi"
          link="/profile/card"
        />
        <MenuItem
          iconUrl="https://d1785e74lyxkqq.cloudfront.net/_next/static/v2/8/8c9954122d8006592fbcbd4a82ac994c.svg"
          label="Đặt chỗ của tôi"
          link="/profile/bookings"
        />
        <MenuItem
          iconUrl="https://d1785e74lyxkqq.cloudfront.net/_next/static/v2/f/fc823715dd8dd7b269a5526f8651d058.svg"
          label="Danh sách giao dịch"
          link="/vi-vn/user/purchase/list"
        />
        <MenuItem
          iconUrl="https://d1785e74lyxkqq.cloudfront.net/_next/static/v2/2/2d3631eea81b504e3ca2e46131a4de33.svg"
          label="Refunds"
          link="/vi-vn/payment/refund/list"
        />
        <MenuItem
          iconUrl="https://d1785e74lyxkqq.cloudfront.net/_next/static/v2/e/e018f881345b8043e52ad61597ff9831.svg"
          label="Thông báo giá vé máy bay"
          link="/vi-vn/flight/priceAlert?entrySource=TRAVELOKA_HOMEPAGE_USER_MENU"
        />
        <MenuItem
          iconUrl="https://d1785e74lyxkqq.cloudfront.net/_next/static/v2/3/306886d7684a4b93b41b2726dabb61c7.svg"
          label="Thông tin hành khách đã lưu"
          link="/vi-vn/user/travelerspicker"
        />
        <MenuItem
          iconUrl="https://d1785e74lyxkqq.cloudfront.net/_next/static/v2/8/8c163aea0d70a7f11c9b2963b3fd0534.svg"
          label="Khuyến mãi"
          link="/vi-vn/user/account?menu=newsletter"
        />
      </div>
      <div className="logout">
        <MenuItem
          iconUrl="https://d1785e74lyxkqq.cloudfront.net/_next/static/v2/3/336593031502efcd0f97e6b35e7703a1.svg"
          label="Logout"
          onClick={handleLogoutClick} // Pass handleLogoutClick as onClick handler
        />
      </div>
      {/* Display UpdateImg component when isOpenForm is true */}
      {isOpenForm && <UpdateImg onClose={handleCloseForm} />}
    </div>
  );
};

const MenuItem = ({ iconUrl, label, link, onClick }) => {
  return (
    <div className="menu-item">
      <Link to={link} className="link">
        <div className="menu-item-content" onClick={onClick}>
          <img src={iconUrl} className="icon" alt="icon" />
          <div className="label">{label}</div>
        </div>
      </Link>
    </div>
  );
};

export default Dashboard;
