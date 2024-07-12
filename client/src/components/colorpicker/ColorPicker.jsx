import React from 'react';
import { HexColorPicker } from "react-colorful";
import { useTheme } from '../../context/ThemeContext';
import '../../styles/ColorPicker.css';

const ColorPicker = ({ onClose }) => {
  const { colors, setColor, resetTheme } = useTheme();

  const handleBackgroundColorChange = (color) => {
    setColor({ ...colors, backgroundColor: color });
  };

  const handleTextColorChange = (color) => {
    setColor({ ...colors, textColor: color });
  };

  return (
    <div className="theme-form">
      <button type="button" className="close-btn" onClick={onClose}>X</button>
      <div style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
        <div>
          <h3>Background Color</h3>
          <HexColorPicker color={colors.backgroundColor} onChange={handleBackgroundColorChange} />
        </div>
        <div>
          <h3>Text Color</h3>
          <HexColorPicker color={colors.textColor} onChange={handleTextColorChange} />
        </div>
      </div>
      <button className='reset-btn' onClick={resetTheme}>Reset</button>
    </div>
  );
};

export default ColorPicker;