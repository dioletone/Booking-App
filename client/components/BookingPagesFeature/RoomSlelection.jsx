import React, { useState, useEffect, useRef } from "react";
import BookingForm from "./BookingForm";
import Login from "../login/Login";
import { useAuth } from "../../context/AuthProvider";

const RoomSelection = ({ rooms, hotelID, setShowLogin, showLogin, isOpen, setIsOpen }) => {
  const { user } = useAuth(); // Get the user from AuthContext
  const [cart, setCart] = useState([]); // State to manage items in the cart
  const loginRef = useRef(); // Ref for login content
  const [roomBooked, setRoomBooked] = useState(null); // State to manage the selected room

  const addToCart = (room) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    setCart([...cart, room]); // Add the selected room to the cart array
    setIsOpen(false); // Close the booking modal after adding to cart
  };

  const handleBookClick = (room) => {
    if (!user) {
      setShowLogin(true);
      // Show the login form if the user is not authenticated
      return;
    }
    setRoomBooked(room); // Set the room to be booked
    setIsOpen(true); // Open the booking modal
  };

  // Handle click outside the login content
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (loginRef.current && !loginRef.current.contains(event.target)) {
        setShowLogin(false);
      }
    };

    if (showLogin) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLogin, setShowLogin]);

  return (
    <div className="room-selection" >
      <h3>Select a Room</h3>
      {rooms && rooms.map((room) => (
        <div key={room.roomId} className="room-card">
          <h4>{room.title}</h4>
          <p>{room.desc}</p>
          <div className="price">Price: ${room.price}</div>
          <div className="available">Available Rooms: {room.availableRooms}</div>

          {/* Conditionally render buttons based on room availability */}
          {room.availableRooms > 0 && (
            <div>
              <button onClick={() => handleBookClick(room)}>Book</button>
              <button onClick={() => addToCart(room)}>Add to Cart</button>
            </div>
          )}
        </div>
      ))}
      {rooms && rooms.some(room => room.capacityCheck === false) && (
        <div key="no-room-available" className="room-card">
          <h4>Rất tiếc, chúng tôi không còn phòng tại khách sạn này trong sự lựa chọn của bạn.</h4>
        </div>
      )}

      {isOpen && roomBooked && <BookingForm key={roomBooked._id} room={roomBooked} onClose={() => setIsOpen(false)} />}
      {!user && showLogin && (
        <div key="login-bookingpage" className="login-bookingpage">
          <Login url={`/hotel/${hotelID}`} ref={loginRef} onClose={() => setShowLogin(false)} />
        </div>
      )}
    </div>
  );
};

export default RoomSelection;