import React, { useEffect } from "react";
import Header from "../components/header/Header.jsx";
import HotelFeature from "../components/HotelFeatured/HotelFeature.jsx";
import "../styles/CityPage.css"; // Corrected import statement for CSS
import { OptionsProvider } from "../context/OptionsContext.jsx";
export default function CityPage() {
   
    return (
    <OptionsProvider>
            <Header  />
            <HotelFeature />
            </OptionsProvider>
           
    );
}