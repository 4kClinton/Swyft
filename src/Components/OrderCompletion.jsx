import { useState, useEffect } from 'react';
import Ratings from './Rating';
import '../Styles/orderCompletion.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';

const OrderCompletion = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [latestOrder, setLatestOrder] = useState(null); // initialize as null
  const navigate = useNavigate();
  const orders = useSelector((state) => state.ordersHistory.value);

  useEffect(() => {
    if (!orders || orders.length === 0) {
      navigate('/dash');
    } else {
      const sortedOrders = [...orders].sort(
        (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
      );
      setLatestOrder(sortedOrders[0]);
    }
  }, [orders, navigate]);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Please provide a rating before submitting.');
      return;
    }

    // Retrieve driver ID from local storage
    const storedDriverId = localStorage.getItem('driver_id');
    // console.log('Driver ID from local storage:', storedDriverId);
    if (!storedDriverId || storedDriverId === 'null') {
      alert('Unable to submit rating because driver details are missing.');
      return;
    }

    const token = Cookies.get('authTokencl1');

    try {
      const response = await fetch(
        `https://swyft-backend-client-nine.vercel.app/rating/driver/${storedDriverId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating,
            comment, // optionally include comment if needed on the backend
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }

      navigate('/');
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('An error occurred while submitting your rating.');
    }
  };

  if (!latestOrder) {
    return <div>Loading...</div>;
  }

  return (
    <div className="order-completion-container">
      <h2>Thank you for using our service!</h2>
      <h3>Order Completed</h3>

      <div className="order-details">
        <p>
          <strong>Vehicle: </strong> {latestOrder.vehicle_type}
        </p>
        <p>
          <strong>Distance: </strong> {latestOrder.distance} km
        </p>
        <p>
          <strong>Cost: </strong>Ksh. {latestOrder.total_cost}
        </p>
      </div>

      <div className="rating-section">
        <h4>Rate the Driver:</h4>
        <Ratings rating={rating} onRatingChange={handleRatingChange} />
      </div>

      <div className="comment-section">
        <textarea
          style={{ backgroundColor: 'white', color: 'black' }}
          value={comment}
          onChange={handleCommentChange}
          placeholder="Write your comment here..."
        />
      </div>

      <button onClick={handleSubmit} className="submit-rating-btn">
        Submit Rating
      </button>
    </div>
  );
};

export default OrderCompletion;
