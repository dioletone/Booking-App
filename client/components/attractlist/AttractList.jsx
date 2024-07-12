import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import useFetch from "../../hooks/useFetch";
import "../../styles/AttractiveList.css";
import axios from "axios";
import { useSearch } from "../../context/SearchContext";
import { addDays } from 'date-fns';

const AttractiveList = () => {
  const { data: hotelsData, loading, error } = useFetch("http://localhost:8800/api/hotels", { withCredentials: true });
  const [cities, setCities] = useState([]);
  const [hotelCounts, setHotelCounts] = useState({});
  const [imageUrls, setImageUrls] = useState({});
  const carouselRef = useRef(null);
  const navigate = useNavigate();
  const { handleSearch } = useSearch(); // Get handleSearch function from SearchContext
  // Initialize useNavigate

  const API_KEY = 'FBVLRIUdaOvwma7qu5ovQQZOPC4VqHw_j1f2EVAU8UE';

  useEffect(() => {
    if (!loading && !error && hotelsData) {
      const uniqueCities = [...new Set(hotelsData.map((hotel) => hotel.city))];
      setCities(uniqueCities);

      const counts = {};
      uniqueCities.forEach((city) => {
        counts[city] = hotelsData.filter((hotel) => hotel.city === city).length;
      });
      setHotelCounts(counts);
    }
  }, [hotelsData, loading, error]);

  const fetchImage = async (city) => {
    try {
      const response = await axios.get(`https://api.unsplash.com/search/photos?query=${city}&client_id=${API_KEY}`);
      return response.data.results[0].urls.regular;
    } catch (error) {
      console.error(`Error fetching image for ${city}:`, error);
      return ""; // Return a default image URL or handle the error as needed
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      const urls = {};
      for (const city of cities) {
        const imageUrl = await fetchImage(city);
        urls[city] = imageUrl;
      }
      setImageUrls(urls);
    };

    if (cities.length > 0) {
      fetchImages();
    }
  }, [cities]);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft -= carouselRef.current.offsetWidth / 2; // Scroll half the width
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft += carouselRef.current.offsetWidth / 2; // Scroll half the width
    }
  };

  const handleCityClick = (city) => {
    const today = new Date();
    const tomorrow = addDays(today, 1);

    const defaultDates = [
      {
        startDate: today,
        endDate: tomorrow,
        key: 'selection',
      },
    ];

    const defaultOptions = {
      adult: 1,
      children: 0,
      room: 1,
    };

    handleSearch(city, defaultDates, defaultOptions); // Update context state with selected city, dates, and options

    
  };

  return (
    <>
      <h2 className="attractivelist-title">Attractive Places</h2>
      <div className="attractive-list" ref={carouselRef}>
        {loading ? (
          <div className="loading">Loading please wait...</div>
        ) : (
          <>
            {cities.map((city, index) => (
              <div key={index} className="attractive-item" onClick={() => handleCityClick(city)}>
                <img
                  src={imageUrls[city] || "default_image_url_here"}
                  alt={`${city} image`}
                  className="attractive-img"
                />
                <div className="attractive-titles">
                  <h1>{city}</h1>
                  <h2>{hotelCounts[city]} properties</h2>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      {cities.length > 0 && (
        <div className="carousel-controls">
          <button onClick={scrollLeft}>{"<"}</button>
          <button onClick={scrollRight}>{">"}</button>
        </div>
      )}
    </>
  );
};

export default AttractiveList;