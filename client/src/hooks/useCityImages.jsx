import { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = 'FBVLRIUdaOvwma7qu5ovQQZOPC4VqHw_j1f2EVAU8UE';

const useCityImages = (cities, type,citySelected) => {
  const [imageUrls, setImageUrls] = useState({});
    const [imageUrl, setImageUrl] = useState('');
  useEffect(() => {
    const fetchImage = async (city,citySelected) => {
      try {
        const response = await axios.get(`https://api.unsplash.com/search/photos?query=${city}&client_id=${API_KEY}`);

        return response.data.results[0]?.urls[type] || ''; // Use the specified image type
      } catch (error) {
        console.error(`Error fetching image for ${city}:`, error);
        return ''; // Return a default image URL or handle the error as needed
      }
    };

    const fetchImages = async () => {
      const urls = { ...imageUrls }; // Clone current state to avoid mutation
      for (const city of cities) {
        if (!urls[city]) { // Fetch only if not already cached
          const imageUrl = await fetchImage(city);
          urls[city] = imageUrl;
        }
      }
      setImageUrls(urls); // Update state with new or cached images
    };

    if (cities.length > 0) {
      fetchImages();
    }
  }, [cities, type]); // Depend on cities and type changes

  return imageUrls;
};

export default useCityImages;