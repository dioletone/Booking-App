import React, { useContext, useReducer, createContext, useEffect } from "react";

// Initial state for the theme
const initialState = {
  theme: 'default',
  colors: {
    backgroundColor: '#ffffff',
    textColor: '#000000',
  },
  loading: false,
  error: null,
};

// Reducer function to manage state changes
const reducer = (state, action) => {
  switch (action.type) {
    case 'theme-success':
      return {
        ...state, theme: action.payload, loading: false, error: null
      };
    case 'color-success':
      return {
        ...state, colors: action.payload, loading: false, error: null
      };
    case 'theme-fail':
    case 'color-fail':
      return {
        ...state, loading: false, error: action.payload
      };
      case 'reset-theme':
      return {
        ...state,
        theme: initialState.theme,
        colors: initialState.colors,
      };
    default:
      return state;
  }
};

// Create the context
const ThemeContext = createContext();

// ThemeProvider component to provide the context to its children
export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load theme and colors from localStorage on initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedColors = localStorage.getItem('colors');
    
    if (savedTheme) {
      dispatch({ type: 'theme-success', payload: savedTheme });
    }
    
    if (savedColors) {
      dispatch({ type: 'color-success', payload: JSON.parse(savedColors) });
    }
  }, []);

  const setTheme = (theme) => {
    try {
      dispatch({ type: 'theme-success', payload: theme });
      localStorage.setItem('theme', theme); // Save to localStorage
    } catch (error) {
      dispatch({ type: 'theme-fail', payload: error.message });
    }
  };
  const resetTheme = () => {
    try {
      dispatch({ type: 'reset-theme' });
      localStorage.removeItem('theme'); // Remove from localStorage
      localStorage.removeItem('colors'); // Remove from localStorage
    } catch (error) {
      dispatch({ type: 'theme-fail', payload: error.message });
    }
  };
  const setColor = (colors) => {
    try {
      dispatch({ type: 'color-success', payload: colors });
      localStorage.setItem('colors', JSON.stringify(colors)); // Save to localStorage
    } catch (error) {
      dispatch({ type: 'color-fail', payload: error.message });
    }
  };

  return (
    <ThemeContext.Provider value={{ ...state, setTheme, setColor, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the ThemeContext
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};