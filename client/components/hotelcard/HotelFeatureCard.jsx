import React, { useEffect, useState } from 'react';
import '../../styles/HotelFeatureCard.css'; // Ensure you have the CSS file for styling
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../context/SearchContext';

const HotelFeatureCard = ({ hotel }) => {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const navigate = useNavigate();
    const { rooms } = useSearch();
  
  
    return (
        <div className="DatelessPropertyCard" data-hotel-id={hotel._id} onClick={() => navigate(`/hotel/${hotel._id}`)}>
            <div className="DatelessPropertyCard__Gallery">
                <div className="DatelessGallery">
                    <img
                        alt={hotel.name}
                        title={hotel.name}
                        src={hotel.photos[currentPhotoIndex]}
                        className="DatelessGallery__HeroImage"
                        style={{ height: 'auto', width: '440px' }}
                    />
                </div>
            </div>
            <div className="DatelessPropertyCard__Content">
                <div className="DatelessPropertyCard__ContentHeader">{hotel.name}</div>
                <span className="DatelessPropertyCard__StarAndArea">
                    <span className="star-rating display-inline">
                        <i className="ficon ficon-star-15 orange-yellow"></i> {hotel.rating}/5
                    </span>
                    <span className="DatelessPropertyCard__ContentAreaCity">
                        <i className="ficon ficon-pin-star"></i> {hotel.city} - View on map
                    </span>
                </span>
                <div className="GeoBenefitPill">
                    <ol className="Pills">
                        {hotel.facilities.map((facility, index) => (
                            <li key={index} className="Pill Pill--facility-pill Pill--outlined">{facility}</li>
                        ))}
                    </ol>
                </div>
                <div className="DatelessPropertyCard__ContentDetailWrapper">
                    <div className="DatelessPropertyCard__ContentDetail">{hotel.desc}</div>
                    <div className="DatelessPropertyCard__Rooms">
                        <h3 className="DatelessPropertyCard__RoomsTitle">Rooms:</h3>
                        <ul className="DatelessPropertyCard__RoomsList">
                            {rooms.filter(room => room.hotelId === hotel._id).length > 0 ? (
                              rooms.filter(room => room.hotelId === hotel._id).map((room, index) => (
                                    <li key={index}>
                                        {room.title}: {room.availableRooms} room{room.a !== 1 ? 's' : ''}
                                    </li>
                                ))
                            ) : (
                                <div>No rooms available</div>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="DatelessPropertyCard__Additional">
                <div className="DatelessPropertyCard__AdditionalReview">
                    <div className="Box-sc-kv6pi1-0 ReviewBubble__ReviewBubbleStyled-sc-1adx17l-0 hCKJCW jGCbkd">
                        <div className="Box-sc-kv6pi1-0 iKCfkO">
                            <svg width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="SvgIconstyled__SvgIconStyled-sc-1i6f60b-0 jUloin Box-sc-kv6pi1-0 cjESZE" style={{ transform: 'none' }}>
                                <path d="M1.199 3.053H21.99a1.5 1.5 0 0 1 1.5 1.5v14.983a1.5 1.5 0 0 1-1.5 1.5H4.53a1.5 1.5 0 0 1-1.5-1.5V8.333a.5.5 0 0 0-.1-.3L.399 4.653a1 1 0 0 1 .8-1.6zm0 1l2.53 3.381c.195.26.3.575.3.9v11.202a.5.5 0 0 0 .5.5H21.99a.5.5 0 0 0 .5-.5V4.553a.5.5 0 0 0-.5-.5H1.2z"></path>
                            </svg>
                            <div className="Box-sc-kv6pi1-0 fRaEGH">
                                <span className="Spanstyled__SpanStyled-sc-16tp9kb-0 kMZMPc kite-js-Span">{hotel.rating}</span>
                            </div>
                        </div>
                        <div className="Box-sc-kv6pi1-0 lcBPvq">
                            <p className="Paragraphstyled__ParagraphStyled-sc-180znkb-0 cSMGMv kite-js-Paragraph">Very good</p>
                            <p className="Paragraphstyled__ParagraphStyled-sc-180znkb-0 bslSq kite-js-Paragraph">{hotel.reviewsCount} reviews</p>
                        </div>
                    </div>
                </div>
                <div className="DatelessPropertyCard__AdditionalAccommodation">
                    <div className="DatelessPropertyCard__AdditionalButton">
                    </div>
                </div>
            </div>
        </div>
    );
};



export default HotelFeatureCard;