import React, { useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import '../../styles/UpdateImg.css';
import Thumbnail from '../thumbnail/thumnail';

const UpdateImg = ({ onClose }) => {
  const { user, handleUpdate } = useAuth();
  const defaultUserImg = '/clone.jpg'; // Replace with your default image path
  const [newImage, setNewImage] = useState(null);
  const [url, setUrl] = useState('');
  const [isDisabled, setDisabled] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file);
    setUrl('');
  };

  const handleImageChangeWithUrl = (e) => {
    const value = e.target.value;
    setUrl(value);
    setNewImage(null);
    console.log(value.length)
    
        setDisabled(true); // Disable file input if URL has a value
      if (value.length === 0) {
        setDisabled(false); // Enable file input if URL is empty
      } // Reset newImage state if URL is manually entered
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      // Determine whether to update using file or URL based on state
      const imageData = newImage ? { img: newImage.name } : { img: url };
      handleUpdate(imageData);
      console.log('Update img successful');
    } catch (error) {
      console.error('Error updating image:', error);
      // Handle error state or logging
    }
  };

  // Update disabled state based on URL input value
  

  return (
    <div className="update-img-modal">
      <div className="header-update">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <img src="/airbnb.png" alt="logo" />
        <h2>Booking Account</h2>
      </div>
      <h2>Profile Picture</h2>
      <p>A picture helps people recognize you and lets you know when you are signed in to your account</p>
      <Thumbnail style={{ width: '280px', height: '280px', marginBottom: '10px' }} />

      <form onSubmit={handleSubmit}>
        <input disabled={isDisabled} type="file" onChange={handleImageChange} />
        <input type="text" value={url} onChange={handleImageChangeWithUrl} placeholder="URL link" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UpdateImg;
