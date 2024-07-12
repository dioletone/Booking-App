import React, { useState } from "react";
import Sidebar from "./components/SideBar/SideBar";
import HotelTable from "./components/Table/HotelTable";
import BookingTable from "./components/Table/BookingTable";
import UserDataTable from "./components/Table/UserDataTable";
import "./styles/AdminPage.css"
export default function AdminPage() {
  const [type, onSelecte] = useState('user');

  const renderContent = () => {
    switch (type) {
      case 'user':
        return <UserDataTable />;
      case 'hotel':
        return <HotelTable />;
      case 'booking':
        return <BookingTable />;
      default:
        return <UserDataTable />;
    }
  };

  return (
    <div className="admin-app">
      <Sidebar onSelecte={onSelecte} />
      <div className="content">
        {renderContent()}
      </div>
     
    </div>
  );
}