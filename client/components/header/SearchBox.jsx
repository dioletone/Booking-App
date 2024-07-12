import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faCalendarDays, faPerson } from '@fortawesome/free-solid-svg-icons';
import { DateRange } from 'react-date-range';
import { format, addDays, isSameDay } from 'date-fns';
import PopupSearchPlaces from '../popupsearchplace/PopupSearchPlaces';
import '../../styles/SearchBox.css'; // Adjust path as per your project structure
import { useSearch } from '../../context/SearchContext';

const SearchBox = ({ cities, hotelCounts }) => {
  const { city: citySelected, dates: datesSelected, options: optionsSelected, handleSearch } = useSearch();
  const [destination, setDestination] = useState(citySelected || '');
  const [filteredCities, setFilteredCities] = useState(cities);
  const [openDate, setOpenDate] = useState(false);
  const [dates, setDates] = useState(datesSelected ? datesSelected.map(d => ({
    startDate: new Date(d.startDate),
    endDate: new Date(d.endDate),
    key: d.key,
  })) : [
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: 'selection',
    },
  ]);
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState(optionsSelected || {
    adult: 1,
    children: 0,
    room: 1,
  });
  const [isOpenPopup, setIsOpenPopup] = useState(false);

  const togglePopup = () => {
    setIsOpenPopup(!isOpenPopup);
  };

  const handleOption = (name, operation) => {
    setOptions(prev => ({
      ...prev,
      [name]: operation === 'i' ? options[name] + 1 : options[name] - 1,
    }));
  };

  const getDayName = date => {
    if (!date) return '';
    return format(date, 'EEEE');
  };

  const handleSearchClick = () => {
    if (!destination) {
      alert('Please select a city');
      return;
    }

    const formattedDates = dates?.map(date => ({
      startDate: date.startDate ? new Date(date.startDate).setHours(0, 0, 0, 0) : null,
      endDate: date.endDate ? new Date(date.endDate).setHours(0, 0, 0, 0) : null,
      key: date.key,
    }));

    handleSearch(destination, formattedDates, options);
  };

  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setDestination(value);
    if (value) {
      const filtered = cities.filter(
        (city) => city.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities(cities);
    }
  };

  useEffect(() => {
    setDestination(citySelected || '');
    setDates(datesSelected ? datesSelected.map(d => ({
      startDate: new Date(d.startDate),
      endDate: new Date(d.endDate),
      key: d.key,
    })) : [
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
  }, [citySelected, datesSelected, optionsSelected]);

  const getFormattedDate = (date) => {
    if (!date) return ''; // Handle null or undefined date
  
    try {
      const formattedDate = new Date(date);
  
      if (isNaN(formattedDate)) {
        console.error("Invalid date provided:", date);
        return ''; // Return an empty string or a default value if an error occurs
      }
  
      const today = new Date();
      const tomorrow = addDays(today, 1);
  
      if (isSameDay(formattedDate, today)) {
        return 'Today';
      }
      if (isSameDay(formattedDate, tomorrow)) {
        return 'Tomorrow';
      }
  
      return new Date(Date.UTC(
        formattedDate.getFullYear(),
        formattedDate.getMonth(),
        formattedDate.getDate()
      )).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error("Error formatting date:", date, error);
      return ''; // Return an empty string or a default value if an error occurs
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
    // Handle reset on component mount (page load or refresh)
    handleReset();
  }, []);

  return (
    <div className="SearchBox SearchBox--horizontal SearchBox-Scrollable">
      <div className="SearchBox__wrapper">
        {/* Destination Input */}
        <div className="Box IconBox IconBox--autocomplete" data-selenium="autocomplete-box" data-element-name="autocomplete-box" data-element-value="non-prefilled" id="autocomplete-box">
          <div className="IconBox__wrapper">
            <span>
              <FontAwesomeIcon icon={faBed} className="IconBox__icon" />
            </span>
            <div className="IconBox__child">
              <input
                aria-label="Enter destination or hotel name"
                role="combobox"
                aria-expanded="false"
                data-selenium="textInput"
                type="text"
                className="SearchBoxTextEditor SearchBoxTextEditor--autocomplete"
                placeholder="City or hotel name"
                value={destination}
                onChange={handleDestinationChange}
                onClick={togglePopup}
              />
            </div>
          </div>
        </div>

        {isOpenPopup && (
          <PopupSearchPlaces
            style={{ right: '50px' }}
            cities={filteredCities}
            hotelCounts={hotelCounts}
            onSelectCity={city => {
              setDestination(city);
              setIsOpenPopup(false);
            }}
          />
        )}

        <div
          className="Box IconBox IconBox--checkIn IconBox--focussable"
          role="button"
          aria-label={`Check-in ${getFormattedDate(dates[0]?.startDate)}`}
          id="check-in-box"
          onClick={() => setOpenDate(!openDate)}
        >
          <div className="IconBox__wrapper">
            <span>
              <FontAwesomeIcon icon={faCalendarDays} className="IconBox__icon" />
            </span>
            <div className="IconBox__child">
              <div className="SearchBoxTextDescription SearchBoxTextDescription--checkIn">
                <div className="SearchBoxTextDescription__title">{getFormattedDate(dates[0]?.startDate)}</div>
                <div className="SearchBoxTextDescription__desc">{getDayName(dates[0]?.startDate)}</div>
                <div className="SearchBoxTextDescription__title">{getFormattedDate(dates[0]?.endDate)}</div>
                <div className="SearchBoxTextDescription__desc">{getDayName(dates[0]?.endDate)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Options Selection */}
        <div
          className="Box IconBox IconBox--occupancy IconBox--focussable"
          role="button"
          aria-expanded="false"
          id="occupancy-box"
          onClick={() => setOpenOptions(!openOptions)}
        >
          <div className="IconBox__wrapper">
            <span>
              <FontAwesomeIcon icon={faPerson} className="IconBox__icon" />
            </span>
            <div className="IconBox__child">
              <div className="SearchBoxTextDescription SearchBoxTextDescription--occupancy">
                <div className="SearchBoxTextDescription__title">{`${options.adult} adult · ${options.children} children · ${options.room} room`}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <button disabled={!destination} className="btn SearchBox__searchButton SearchBox__searchButton--active" onClick={handleSearchClick}>
          <span className="SearchBox__searchButton__text">Search</span>
        </button>
      </div>

      {openDate && (
        <DateRange
          editableDateInputs={true}
          onChange={(item) => {
            const startDate = new Date(item.selection.startDate);
            const endDate = new Date(item.selection.endDate);

            // Check if startDate and endDate are valid Date objects
            if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
              setDates([{ ...item.selection, startDate, endDate }]);
            } else {
              console.error("Invalid dates selected:", item.selection);
            }
          }}
          moveRangeOnFirstSelection={false}
          ranges={dates}
          className="date"
          minDate={new Date()}
        />
      )}

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
  );
};

export default SearchBox;