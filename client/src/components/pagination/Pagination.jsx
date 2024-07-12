// components/PaginationDots.jsx
import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/Pagination.css'; // Import your stylesheet for styling

const PaginationDots = ({ total, current, onChange, onPrevious, onNext }) => {
  return (
    <div className="pagination-dots">
      <button onClick={onPrevious} disabled={current === 0}>
        &lt;
      </button>
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={`dot ${index === current ? 'active' : ''}`}
          onClick={() => onChange(index)}
        />
      ))}
      <button onClick={onNext} disabled={current === total - 1}>
        &gt;
      </button>
    </div>
  );
};

PaginationDots.propTypes = {
  total: PropTypes.number.isRequired,
  current: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default PaginationDots;
