import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Avatar } from '@mui/material';
import axios from 'axios';
import '../../styles/UserCard.css';

const UserCard = ({ user, onClose }) => {
  const [bookings, setBookings] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchDetails = async () => {
    try {
      const bookingsResponse = await axios.get(`http://localhost:8800/api/bookings/user/${user._id}`, { withCredentials: true });
      const commentsResponse = await axios.get(`http://localhost:8800/api/comments/user/${user._id}`, { withCredentials: true });

      setBookings(bookingsResponse.data);
      setComments(commentsResponse.data);
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
   

    if (user) {
      fetchDetails();
    }
  }, [user]);
  const handleDeleteBooking = async (bookingId) => {
    try {
      await axios.delete(`http://localhost:8800/api/bookings/${bookingId}`, { withCredentials: true });
      setBookings(bookings.filter(b => b._id !== bookingId));
    } catch (error) {
      console.error("Delete fail", error.message);
    }
  };
  return (
    <Dialog open={Boolean(user)} onClose={onClose} fullWidth={true}>
      <DialogTitle className="dialogTitle">User Details</DialogTitle>
      <DialogContent className="dialogContent">
        <div className="userDetails">
            <Avatar alt={user.username} src={user.img} />
          <p>Username: {user.username}</p>
          <p>Full Name: {user.fullname}</p>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>
          <p>Status: {user.status}</p>
        </div>

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <>
            <div className="bookings">
              <h3>Bookings:</h3>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <div key={booking._id} className="bookingDetails">
                    <p>Hotel: {booking.hotel.name}</p>
                    <p>Room: {booking.room.title} (Room Number: {booking.roomNumber})</p>
                    <p>Check-in Date: {new Date(booking.checkInDate).toLocaleDateString()}</p>
                    <p>Check-out Date: {new Date(booking.checkOutDate).toLocaleDateString()}</p>
                    <p>Total Price: {booking.totalPrice}</p>
                    <Button onClick={() => handleDeleteBooking(booking._id)} color="secondary">Delete Booking</Button>

                  </div>
                ))
              ) : (
                <p>No bookings found</p>
              )}
            </div>

            <div className="comments">
              <h3>Comments:</h3>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment._id} className="commentDetails">
                    <p>Comment: {comment.text}</p>
                    <p>Posted on: {new Date(comment.createdAt).toLocaleDateString()}</p>
                  </div>
                ))
              ) : (
                <p>No comments found</p>
              )}
            </div>
          </>
        )}
      </DialogContent>
      <DialogActions className="dialogActions">
        <Button onClick={onClose} color="primary" className="button">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserCard;