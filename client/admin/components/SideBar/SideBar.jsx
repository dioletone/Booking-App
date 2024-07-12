import "../../styles/sidebar.css"
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LuggageIcon from '@mui/icons-material/Luggage';
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StoreIcon from "@mui/icons-material/Store";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsSystemDaydreamOutlinedIcon from "@mui/icons-material/SettingsSystemDaydreamOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthProvider";

const Sidebar = ({ onSelecte }) => {
  const {handleLogout} = useAuth();
  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/admin" style={{ textDecoration: "none" }}>
          <span className="logo">HaPhan admin</span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <li onClick={() => onSelecte('dashboard')}>
            <DashboardIcon className="icon" />
            <span>Dashboard</span>
          </li>
          <p className="title">LISTS</p>
          <li onClick={() => onSelecte('user')}>
            <PersonOutlineIcon className="icon" />
            <span>Users</span>
          </li>
          <li onClick={() => onSelecte('hotel')}>
            <StoreIcon className="icon" />
            <span>Hotels</span>
          </li>
          <li onClick={() => onSelecte('booking')}>
            <LuggageIcon className="icon" />
            <span>Bookings</span>
          </li>
          <p className="title">USEFUL</p>
          <li onClick={() => onSelecte('stats')}>
            <InsertChartIcon className="icon" />
            <span>Stats</span>
          </li>
          <li onClick={() => onSelecte('notifications')}>
            <NotificationsNoneIcon className="icon" />
            <span>Notifications</span>
          </li>
          <p className="title">SERVICE</p>
          <li onClick={() => onSelecte('systemHealth')}>
            <SettingsSystemDaydreamOutlinedIcon className="icon" />
            <span>System Health</span>
          </li>
          <li onClick={() => onSelecte('logs')}>
            <PsychologyOutlinedIcon className="icon" />
            <span>Logs</span>
          </li>
          <li onClick={() => onSelecte('settings')}>
            <SettingsApplicationsIcon className="icon" />
            <span>Settings</span>
          </li>
          <p className="title">USER</p>
          <li><Link to='/profile' style={{textDecoration:'none'}}>
            <AccountCircleOutlinedIcon className="icon" />
            <span>Profile</span>
          </Link></li>
          <li onClick={() => handleLogout()}>
            <ExitToAppIcon className="icon" />
            <span>Logout</span>
          </li>
        </ul>
      </div>
      <div className="bottom">
        
      </div>
    </div>
  );
};

export default Sidebar;