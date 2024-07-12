import React,{useState} from "react";
import Dashboard from "../components/dashboard/Dashboard";
import '../styles/ProFilePage.css' // Adjusted to a relative path
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
