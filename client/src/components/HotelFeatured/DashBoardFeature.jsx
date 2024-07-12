import React, { useState } from 'react';
import '../../styles/DashBoardFeature.css';

const renderStars = (rating) => {
  const totalStars = 5;
  const filledStars = Math.floor(rating);
  const emptyStars = totalStars - filledStars;

  return (
    <div className="star-rating">
      {Array(filledStars).fill('★').map((star, index) => (
        <span key={`filled-${index}`} className="filled-star">{star}</span>
      ))}
      {Array(emptyStars).fill('☆').map((star, index) => (
        <span key={`empty-${index}`} className="empty-star">{star}</span>
      ))}
    </div>
  );
};

const DashBoardFeature = ({ onFilterChange, allTypes, allFacilities }) => {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);

  const handleTypeChange = (e) => {
    const { value, checked } = e.target;
    const updatedTypes = checked
      ? [...selectedTypes, value]
      : selectedTypes.filter(type => type !== value);

    setSelectedTypes(updatedTypes);
    onFilterChange({ types: updatedTypes, facilities: selectedFacilities, ratings: selectedRatings });
  };

  const handleFacilitiesChange = (e) => {
    const { value, checked } = e.target;
    const updatedFacilities = checked
      ? [...selectedFacilities, value]
      : selectedFacilities.filter(facility => facility !== value);

    setSelectedFacilities(updatedFacilities);
    onFilterChange({ types: selectedTypes, facilities: updatedFacilities, ratings: selectedRatings });
  };

  const handleRatingChange = (e) => {
    const { value, checked } = e.target;
    const newRating = parseInt(value, 10);
    const updatedRatings = checked
      ? [...selectedRatings, newRating]
      : selectedRatings.filter(rating => rating !== newRating);

    setSelectedRatings(updatedRatings);
    onFilterChange({ types: selectedTypes, facilities: selectedFacilities, ratings: updatedRatings });
  };

  if (!allTypes || !allFacilities) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-feature">
      <fieldset>
        <legend>Types:</legend>
        {allTypes.map((type, index) => (
          <label key={index}>
            <input
              type="checkbox"
              name="type"
              value={type}
              checked={selectedTypes.includes(type)}
              onChange={handleTypeChange}
            />
            {type}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Facilities:</legend>
        {allFacilities.map((facility, index) => (
          <label key={index}>
            <input
              type="checkbox"
              name="facility"
              value={facility}
              checked={selectedFacilities.includes(facility)}
              onChange={handleFacilitiesChange}
            />
            {facility}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Rating:</legend>
        {[5,4,3,2,1,0].map((star) => (
          <label key={star} className='lable-rating'>
            <input
              type="checkbox"
              name="rating"
              value={star}
              checked={selectedRatings.includes(star)}
              onChange={handleRatingChange}
            />
            {renderStars(star)}
          </label>
        ))}
      </fieldset>
    </div>
  );
};

export default DashBoardFeature;