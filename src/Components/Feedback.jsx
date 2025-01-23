import { useState } from 'react';

const Feedback = () => {
  //eslint-disable-next-line
  const [rating, setRating] = useState(null);

  const handleFeedback = (value) => {
    setRating(value);
    alert(`Thank you for your feedback! You rated: ${value}`);
  };

  return (
    <div
      style={{
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: '#E8E8E8',
      }}
    >
      <h2 style={{ color: '#841C26' }}>You have Arrived</h2>
      <div
        style={{
          margin: '2rem auto',
          padding: '1rem',
          backgroundColor: '#FFF',
          borderRadius: '10px',
          width: '80%',
        }}
      >
        <h3 style={{ color: '#BA274A' }}>How was your Trip?</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <span
            onClick={() => handleFeedback('Bad')}
            style={{ fontSize: '2rem', cursor: 'pointer' }}
          >
            😞
          </span>
          <span
            onClick={() => handleFeedback('Average')}
            style={{ fontSize: '2rem', cursor: 'pointer' }}
          >
            😐
          </span>
          <span
            onClick={() => handleFeedback('Good')}
            style={{ fontSize: '2rem', cursor: 'pointer' }}
          >
            😊
          </span>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
