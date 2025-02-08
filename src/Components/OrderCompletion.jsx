import { useState, useEffect } from 'react';
import Ratings from './Rating';
import '../Styles/orderCompletion.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const OrderCompletion = () => {
  const [rating, setRating] = useState(0);
  const [order, setOrder] = useState(null); // Add order state
  const [comment, setComment] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedOrder = Cookies.get('orderData');
    if (storedOrder) {
      setOrder(JSON.parse(storedOrder));
    } else {
      // Handle case where order is not found
      console.error('No order data found in localStorage');
      navigate('/dash');
    }
  }, [navigate]);

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

    const token = Cookies.get('authTokencl1');

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/rating/driver/${order.driver_id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating: rating,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }

      Cookies.remove('orderData');
      Cookies.remove('driverData');
      navigate('/');
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div className="order-completion-container">
      <h2>Thank you for using our service!</h2>
      <h3>Order Completed</h3>

      <div className="order-details">
        <p>
          <strong>Vehicle:</strong> {order.vehicle_type}
        </p>
        <p>
          <strong>Driver:</strong> {order.driver_name}
        </p>
        <p>
          <strong>Distance:</strong> {order.distance} km
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
