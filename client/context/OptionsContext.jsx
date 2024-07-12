import React, { createContext, useContext, useReducer, useEffect } from 'react';

const OptionsContext = createContext();

const initialState = {
  sortOption: '',
  filterOptions: { types: [], facilities: [], ratings: [] }, // Updated to include rating
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_SORT_OPTION':
      return { ...state, sortOption: action.payload };
    case 'RESET_SORT_OPTION':
      return { ...state, sortOption: initialState.sortOption };
    case 'SET_FILTER_OPTIONS':
      return { ...state, filterOptions: action.payload };
    case 'RESET_FILTER_OPTIONS':
      return { ...state, filterOptions: { types: [], facilities: [], ratings: [] } }; // Reset to include rating
    default:
      return state;
  }
};

export const OptionsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const storedOptions = localStorage.getItem('Options');
    if (storedOptions) {
      const parsedOptions = JSON.parse(storedOptions);
      dispatch({ type: 'SET_SORT_OPTION', payload: parsedOptions.sortOption });
      dispatch({ type: 'SET_FILTER_OPTIONS', payload: parsedOptions.filterOptions });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('Options', JSON.stringify({ sortOption: state.sortOption, filterOptions: state.filterOptions }));
  }, [state.sortOption, state.filterOptions]);

  const resetSortOption = () => {
    dispatch({ type: 'RESET_SORT_OPTION' });
  };

  const setSortOption = (option) => {
    dispatch({ type: 'SET_SORT_OPTION', payload: option });
  };

  const setFilterOptions = (options) => {
    dispatch({ type: 'SET_FILTER_OPTIONS', payload: options });
  };

  const resetFilterOptions = () => {
    dispatch({ type: 'RESET_FILTER_OPTIONS' });
  };

  return (
    <OptionsContext.Provider value={{ sortOption: state.sortOption, filterOptions: state.filterOptions, setSortOption, setFilterOptions, resetFilterOptions, resetSortOption }}>
      {children}
    </OptionsContext.Provider>
  );
};

export const useOptions = () => {
  const context = useContext(OptionsContext);
  if (!context) {
    throw new Error("useOptions must be used within an OptionsProvider");
  }
  return context;
};