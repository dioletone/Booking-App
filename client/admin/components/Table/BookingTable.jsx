import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookingTable = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const res = await axios.get('http://localhost:8800/api/bookings');
      setBookings(res.data);
    };
    fetchBookings();
  }, []);

  return (
    <div className="booking-table">
      <h2>Bookings</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Hotel</th>
            <th>Room</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(booking => (
            <tr key={booking._id}>
              <td>{booking._id}</td>
              <td>{booking.user}</td>
              <td>{booking.hotel}</td>
              <td>{booking.room}</td>
              <td>{booking.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;