import { useState } from 'react';

function StarRating({ rating = 0, maxRating = 5, onRatingChange = null, size = 'medium', showLabel = false }) {
  const [hoverRating, setHoverRating] = useState(0);
  const isInteractive = onRatingChange !== null;

  const sizeClasses = {
    small: 'star-small',
    medium: 'star-medium',
    large: 'star-large'
  };

  const getSizeValue = () => {
    switch (size) {
      case 'small': return 16;
      case 'large': return 28;
      default: return 20;
    }
  };

  const starSize = getSizeValue();

  const handleClick = (value) => {
    if (isInteractive) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (isInteractive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (isInteractive) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className={`star-rating ${sizeClasses[size]} ${isInteractive ? 'interactive' : ''}`}>
      {[...Array(maxRating)].map((_, index) => {
        const value = index + 1;
        const isFilled = value <= displayRating;
        const isHalf = !isFilled && value - 0.5 <= displayRating;

        return (
          <span
            key={index}
            className={`star ${isFilled ? 'filled' : ''} ${isHalf ? 'half' : ''}`}
            onClick={() => handleClick(value)}
            onMouseEnter={() => handleMouseEnter(value)}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: isInteractive ? 'pointer' : 'default' }}
          >
            <svg
              viewBox="0 0 24 24"
              width={starSize}
              height={starSize}
              fill={isFilled ? '#f39c12' : 'none'}
              stroke="#f39c12"
              strokeWidth="2"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </span>
        );
      })}
      {showLabel && (
        <span className="star-label">
          {rating.toFixed(1)} / {maxRating}
        </span>
      )}
    </div>
  );
}

export default StarRating;
