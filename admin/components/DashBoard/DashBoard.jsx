import React from 'react';
import HotelTable from './HotelTable';
import BookingTable from './BookingTable';
import Chart from './Chart';
import Featured from './Featured';
import UserDataTable from '../Table/UserDataTable';
//import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </div>
      <div className="dashboard-content">
        <Featured />
        <Chart />
        <div className="tables">
          <HotelTable />
          <BookingTable />
          <UserDataTable/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;