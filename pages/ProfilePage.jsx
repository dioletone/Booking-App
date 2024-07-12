import React,{useState} from "react";
import Dashboard from "../components/dashboard/Dashboard";
import '/Users/phanmanhha/Desktop/Booking App/client/src/styles/ProFilePage.css'; // Adjusted to a relative path
import Updateform from "../components/profileupdate/Updateform";
const ProfilePage = () => {
   
  
    return (
        <div className="profile-page">
          <Dashboard  />
          <Updateform />
        </div>
      );
    };
    
export default ProfilePage;
