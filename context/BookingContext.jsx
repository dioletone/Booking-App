// BookingContext.js
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { useAuth } from './AuthProvider';
import useFetch from '../hooks/useFetch';
const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const { user } = useAuth();
  
  const { data: bookings, loading: bookingLoading, error: bookingError, reFetch } = useFetch(
    user ? `http://localhost:8800/api/bookings/user/${user._id}` : null
  );

  const [isChange, setChange] = useState(false);

  const refetchBookings = useCallback(() => {
    setChange(true);
  }, []);

  useEffect(() => {
    if (isChange) {
      reFetch();
      setChange(false); // Reset the change state after refetching
    }
  }, [isChange, reFetch]);

  const value = useMemo(() => ({
    bookings,
    bookingLoading,
    bookingError,
    refetchBookings
  }), [bookings, bookingLoading, bookingError, refetchBookings]);

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  return useContext(BookingContext);
};