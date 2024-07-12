import React from "react";


const BookingSummary = ({ hotel }) => {
  return (
    <div id="booking-summary" className="booking-summary">
      <h3>Booking Summary</h3>
      <div className="summary-details">
        <p>Hotel: {hotel.name}</p>
        <p>City: {hotel.city}</p>
        <p>Rating: {hotel.rating}</p>
        <p>Price per night: ${hotel.cheapestPrice}</p>
      </div>
    </div>
  );
};

export default BookingSummary;