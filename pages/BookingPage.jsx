import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import ImageCarousel from "../components/BookingPagesFeature/ImageCarousel";
import RoomSelection from "../components/BookingPagesFeature/RoomSlelection";
import BookingSummary from "../components/BookingPagesFeature/BookingSummary";
import "../styles/BookingPage.css";
import { useSearch } from "../context/SearchContext";
import NavbarMenu from "../components/BookingPagesFeature/NavBarMenu";
import _debounce from 'lodash/debounce';
import { OptionsProvider } from "../context/OptionsContext";
import Header from "../components/header/Header";
import CommentsSection from "../components/Comment/CommentSection";
const renderStars = (rating) => {
  const totalStars = 5;
  const filledStars = Math.floor(rating);
  const emptyStars = totalStars - filledStars;
  return (
    <div className="star-rating">
      {Array(filledStars).fill("★").map((star, index) => (
        <span key={`filled-${index}`} className="filled-star">
          {star}
        </span>
      ))}
      {Array(emptyStars).fill("☆").map((star, index) => (
        <span key={`empty-${index}`} className="empty-star">
          {star}
        </span>
      ))}
    </div>
  );
};

const BookingPage = () => {
  const { hotelID } = useParams();
  const { data: hotel, loading: hotelLoading, error: hotelError } = useFetch(
    `http://localhost:8800/api/hotels/${hotelID}`
  );
  const { rooms } = useSearch();
  const [hotelRooms, setHotelRooms] = useState([]);
  const [isNavbarFixed, setIsNavbarFixed] = useState(false);
  const [showLogin, setShowLogin] = useState(false); // Corrected state declaration
  const [isOpen, setIsOpen] = useState(false); // State to manage booking modal visibility
  const [openComment ,setOpenComment] = useState(false);
  useEffect(() => {
    if (hotel && rooms) {
      setHotelRooms(rooms.filter((room) => room.hotelId === hotelID));
    }
  }, [rooms, hotel, hotelID]);

  useEffect(() => {
    const handleScroll = _debounce(() => {
      if (window.scrollY > 490) {
      setIsNavbarFixed(true);
      } else {
        setIsNavbarFixed(false);
      }
    }, 100); // Adjust debounce delay as needed

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Adjust this value as needed
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    } else {
      console.warn(`Element with ID '${id}' not found.`);
    }
  };
  useEffect(()=>{
    showLogin && setIsNavbarFixed(false)
    isOpen && setIsNavbarFixed(false)
  })

  if (hotelLoading) return <div>Loading...</div>;
  if (hotelError) return <div>Error loading hotel: {hotelError.message}</div>;
  
  return (
    <OptionsProvider>
      {(!isOpen && !showLogin) &&  <Header />}
    <div className="booking-page" id="header-bookingpage">
      <ImageCarousel images={hotel.photos} />
      <div className={`NavBar__menuGroup ${isNavbarFixed ? "navbar-fixed" : ""}`}>
        <NavbarMenu scrollToSection={scrollToSection} />
      </div>
      <div  className="header">
        <h1>{hotel.name}</h1>
        <div className="rating">
          {hotel.rating && renderStars(hotel.rating)}
        </div>
        <div className="location">
          {hotel.address} {hotel.city}
        </div>
        <div className="des">{hotel.desc}</div>
      </div>
      <div id="facilities-bookingpage" className="facilities">
        <h2>Amenities</h2>
        <ul>
          {hotel.facilities &&
            hotel.facilities.map((f, index) => (
              <li key={index}>
                <div className="item">{f}</div>
              </li>
            ))}
        </ul>
      </div>
      <div id="roomselection-bookingpage" style={{width:'100%'}}>
      <RoomSelection key={hotelID} hotelID={hotelID} rooms={hotelRooms} isOpen={isOpen} setIsOpen={setIsOpen} setShowLogin={setShowLogin} showLogin={showLogin}  setIsNavbarFixed={setIsNavbarFixed}/>
      </div>
      <BookingSummary hotel={hotel} />
      <div id="comments-bookingpage" style={{width:'100%'}}/>
       
     <CommentsSection  hotelId={hotelID}  setShowLogin={setShowLogin}/>
     
    </div>
    </OptionsProvider>
  );
};

export default BookingPage;