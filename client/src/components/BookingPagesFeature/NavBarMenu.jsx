import React from 'react';


const NavbarMenu = ({ scrollToSection }) => {
    return (
      <ul className="NavBar__menuGroup">
        <li className="NavBar__menu">
          <button onClick={() => scrollToSection('header-bookingpage')} type="button" className="NavBar__menulink">
            Tổng quan
          </button>
        </li>
        <li className="NavBar__menu">
          <button onClick={() => scrollToSection('roomselection-bookingpage')} type="button" className="NavBar__menulink">
            Phòng nghỉ
          </button>
        </li>
        <li className="NavBar__menu">
          <button onClick={() => scrollToSection('comments-bookingpage')} type="button" className="NavBar__menulink">
            Bình luận
          </button>
        </li>
        {/* Add other menu items */}
      </ul>
    );
  };
  export default NavbarMenu;