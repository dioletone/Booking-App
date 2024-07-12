import React from "react";
import Dashboard from "../components/dashboard/Dashboard";
import '../styles/ProFilePage.css'
import BookingProfile from "../components/BookingProfile/BookingProfile";
const ProfileBookingsPage = () =>{
 return <div className="profile-page">
    <Dashboard />
    <BookingProfile />
 </div>
}
export default ProfileBookingsPage;