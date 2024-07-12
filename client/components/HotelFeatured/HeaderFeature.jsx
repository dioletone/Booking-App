import React, { useState } from 'react';
import '../../styles/HeaderFeature.css';

const HeaderFeatured = ({ onSortChange }) => {
    const [sortOption, setSortOption] = useState('');

    const handleSortChange = (option) => {
        setSortOption(option);
        onSortChange(option);
    };

    return (
        <div className="header-featured">
            
                <div onClick={() => handleSortChange('rating')} className={`headerFeatureItem ${sortOption === 'rating' ? 'active' : ''}`}>
                    Sort by Rating
                </div>
                <div onClick={() => handleSortChange('cheapest')} className={`headerFeatureItem ${sortOption === 'cheapest' ? 'active' : ''}`}>
                    Sort by Cheapest Price
                </div>
                <div onClick={() => handleSortChange('mostReviews')} className={`headerFeatureItem ${sortOption === 'mostReviews' ? 'active' : ''}`}>
                    Sort by Most Reviews
                </div>
            
            <div className="selected-sort">
                Selected Sort: {sortOption ? sortOption.toUpperCase() : 'None'}
            </div>
        </div>
    );
};

export default HeaderFeatured;