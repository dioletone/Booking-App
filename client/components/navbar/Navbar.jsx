import React, {useState} from "react";
import Logo from "../Logo/Logo";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import AccountButton from "../accountbutton/AccountButton";
import '../../styles/Navbar.css';
import CartButton from "../cartbutton/CartButton";

function Navbar() {
  const { user } = useAuth();


  return (
    <div className="nav-bar">
     
      <div className="logo">
        <Link to="/">
          <Logo />
        </Link>
      </div>
      
      <div className="nav-items">
        {user && <CartButton />}
      
      <ul>
     
        <AccountButton />
      </ul>
      </div>
    </div>
  );
}

export default Navbar;
