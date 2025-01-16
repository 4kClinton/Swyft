import '../Styles/Ratings.css'; // Import the CSS file for Ratings component

//eslint-disable-next-line
const Ratings = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="ratings-container">
      {/* Render full stars */}
      {Array(fullStars)
        .fill()
        .map((_, index) => (
          <span key={`full-${index}`} className="star full">
            &#9733;
          </span>
        ))}

      {/* Render half star */}
      {hasHalfStar && <span className="star half">&#9733;</span>}

      {/* Render empty stars */}
      {Array(emptyStars)
        .fill()
        .map((_, index) => (
          <span key={`empty-${index}`} className="star empty">
            &#9733;
          </span>
        ))}
    </div>
  );
};

export default Ratings;
