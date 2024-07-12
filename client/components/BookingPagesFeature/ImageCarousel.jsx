import React from "react";


const ImageCarousel = ({ images }) => {
  return (
    <div className="image-carousel">
      {images  &&(images.map((image, index) => (
        <img style={{width:'400px', height : '400px'}} key={index} src={image} alt={`Hotel view ${index + 1}`} />
      )))}
    </div>
  );
};

export default ImageCarousel;