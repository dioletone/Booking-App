import React, { useState } from "react";
import Sidebar from "./components/SideBar/SideBar";
import HotelTable from "./components/Table/HotelTable";
import BookingTable from "./components/Table/BookingTable";
import UserDataTable from "./components/Table/UserDataTable";
import RoomTable from "./components/Table/RoomTable";
import "./styles/AdminPage.css"
export default function AdminRoomPage() {
  const [type, onSelecte] = useState('');

  const renderContent = () => {
    switch (type) {
      case 'user':
        return <UserDataTable />;
      case 'hotel':
        return <HotelTable onSelecte={onSelecte}/>;
      case 'booking':
        return <BookingTable />;
      case 'room': 
      return <RoomTable />
      default:
        return  <RoomTable />;
    }
  };


  return (
    <div className="admin-app">
      <Sidebar onSelecte={onSelecte} />
      <div className="content">
       
       { renderContent()}
      </div>
     
    </div>
  );
}