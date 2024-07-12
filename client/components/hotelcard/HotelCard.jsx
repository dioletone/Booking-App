import React, { useState } from 'react';
import '../../styles/HotelCard.css'; // Use relative import
import PaginationDots from '../pagination/Pagination';

// Helper function to render star rating
const renderStars = (rating) => {
  const totalStars = 5;
  const filledStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = totalStars - filledStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="star-rating">
      {Array(filledStars).fill('★').map((star, index) => (
        <span key={`filled-${index}`} className="filled-star">{star}</span>
      ))}
      {hasHalfStar && <span className="half-star">☆</span>} {/* Assuming you use a different class for half star */}
      {Array(emptyStars).fill('☆').map((star, index) => (
        <span key={`empty-${index}`} className="empty-star">{star}</span>
      ))}
    </div>
  );
};

const HotelCard = ({ hotel }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [fadeState, setFadeState] = useState("fade-in");

  function handlePreviousPhoto() {
    setFadeState("fade-out");
    setTimeout(() => {
      setCurrentPhotoIndex(prevIndex =>
        prevIndex === 0 ? hotel.photos.length - 1 : prevIndex - 1
      );
      setFadeState("fade-in");
    }, 500); // Match the transition duration
  }

  function handleNextPhoto() {
    setFadeState("fade-out");
    setTimeout(() => {
      setCurrentPhotoIndex(prevIndex =>
        (prevIndex + 1) % hotel.photos.length
      );
      setFadeState("fade-in");
    }, 500); // Match the transition duration
  }

  return (
    <div className="hotel-card">
      <div className="hotel-image">
        <img
          src={hotel.photos[currentPhotoIndex]}
          alt={hotel.name}
          className={`hotel-photo ${fadeState}`}
        />
        <div className="photo-navigation">
          <PaginationDots
            total={hotel.photos.length}
            current={currentPhotoIndex}
            onChange={setCurrentPhotoIndex}
            onPrevious={handlePreviousPhoto}
            onNext={handleNextPhoto}
          />
        </div>
      </div>
      <div className="hotel-details">
        <h3>{hotel.title}</h3>
        <div>
          <strong>Hotel Type:</strong> {hotel.type || 'N/A'} {/* Provide a fallback */}
        </div>
        <div>
          <strong>Location:</strong> {hotel.city}
        </div>
        <div>{hotel.desc}</div>
        <div>
          <strong>Rating:</strong> {renderStars(hotel.rating)}
        </div>
        <div>
          <strong>Cheapest Price:</strong> ${hotel.cheapestPrice} per night
        </div>
        <div>
          <strong>Distance to City Center:</strong> {hotel.distance ? `${hotel.distance} km` : 'N/A'}
        </div>
      </div>
    </div>
  );
};



export default HotelCard;