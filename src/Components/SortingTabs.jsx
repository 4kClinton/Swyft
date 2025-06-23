import { useState } from 'react';
import PropTypes from 'prop-types';
import '../Styles/SortingTabs.css';

function SortingTabs({ onTabChange }) {
  const [activeTab, setActiveTab] = useState('Cargo');

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    if (onTabChange) {
      onTabChange(tabName);
    }
  };

  return (
    <div className="sorting-tabs-container">
      <div className="sorting-tabs">
        <button
          className={`sorting-tab ${activeTab === 'Cargo' ? 'active' : ''}`}
          onClick={() => handleTabClick('Cargo')}
        >
          Transport
        </button>
        <button
          className={`sorting-tab ${activeTab === 'Parcels' ? 'active' : ''}`}
          onClick={() => handleTabClick('Parcels')}
        >
          Parcels
        </button>
        <button
          className={`sorting-tab ${activeTab === 'Moving' ? 'active' : ''}`}
          onClick={() => handleTabClick('Moving')}
        >
          Moving
        </button>
      </div>
    </div>
  );
}

SortingTabs.propTypes = {
  onTabChange: PropTypes.func,
};

export default SortingTabs;
