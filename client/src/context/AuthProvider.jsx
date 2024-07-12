import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const initialState = {
  user: null,
  loading: true,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'login-start':
      return { ...state, loading: true, error: null };
    case 'login-success':
      return { ...state, user: action.payload, loading: false, error: null };
    case 'login-fail':
      return { ...state, user: null, loading: false, error: action.payload };
    case 'logout':
      return { ...state, user: null, loading: false, error: null };
    case 'auth-check-start':
      return { ...state, loading: true, error: null };
    case 'auth-check-success':
      return { ...state, user: action.payload, loading: false, error: null };
    case 'auth-check-fail':
      return { ...state, user: null, loading: false, error: action.payload };
    case 'set-error':
      return { ...state, error: action.payload };
    case 'update-start':
      return { ...state, loading: true, error: null };
    case 'update-success':
      return { ...state, user: action.payload, loading: false, error: null };
    case 'update-fail':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();
  console.log(state.user)
  const clearError = () => {
    dispatch({ type: 'set-error', payload: null });
  };

  useEffect(() => {
    const checkAuth = async () => {
      dispatch({ type: 'auth-check-start' });
      try {
        const res = await axios.get('http://localhost:8800/api/auth/check', { withCredentials: true });
        if (res.data.user) {
          const userDataRes = await axios.get(`http://localhost:8800/api/users/${res.data.user.id}`, { withCredentials: true });
          dispatch({ type: 'auth-check-success', payload: userDataRes.data });
        } else {
          dispatch({ type: 'auth-check-success', payload: null });
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Handle unauthorized error
          dispatch({ type: 'auth-check-fail', payload: 'Unauthorized' });
        } else {
          dispatch({ type: 'auth-check-fail', payload: error.message || 'Authentication check failed' });
        }
      }
    };
    checkAuth();
  }, []);
  const handleLogin = async (username, password, url) => {
    dispatch({ type: 'login-start' });
    try {
      const res = await axios.post('http://localhost:8800/api/auth/login', { username, password }, { withCredentials: true });
      const userDetails = res.data.details;
      const isAdmin = res.data.isAdmin;
      dispatch({ type: 'login-success', payload: { ...userDetails, isAdmin } });
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error("Error logging in:", error);
      if (error.response && error.response.data && error.response.data.message) {
        dispatch({ type: 'login-fail', payload: error.response.data.message });
      } else {
        dispatch({ type: 'login-fail', payload: error.message || 'Login failed' });
      }
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8800/api/auth/logout', {}, { withCredentials: true });
      dispatch({ type: 'logout' });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleUpdate = async (userData) => {
    dispatch({ type: 'update-start' });
    try {
      const res = await axios.put(`http://localhost:8800/api/users/${state.user._id}`, userData, { withCredentials: true });
      dispatch({ type: 'update-success', payload: res.data });
    } catch (error) {
      console.error("Error updating user:", error);
      if (error.response && error.response.data && error.response.data.message) {
        dispatch({ type: 'update-fail', payload: error.response.data.message });
      } else {
        dispatch({ type: 'update-fail', payload: error.message || 'Update failed' });
      }
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, handleLogin, handleLogout, handleUpdate, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
