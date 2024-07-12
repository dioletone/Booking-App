import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, TextField } from "@mui/material";
import axios from "axios";

export default function RoomCard({ room, onClose }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [bookingFormData, setBookingFormData] = useState({
    username: '',
    checkInDate: '',
    checkOutDate: '',
    guests: {
      adults: 1,
      children: 0,
      room: 1,
    },
    totalPrice: room.price,
  });
  const [formError, setFormError] = useState('');

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`http://localhost:8800/api/bookings/room/${room._id}`, { withCredentials: true });
      setBookings(response.data);
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (room) {
      fetchBookings();
    }
  }, [room]);

  const handleDeleteBooking = async (booking) => {
    try {
      await axios.delete(`http://localhost:8800/api/bookings/${booking._id}`, { withCredentials: true });
      setBookings(bookings.filter(b => b._id !== booking._id));
      fetchBookings();
    } catch (error) {
      console.error("Delete fail", error.message);
    }
  };

  const handleOpenBookingDialog = () => {
    setBookingDialogOpen(true);
  };

  const handleCloseBookingDialog = () => {
    setBookingDialogOpen(false);
    setBookingFormData({
      username: '',
      checkInDate: '',
      checkOutDate: '',
      guests: {
        adults: 1,
        children: 0,
        room
      },
      totalPrice: room.price,
    });
    setFormError('');
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("guests.")) {
      const guestField = name.split(".")[1];
      setBookingFormData({
        ...bookingFormData,
        guests: {
          ...bookingFormData.guests,
          [guestField]: value,
        },
      });
    } else {
      setBookingFormData({
        ...bookingFormData,
        [name]: value,
      });
    }
  };

  const handleBookingSubmit = async () => {
    if (!bookingFormData.username || !bookingFormData.checkInDate || !bookingFormData.checkOutDate || !bookingFormData.totalPrice) {
      setFormError('Please fill in all fields.');
      return;
    }

    try {
      const userResponse = await axios.get(`http://localhost:8800/api/users/name/${bookingFormData.username}`);
      if (!userResponse.data) {
        setFormError('Invalid username.');
        return;
      }

      const userId = userResponse.data._id;

      await axios.post(
        "http://localhost:8800/api/bookings",
        {
          userId,
          hotelId: bookings[0]?.hotel._id,
          roomId: room._id,
          checkInDate: bookingFormData.checkInDate,
          checkOutDate: bookingFormData.checkOutDate,
          guests: bookingFormData.guests,
          totalPrice: bookingFormData.totalPrice,
        },
        { withCredentials: true }
      );

      handleCloseBookingDialog();
      fetchBookings();
    } catch (error) {
      console.error("Error creating booking", error.message);
      setFormError('Error creating booking. Please try again.');
    }
  };

  return (
    <Dialog open={Boolean(room)} onClose={onClose}>
      <DialogTitle>Room Details</DialogTitle>
      <DialogContent>
        <p>Room Type: {room?.title}</p>
        <p>Room Number: {room?.number}</p>
        <p>Price: {room?.price}</p>
        <p>Description: {room?.desc}</p>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <div key={booking._id}>
                  <p>User: {booking.user.username}</p>
                  <Button onClick={() => handleDeleteBooking(booking)} color="warning">
                    Delete Booking
                  </Button>
                  <p>Room: {booking.roomNumber}</p>
                  <p>Check-in Date: {booking.checkInDate}</p>
                  <p>Check-out Date: {booking.checkOutDate}</p>
                  <p>Total Price: {booking.totalPrice}</p>
                </div>
              ))
            ) : (
              <p>No bookings found</p>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOpenBookingDialog} color="primary">
          Create Booking
        </Button>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>

      <Dialog open={bookingDialogOpen} onClose={handleCloseBookingDialog}>
        <DialogTitle>Create Booking</DialogTitle>
        <DialogContent>
          {formError && <p style={{ color: 'red' }}>{formError}</p>}
          <TextField
            margin="dense"
            label="Username"
            name="username"
            value={bookingFormData.username}
            onChange={handleBookingChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Check-in Date"
            name="checkInDate"
            type="date"
            value={bookingFormData.checkInDate}
            onChange={handleBookingChange}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            label="Check-out Date"
            name="checkOutDate"
            type="date"
            value={bookingFormData.checkOutDate}
            onChange={handleBookingChange}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            label="Adults"
            name="guests.adults"
            type="number"
            value={bookingFormData.guests.adults}
            onChange={handleBookingChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Children"
            name="guests.children"
            type="number"
            value={bookingFormData.guests.children}
            onChange={handleBookingChange}
            fullWidth
          />
          <TextField
          disabled
            margin="dense"
            label="Total Price"
            name="totalPrice"
            type="number"
            value={bookingFormData.totalPrice}
            onChange={handleBookingChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBookingDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleBookingSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}