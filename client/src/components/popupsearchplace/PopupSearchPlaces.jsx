import React from "react";
import "../../styles/PopupSearchPlaces.css"; // Adjust path as necessary
import useCityImages from "../../hooks/useCityImages"; // Adjust the path if needed

const PopupSearchPlaces = ({ cities, hotelCounts, onSelectCity, style ,hotels , onSelectHotel}) => {
  const imageUrls = useCityImages(cities, "thumb");

  const handleCitySelect = (city) => {
    onSelectCity(city);
  };
  const handleHotelSelect = (hotel) =>{
    onSelectHotel(hotel);
  }

  return (
    <div className="popup" style={style}>
      <div className="popup-inner">
        <div className="popup-header">
          <p className="popup-title">Các điểm đến ở Việt Nam</p>
        </div>
        <div className="popup-content">
          { cities&& cities.map((city, index) => (
            <div key={index} className="popup-item">
              <button
                id={`destination_${index}`}
                className="popup-button"
                onClick={() => handleCitySelect(city)}
              >
                <div className="popup-image">
                  <img
                    src={imageUrls[city] || "default_image_url_here"}
                    alt={`${city} image`}
                    className="attractive-img"
                    style={{ width: "100%", height: "100%" }} // Example of CSS inline styling
                  />
                </div>
                <div className="popup-details">
                  <p className="popup-name">{city}</p>
                  <p className="popup-count">{`${hotelCounts[city]} hotels`}</p>
                </div>
              </button>
            </div>
          ))}
             { hotels &&hotels.map((hotel, index) => (
            <div key={index} className="popup-item">
              <button
                id={`destination_${index}`}
                className="popup-button"
                onClick={() => handleHotelSelect(hotel)}
              >
                <div className="popup-image">
                  <img
                    src={hotel.photos[0] || "default_image_url_here"}
                    alt={`${hotel.name} image`}
                    className="attractive-img"
                    style={{ width: "100%", height: "100%" }} // Example of CSS inline styling
                  />
                </div>
                <div className="popup-details">
                  <p className="popup-name">{hotel.name}</p>
                  <p className="popup-count">{hotel.title}</p>
                </div>
              </button>
            </div>
          ))}
         
        </div>
      </div>
    </div>
  );
};

export default PopupSearchPlaces;