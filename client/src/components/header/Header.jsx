import React, { useState, useEffect } from 'react';
import { faBed, faCalendarDays, faCar, faPerson, faPlane, faTaxi } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateRange } from 'react-date-range';
import { format, addDays, isSameDay } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../context/SearchContext';
import { useAuth } from '../../context/AuthProvider';
import '../../styles/Header.css';
import SearchBox from './SearchBox';
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css';
import PopupSearchPlaces from '../popupsearchplace/PopupSearchPlaces';
import useFetch from '../../hooks/useFetch';
import useCityImages from '../../hooks/useCityImages';

const Header = ({ type }) => {
    const { data: hotelsData, loading, error } = useFetch("http://localhost:8800/api/hotels", { withCredentials: true });
    const [hotelCounts, setHotelCounts] = useState({});
    const { city: citySelected, dates: datesSelected, options: optionsSelected, hotel: hotelSelected } = useSearch();
    const [destination, setDestination] = useState(citySelected ? citySelected : (hotelSelected ? hotelSelected.city : ''));
    const [openDate, setOpenDate] = useState(false);
    const [isOpenPopup, setIsOpenPopup] = useState(false);
    const [filteredCities, setFilteredCities] = useState([]);
    const [filteredHotels, setFilteredHotels] = useState([]);
    const [dates, setDates] = useState(datesSelected ? datesSelected : [
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 1),
            key: 'selection',
        },
    ]);

    const [openOptions, setOpenOptions] = useState(false);
    const [options, setOptions] = useState(optionsSelected ? optionsSelected : {
        adult: 1,
        children: 0,
        room: 1,
    });

    const [isScrolled, setIsScrolled] = useState(false);
    const [cities, setCities] = useState([]); // State to hold cities
    const imageURls = useCityImages(cities, "regular");

    const navigate = useNavigate();
    const { user } = useAuth();
    const { handleSearch } = useSearch();

    useEffect(() => {
        if (!loading && !error && hotelsData) {
            const uniqueCities = [...new Set(hotelsData.map((hotel) => hotel.city))];
            setCities(uniqueCities);
            setFilteredCities(uniqueCities);

            const counts = {};
            uniqueCities.forEach((city) => {
                counts[city] = hotelsData.filter((hotel) => hotel.city === city).length;
            });
            setHotelCounts(counts);
        }
    }, [hotelsData, loading, error]);

    const handleOption = (name, operation) => {
        setOptions((prev) => ({
            ...prev,
            [name]: operation === 'i' ? options[name] + 1 : options[name] - 1,
        }));
    };

    const onSearchClick = () => {
        if (!destination) {
            alert("Please select a city or hotel");
            return;
        }

        const matchedHotel = hotelsData.find(hotel => hotel.name.toLowerCase() === destination.toLowerCase());
        handleSearch(destination, dates, options, matchedHotel ? matchedHotel : null);
    };

    const getFormattedDate = (date) => {
        if (!date) return ''; // Handle null or undefined date

        const today = new Date();
        const tomorrow = addDays(today, 1);

        // Convert to Date object if date is a string
        if (typeof date === 'string') {
            date = new Date(date);
        }

        if (isSameDay(date, today)) {
            return 'Today';
        }
        if (isSameDay(date, tomorrow)) {
            return 'Tomorrow';
        }

        try {
            return new Date(Date.UTC(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            )).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (error) {
            console.error("Invalid date provided:", date, error);
            return ''; // Return an empty string or a default value if an error occurs
        }
    };

    const handleScroll = () => {
        if (window.scrollY > 400) {
            setIsScrolled(true);
        } else {
            setIsScrolled(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleDestinationChange = (e) => {
        const value = e.target.value;
        setDestination(value);
        if (value) {
            const filtered = cities.filter(
                (city) => city.toLowerCase().startsWith(value.toLowerCase())
            );
            setFilteredCities(filtered);

            const filteredHotels = hotelsData.filter(
                (hotel) => hotel.name.toLowerCase().startsWith(value.toLowerCase())
            );
            setFilteredHotels(filteredHotels);
        } else {
            setFilteredCities(cities);
            setFilteredHotels([]);
        }
    };

    const handleReset = () => {
        setDestination('');
        setDates([
            {
                startDate: new Date(),
                endDate: addDays(new Date(), 1),
                key: 'selection',
            },
        ]);
        setOptions({
            adult: 1,
            children: 0,
            room: 1,
        });
    };

    useEffect(() => {
        setDestination(citySelected || (hotelSelected ? hotelSelected.name : ''));
        setDates(datesSelected || [
            {
                startDate: new Date(),
                endDate: addDays(new Date(), 1),
                key: 'selection',
            },
        ]);
        setOptions(optionsSelected || {
            adult: 1,
            children: 0,
            room: 1,
        });
    }, [citySelected, datesSelected, optionsSelected, hotelSelected]);

    useEffect(() => {
        handleReset();
    }, []);

    return (
        <div className='headerWrapper'>
            {citySelected && (
                <img className='background-header' style={{ width: "100%", height: '100%' }} src={imageURls[citySelected] || "default_image_url_here"} alt={citySelected} />
            )}
            <div className={`header ${isScrolled ? 'scrolled' : ''}`}>
                <div className={type === 'list' ? 'headerContainer listMode' : 'headerContainer'}>
                    <div className="headerList">
                        <div className="headerListItem active">
                            <FontAwesomeIcon icon={faBed} />
                            <span>Stays</span>
                        </div>
                        <div className="headerListItem">
                            <FontAwesomeIcon icon={faPlane} />
                            <span>Flights</span>
                        </div>
                        <div className="headerListItem">
                            <FontAwesomeIcon icon={faCar} />
                            <span>Car rentals</span>
                        </div>
                        <div className="headerListItem">
                            <FontAwesomeIcon icon={faBed} />
                            <span>Attractions</span>
                        </div>
                        <div className="headerListItem">
                            <FontAwesomeIcon icon={faTaxi} />
                            <span>Airport taxis</span>
                        </div>
                    </div>
                    {type !== 'list' && (
                        <>
                            <h1 className="headerTitle">A lifetime of discounts? It's Genius.</h1>
                            <p className="headerDesc">
                                Get rewarded for your travels – unlock instant savings of 10% or more with a free Airbooking account
                            </p>
                            <div className="headerSearch">
                                <div className="headerSearchItem">
                                    <FontAwesomeIcon icon={faBed} className="headerIcon" />
                                    <input
                                        type="text"
                                        placeholder={
                                            hotelSelected ? hotelSelected.name :
                                                citySelected ? citySelected :
                                                    "Where are you going?"
                                        }
                                        className="headerSearchInput"
                                        value={destination}
                                        onChange={handleDestinationChange}
                                        onClick={() => setIsOpenPopup(!isOpenPopup)}
                                    />
                                </div>
                                {isOpenPopup && (
                                    <PopupSearchPlaces
                                        style={{ right: '50px' }}
                                        cities={filteredCities}
                                        hotels={filteredHotels}
                                        hotelCounts={hotelCounts}
                                        onSelectCity={(city) => {
                                            setDestination(city);
                                            setIsOpenPopup(false);
                                        }}
                                        onSelectHotel={(hotel) => {
                                            setDestination(hotel.name);
                                            setIsOpenPopup(false);
                                        }}
                                    />
                                )}
                                <div className="headerSearchItem">
                                    <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
                                    <span onClick={() => setOpenDate(!openDate)} className="headerSearchText">
                                        {`${getFormattedDate(dates[0]?.startDate)} to ${getFormattedDate(dates[0]?.endDate)}`}
                                    </span>
                                    {openDate && (
                                        <DateRange
                                            editableDateInputs={true}
                                            onChange={(item) => {
                                                const startDate = new Date(Date.UTC(
                                                    item.selection.startDate.getFullYear(),
                                                    item.selection.startDate.getMonth(),
                                                    item.selection.startDate.getDate()
                                                ));
                                                const endDate = new Date(Date.UTC(
                                                    item.selection.endDate.getFullYear(),
                                                    item.selection.endDate.getMonth(),
                                                    item.selection.endDate.getDate()
                                                ));
                                                setDates([{ ...item.selection, startDate, endDate }]);
                                            }}
                                            moveRangeOnFirstSelection={false}
                                            ranges={dates} // Ensure dates is properly structured as [{ startDate: ..., endDate: ..., key: 'selection' }]
                                            minDate={new Date()}
                                            className="date"
                                        />
                                    )}
                                </div>
                                <div className="headerSearchItem">
                                    <FontAwesomeIcon icon={faPerson} className="headerIcon" />
                                    <span onClick={() => setOpenOptions(!openOptions)} className="headerSearchText">
                                        {`${options.adult} adult · ${options.children} children · ${options.room} room`}
                                    </span>
                                    {openOptions && (
                                        <div className="options">
                                            <div className="optionItem">
                                                <span className="optionText">Adult</span>
                                                <div className="optionCounter">
                                                    <button disabled={options.adult <= 1} className="optionCounterButton" onClick={() => handleOption('adult', 'd')}>-</button>
                                                    <span className="optionCounterNumber">{options.adult}</span>
                                                    <button className="optionCounterButton" onClick={() => handleOption('adult', 'i')}>+</button>
                                                </div>
                                            </div>
                                            <div className="optionItem">
                                                <span className="optionText">Children</span>
                                                <div className="optionCounter">
                                                    <button disabled={options.children <= 0} className="optionCounterButton" onClick={() => handleOption('children', 'd')}>-</button>
                                                    <span className="optionCounterNumber">{options.children}</span>
                                                    <button className="optionCounterButton" onClick={() => handleOption('children', 'i')}>+</button>
                                                </div>
                                            </div>
                                            <div className="optionItem">
                                                <span className="optionText">Room</span>
                                                <div className="optionCounter">
                                                    <button disabled={options.room <= 1} className="optionCounterButton" onClick={() => handleOption('room', 'd')}>-</button>
                                                    <span className="optionCounterNumber">{options.room}</span>
                                                    <button className="optionCounterButton" onClick={() => handleOption('room', 'i')}>+</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="headerSearchButton">
                                    <button
                                        className="headerBtn" onClick={onSearchClick}>
                                        Search
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            {isScrolled && (
                <SearchBox
                    hotelCounts={hotelCounts}
                    cities={cities}

                />
            )}
        </div>
    );
};

export default Header;