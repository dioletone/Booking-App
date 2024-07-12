import '../../styles/HotelFeature.css';
import React, { useState, useEffect, useCallback } from 'react';
import { useSearch } from '../../context/SearchContext';
import HeaderFeatured from './HeaderFeature';
import HotelFeatureCard from '../hotelcard/HotelFeatureCard';
import DashBoardFeature from './DashBoardFeature';
import { useOptions } from '../../context/OptionsContext';
import io from 'socket.io-client';
import useFetch from '../../hooks/useFetch';
const HotelFeature = () => {
  const { city, hotel: hotelSelected } = useSearch();
  const { sortOption, resetSortOption, filterOptions, resetFilterOptions, setSortOption, setFilterOptions } = useOptions();
  const [allTypes, setAllTypes] = useState([]);
  const [allFacilities, setAllFacilities] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInitialHotels = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8800/api/hotels');
      const initialHotels = await response.json();
      setHotels(initialHotels);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching initial hotels:', error);
      setLoading(false);
      setError(error);
    }
  }, []);

  useEffect(() => {
    fetchInitialHotels();

    const socket = io('http://localhost:8800');

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('hotelUpdates', (updatedHotels) => {
      setHotels((prevHotels) => {
        if (JSON.stringify(prevHotels) !== JSON.stringify(updatedHotels)) {
          return updatedHotels;
        }
        return prevHotels;
      });
      setLoading(false);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      socket.disconnect();
    };
  }, [fetchInitialHotels]);

  useEffect(() => {
    if (hotels.length) {
      const uniqueTypes = [...new Set(hotels.map(hotel => hotel.type))];
      const uniqueFacilities = [...new Set(hotels.flatMap(hotel => hotel.facilities))];
      setAllTypes(uniqueTypes);
      setAllFacilities(uniqueFacilities);
    }
  }, [hotels]);

  const handleSortChange = (option) => {
    resetSortOption();
    setSortOption(option);
  };

  const handleFilterChange = (filters) => {
    resetFilterOptions();
    setFilterOptions(filters);
  };

  const filterAndSortHotels = (hotels) => {
    if (!hotels) return [];

    const filteredHotels = hotels.filter(hotel => {
      const matchesType = filterOptions.types.length === 0 || filterOptions.types.includes(hotel.type);
      const matchesFacilities = filterOptions.facilities.length === 0 || filterOptions.facilities.every(facility => hotel.facilities.includes(facility));
      const matchesRating = filterOptions.ratings.length === 0 || filterOptions.ratings.every(rating => hotel.rating >= rating);
      return matchesType && matchesFacilities && matchesRating;
    });

    switch (sortOption) {
      case 'rating':
        return filteredHotels.sort((hotel1, hotel2) => hotel2.rating - hotel1.rating);
      case 'cheapest':
        return filteredHotels.sort((hotel1, hotel2) => hotel1.cheapestPrice - hotel2.cheapestPrice);
      case 'mostReviews':
        return filteredHotels.sort((hotel1, hotel2) => hotel2.reviewsCount - hotel1.reviewsCount);
      default:
        return filteredHotels;
    }
  };

  if (loading) return <div>Loading hotels...</div>;
  if (error) return <div>Error loading hotels: {error.message}</div>;

  const filteredHotels = hotels.filter(hotel => hotel.city === city);

  if (!city) {
    return <div>Please select a city to view hotels.</div>;
  }

  const sortedHotels = filterAndSortHotels(filteredHotels);

  return (
    <div className="hotel-feature">
      <HeaderFeatured onSortChange={handleSortChange} />
      <DashBoardFeature
        allTypes={allTypes}
        allFacilities={allFacilities}
        onFilterChange={handleFilterChange}
      />
      {sortedHotels.length === 0 ? (
        <div>No hotels found in {city}.</div>
      ) : (
        <div className="hotel-list">
          {hotelSelected && <HotelFeatureCard key={hotelSelected._id} hotel={hotelSelected} />}
          {sortedHotels.filter(hotel => hotel._id !== hotelSelected?._id).map(hotel => (
            <HotelFeatureCard
              key={hotel._id}
              hotel={hotel}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HotelFeature;