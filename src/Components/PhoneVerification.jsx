import PropTypes from 'prop-types';
import PhoneInput from 'react-phone-input-2';
// import 'react-phone-input-2/lib/style.css';

const PhoneNumberInput = ({ phone, setPhone }) => {
  return (
    <PhoneInput
      country={'ke'}
      value={phone}
      onChange={(value) => setPhone(value)}
      inputProps={{
        required: true,
        autoFocus: true,
      }}
      inputStyle={{
        backgroundColor: '#F3F3F3', // Match other input fields' background
        color: '#212121',
        fontSize: '16px',
        fontWeight: 'bold',
        fontFamily: 'Montserrat',
        height: '55px',
        borderRadius: '8px',
        border: 'none',
        paddingLeft: '50px',
        width: '100%',
        outline: 'none',
      }}
      containerStyle={{
        width: '100%',
      }}
      buttonStyle={{
        borderRadius: '8px 0 0 8px',
        border: 'none',
        backgroundColor: '#F3F3F3',
      }}
      dropdownStyle={{
        borderRadius: '8px',
      }}
    />
  );
};

// ✅ Adding PropTypes validation to fix ESLint errors
PhoneNumberInput.propTypes = {
  phone: PropTypes.string.isRequired,
  setPhone: PropTypes.func.isRequired,
};

export default PhoneNumberInput;
