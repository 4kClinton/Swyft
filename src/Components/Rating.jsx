import '../Styles/Ratings.css';

//eslint-disable-next-line
const Ratings = ({ rating, onRatingChange }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const handleClick = (star) => {
    if (onRatingChange) {
      onRatingChange(star);
    }
  };

  return (
    <div className="ratings-container">
      {/* Render full stars */}
      {Array(fullStars)
        .fill()
        .map((_, index) => (
          <span
            key={`full-${index}`}
            className="star full"
            onClick={() => handleClick(index + 1)}
          >
            &#9733;
          </span>
        ))}

      {/* Render half star */}
      {hasHalfStar && (
        <span
          className="star half"
          onClick={() => handleClick(fullStars + 0.5)}
        >
          &#9733;
        </span>
      )}

      {/* Render empty stars */}
      {Array(emptyStars)
        .fill()
        .map((_, index) => (
          <span
            key={`empty-${index}`}
            className="star empty"
            onClick={() => handleClick(fullStars + index + 1)}
          >
            &#9733;
          </span>
        ))}
    </div>
  );
};

export default Ratings;
