import axios from "axios";
import React, { useEffect, useState } from "react";
import HotelCard from "../hotelcard/HotelCard"; // Assuming HotelCard component is imported
import '../../styles/HotelSuggestList.css';

const HotelSuggestList = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [randomHotels, setRandomHotels] = useState([]);

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:8800/api/hotels'); // Adjusted API URL with protocol
        setLoading(false);
        setHotels(res.data);
      } catch (error) {
        setError(error.message || 'Failed to fetch hotel list');
        setLoading(false);
      }
    };

    fetchHotels(); // Invoke fetchHotels function inside useEffect
  }, []); // Empty dependency array to run effect only once

  useEffect(() => {
    // Function to randomly select 3 hotels from the fetched hotels
    const selectRandomHotels = () => {
      if (hotels.length > 0) {
        const randomIndexes = [];
        while (randomIndexes.length < 3) {
          const randomIndex = Math.floor(Math.random() * hotels.length);
          if (!randomIndexes.includes(randomIndex)) {
            randomIndexes.push(randomIndex);
          }
        }
        const selectedHotels = randomIndexes.map(index => hotels[index]);
        setRandomHotels(selectedHotels);
      }
    };

    selectRandomHotels(); // Call the function to select random hotels
  }, [hotels]); // Watch for changes in hotels array

  return (<>
    <h1 className="hotellist-title">Hotel Suggestions</h1>

    <div className="hotels-list">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : randomHotels.length === 0 ? (
        <p>No hotels found.</p>
      ) : (
        randomHotels.map(hotel => (
          <HotelCard key={hotel._id} hotel={hotel} />
        ))
      )}
    </div>
    </  >
  );
};

export default HotelSuggestList;