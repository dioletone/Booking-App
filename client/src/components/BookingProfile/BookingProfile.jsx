import React, { useEffect } from "react";
import axios from "axios";
import { useBookings } from "../../context/BookingContext";
import io from 'socket.io-client';
import '../../styles/BookingProfile.css';

const socket = io('http://localhost:8800');

const BookingProfile = () => {
  const {
    bookings,
    bookingLoading: loading,
    refetchBookings,
  } = useBookings();

  useEffect(() => {
    socket.on('newBooking', (newBooking) => {
      console.log('New booking received:', newBooking);
      refetchBookings();
    });

    socket.on('deleteBooking', (deletedBookingId) => {
      console.log('Booking deleted:', deletedBookingId);
      refetchBookings();
    });

    return () => {
      socket.off('newBooking');
      socket.off('deleteBooking');
    };
  }, [refetchBookings]);

  const handleDelete = async (bookingId) => {
    try {
      await axios.delete(`http://localhost:8800/api/bookings/${bookingId}`);
      console.log("Delete Successful");
      refetchBookings(); // Re-fetch the bookings after a successful deletion
      // Emit the deleted booking ID to the server
      socket.emit('deleteBooking', bookingId);
    } catch (err) {
      console.error("Error deleting booking:", err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bookings-container">
      <h2>Booking List:</h2>
      {bookings && bookings.length > 0 ? (
        bookings.map((booking) => (
          <div key={booking._id} className="booking-item">
            <div>
              <h4>{booking.hotel.name}</h4>
              <p>Check-in: {new Date(booking.checkInDate).toLocaleDateString()}</p>
              <p>Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}</p>
              <p>Guests: {booking.guests.adults} adults, {booking.guests.children} children</p>
              <p>Total Price: ${booking.totalPrice}</p>
            </div>
            <button className="delete-btn" onClick={() => handleDelete(booking._id)}>X</button>
          </div>
        ))
      ) : (
        <div className="booking-item"><h4>No bookings found.</h4></div>
      )}
    </div>
  );
};

export default BookingProfile;