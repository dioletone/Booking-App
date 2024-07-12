import React from 'react';
import '../../styles/InforNav.css'; 
import { useAuth } from '../../context/AuthProvider';
import Thumbnail from '../thumbnail/thumnail';


const InforNav = ({ formType, userInfo, onClick }) => {
  const handleClick = () => {
    onClick();
  };

  return (
    <div className="info-nav">
      {formType === 'name' && (
        <div className="info-card">
          <div className='thumbnail'>
            <img src={userInfo.img} width="100px" height="100px" alt="User Thumbnail" />
          </div>
          <div className="info-details">
            <div className="info-item">
              <span className="info-label">First Name:</span> {userInfo.fname}
            </div>
            <div className="info-item">
              <span className="info-label">Last Name:</span> {userInfo.lname}
            </div>
            <div className="info-item">
              <span className="info-label">City:</span> {userInfo.city}
            </div>
            <div className="info-item">
              <span className="info-label">Country:</span> {userInfo.country}
            </div>
          </div>
          <div className='update'>
            <span className="update-label" onClick={handleClick}>Update</span>
          </div>
        </div>
      )}

      {formType === 'phone' && (
        <div className="info-card">
         
          <div className="info-details">
            <div className="info-item">
              <span className="info-label">Phone:</span> {userInfo.phone}
            </div>
          </div>
          <div className='update'>
            <span className="update-label" onClick={handleClick}>Update</span>
          </div>
        </div>
      )}

      {formType === 'email' && (
        <div className="info-card">
          
          <div className="info-details">
            <div className="info-item">
              <span className="info-label">Email:</span> {userInfo.email}
            </div>
          </div>
          <div className='update'>
            <span className="update-label" onClick={handleClick}>Update</span>
          </div>
        </div>
      )}

      {formType === 'password' && (
        <div className="info-card">
         
          <div className="info-details">
            <div className="info-item">
              <span className="info-label">Password:</span> ******** {/* Replace with actual user password */}
            </div>
          </div>
          <div className='update'>
            <span className="update-label" onClick={handleClick}>Update</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default InforNav;

