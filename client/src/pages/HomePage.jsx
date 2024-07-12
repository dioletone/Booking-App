import React from "react";
import HotelSuggestList from "../components/hotelsuggestions-lists/HotelSuggestList.jsx";
import Header from "../components/header/Header.jsx";
import AttractiveList from "../components/attractlist/AttractList.jsx";
export default function HomePage(){
    return (<div className="app"><Header /><AttractiveList /><HotelSuggestList/></div>);
};