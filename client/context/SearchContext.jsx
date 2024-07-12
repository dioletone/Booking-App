import React, { createContext, useReducer, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const INITIAL_STATE = {
  city: undefined,
  hotel: undefined,
  dates: [],
  options: {
    adult: undefined,
    children: undefined,
    room: undefined,
  },
};

export const SearchContext = createContext(INITIAL_STATE);

const SearchReducer = (state, action) => {
  switch (action.type) {
    case "NEW_SEARCH":
      return action.payload;
    case "RESET_SEARCH":
      return INITIAL_STATE;
    default:
      return state;
  }
};

export const SearchContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(SearchReducer, INITIAL_STATE);
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);

  const handleSearch = async (city, dates, options, hotel = null  ) => {
    const newCity = hotel ? hotel.city : city;
    const datesUTC = dates.map(date => {
      const startDate = new Date(date.startDate);
      const endDate = new Date(date.endDate);
      return {
        ...date,
        startDate: new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0)).toISOString(),
        endDate: new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 0, 0, 0)).toISOString()
      };
    });

    const newState = { city: newCity, hotel, dates: datesUTC, options };
    dispatch({ type: "NEW_SEARCH", payload: newState });
    localStorage.setItem("searchState", JSON.stringify(newState));

    const url = constructURL(newCity, datesUTC, options);
    navigate(url);

    await fetchRooms(newCity, datesUTC, options);
  };

  const constructURL = (city, dates, options) => {
    let url = `/city/${encodeURIComponent(city)}`;
    if (dates) {
      url += `/dates/${encodeURIComponent(JSON.stringify(dates))}`;
    }
    if (options) {
      url += `/options/${encodeURIComponent(JSON.stringify(options))}`;
    }
    return url;
  };

  const fetchRooms = async (city, dates, options) => {
    const startDate = dates[0]?.startDate;
    const endDate = dates[0]?.endDate;
    const endpoint = `http://localhost:8800/api/rooms/${city}/${startDate}/${endDate}/${options.adult}/${options.children}/${options.room}`;
    try {
      const response = await axios.get(endpoint, { withCredentials: true });
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem("searchState"));
    if (savedState) {
      dispatch({ type: "NEW_SEARCH", payload: savedState });
      fetchRooms(savedState.city, savedState.dates, savedState.options);
    }
  }, []);// Empty dependency array to run only once on mount

  const resetSearch = () => {
    dispatch({ type: "RESET_SEARCH" });
    localStorage.removeItem("searchState");
  };

  return (
    <SearchContext.Provider
      value={{
        ...state,
        dispatch,
        handleSearch,
        resetSearch,
        rooms,
        setRooms
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context)
    throw new Error("useSearch must be used within a SearchContextProvider");
  return context;
};