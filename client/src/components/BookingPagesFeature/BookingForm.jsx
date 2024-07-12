import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthProvider';
import { useSearch } from '../../context/SearchContext';
import useFetch from '../../hooks/useFetch';
import { useBookings } from '../../context/BookingContext';
import io from 'socket.io-client';

const socket = io('http://localhost:8800');

const BookingForm = ({ room, onClose }) => {
  const { user } = useAuth();
  const { dates, options } = useSearch();
  const [username, setUserName] = useState(user ? user.username : '');
  const [hotelId, setHotelId] = useState(room ? room.hotelId : '');
  const [roomId, setRoomId] = useState(room ? room.roomId : '');
  const [checkInDate, setCheckInDate] = useState(dates ? dates[0].startDate : '');
  const [checkOutDate, setCheckOutDate] = useState(dates ? dates[0].endDate : '');
  const [adults, setAdults] = useState(options ? options.adult : 1);
  const [children, setChildren] = useState(options ? options.children : 0);
  const [roomTotal, setRoomTotal] = useState(options ? options.room : 1);
  const [totalPrice, setTotalPrice] = useState(room ? room.price * roomTotal : '');
  const { data: hotel, loading: hotelLoading, error: hotelError } = useFetch(
    `http://localhost:8800/api/hotels/${hotelId}`
  );
  const { refetchBookings } = useBookings();

  useEffect(() => {
    socket.on('newBooking', (newBooking) => {
      console.log('New booking received:', newBooking);
      refetchBookings();
    });

    return () => {
      socket.off('newBooking');
    };
  }, [refetchBookings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const bookingData = {
      userId: user._id,
      hotelId,
      roomId,
      checkInDate,
      checkOutDate,
      guests: {
        adults: Number(adults),
        children: Number(children),
      },
      totalPrice: Number(totalPrice) / roomTotal,
    };

    try {
      for (let i = 0; i < roomTotal; i++) {
        const response = await axios.post('http://localhost:8800/api/bookings', bookingData);
        console.log('Booking created successfully:', response.data);
        // Emit the new booking to the server
        socket.emit('newBooking', response.data);
      }
      refetchBookings();
      onClose();
    } catch (error) {
      console.error('Error creating booking:', error.response ? error.response.data.message : error.message);
    }
  };

  const handleTotalPriceChange = (e) => {
    const newRoomTotal = Number(e.target.value);
    setRoomTotal(newRoomTotal);
    setTotalPrice(room.price * newRoomTotal);
  };

  return (
    <form className='form-container' onSubmit={handleSubmit}>
      <button className='close' onClick={() => onClose()}>X</button>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
      </div>
      <div>
        <h4>Hotel:</h4>
        {hotelLoading ? <p>Loading...</p> : hotelError ? <p>Error: {hotelError}</p> : <p>{hotel.name}</p>}
      </div>
      <div>
        <h4>Room:</h4>
        <p>{room.title}</p>
      </div>
      <div>
        <label>Check-in Date:</label>
        <input
          type="date"
          value={new Date(checkInDate).toISOString().split('T')[0]}
          onChange={(e) => setCheckInDate(new Date(e.target.value))}
          required
        />
      </div>
      <div>
        <label>Check-out Date:</label>
        <input
          type="date"
          value={new Date(checkOutDate).toISOString().split('T')[0]}
          onChange={(e) => setCheckOutDate(new Date(e.target.value))}
          required
        />
      </div>
      <div>
        <label>Number of Adults:</label>
        <input
          type="number"
          value={adults}
          max={room.maxPeople - children}
          onChange={(e) => setAdults(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Number of Children:</label>
        <input
          type="number"
          value={children}
          max={room.maxPeople - adults}
          onChange={(e) => setChildren(e.target.value)}
        />
      </div>
      <div>
        <label>Rooms:</label>
        <input
          type="number"
          value={roomTotal}
          min='1'
          max={room.availableRooms}
          onChange={handleTotalPriceChange}
          required
        />
      </div>
      <div>
        <label>Total Price:</label>
        <input
          disabled
          type="number"
          value={totalPrice}
          onChange={(e) => setTotalPrice(e.target.value)}
          required
        />
      </div>
      <button type="submit">Create Booking</button>
    </form>
  );
};

export default BookingForm;