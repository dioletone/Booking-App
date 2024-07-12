import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/CartButton.css';
import { useBookings } from '../../context/BookingContext';
import '../../styles/CartButton.css'
const CartButton = () => {
  const { bookings, refetchBookings } = useBookings();
  const navigate = useNavigate();

  useEffect(() => {
    refetchBookings();
  }, [refetchBookings]);

  let numberBookings = bookings ? bookings.length : 0;

  return (
    <div className="cart-btn" onClick={() => navigate('/profile/bookings')}>
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-cart" viewBox="0 0 16 16">
        <path d="M0 1.5A.5.5 0 0 1 .5 1h1a.5.5 0 0 1 .485.379L2.89 6H14.5a.5.5 0 0 1 .491.592l-1.5 7A.5.5 0 0 1 13 14H4a.5.5 0 0 1-.491-.408L1.01 2H.5a.5.5 0 0 1-.5-.5zm3.01 5.5l1.25 5.5H13l1.25-5.5H3.01zM5 12a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm1 0a1 1 0 1 0 2 0 1 1 0 0 0-2 0zm4-1a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm1 2a1 1 0 1 0-2 0 1 1 0 0 0 2 0z"/>
      </svg>
      <span>{numberBookings}</span>
    </div>
  );
};

export default CartButton;