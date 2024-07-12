import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { SearchContextProvider } from './context/SearchContext';
import { BookingProvider } from './context/BookingContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import ForgotPage from './pages/ForgotPage';
import CityPage from './pages/CityPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './context/ProtectedRoute';
import BookingPage from './pages/BookingPage';
import ProfileBookingsPage from './pages/ProfileBookingsPage';
import AdminRoute from './context/AdminRoute';
import AdminPage from './admin/AdminPage';
import ActivePage from './pages/ActivePage';
import AdminRoomPage from './admin/AdminRoomPage'
const ThemedApp = () => {
  const { theme, colors } = useTheme();

  useEffect(() => {
    document.documentElement.style.setProperty('--background-color', colors.backgroundColor);
    document.documentElement.style.setProperty('--text-color', colors.textColor);
  }, [colors]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPage />} />
        <Route path="/activate/:token" element={<ActivePage />} />

        <Route path="/city/:cityName/dates/:dates/options/:options" element={<CityPage />} />
        <Route path="/hotel/:hotelID" element={<BookingPage />} />
        <Route path="/profile" element={<ProtectedRoute element={ProfilePage} />} />
        <Route path="/profile/bookings" element={<ProtectedRoute element={ProfileBookingsPage} />} />
        <Route path="/admin" element={<AdminRoute element={AdminPage} />} />
        <Route path="/admin/hotel-rooms/:hotelId" element={<AdminRoute element={AdminRoomPage} />} />

      </Routes>
      <Footer />
    </>
  );
};

const App = () => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <SearchContextProvider>
          <BookingProvider>
            <ThemedApp />
          </BookingProvider>
        </SearchContextProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

export default App;