import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import PropTypes from 'prop-types';
import fallbackImage from '../assets/fallback.jpeg';

const styles = {
  pageContainer: { padding: '1rem', background: '#f8f9fa', minHeight: '100vh' },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    marginTop: '39px',
    marginBottom: '30px',
  },
  searchBar: {
    border: '3px solid #00c763',
    outline: 'none',
    backgroundColor: 'var(--input-background)',
    color: 'var(--text-color)',
    flexGrow: 1,
    fontSize: '16px',
    padding: '8px 40px 8px 16px', // padding-right leaves space for icon
    borderRadius: '25px',
    textAlign: 'center',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 'bold',
    width: '100%',
    maxWidth: '500px',
  },
  searchIcon: {
    position: 'absolute',
    right: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#00c763',
  },
  suggestionsBox: {
    position: 'absolute',
    top: '100%',
    marginTop: '5px',
    width: '100%',
    maxWidth: '500px',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
    zIndex: 10,
  },
  suggestionItem: {
    padding: '10px 15px',
    cursor: 'pointer',
    borderBottom: '1px solid #f1f1f1',
  },
  propertyGrid: { columnCount: 2, columnGap: '16px' },
  propertyCard: {
    display: 'inline-block',
    width: '100%',
    marginBottom: '16px',
    cursor: 'pointer',
    background: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  propertyImage: { width: '100%', height: '160px', objectFit: 'cover' },
  propertyTitle: { fontWeight: 'bold', margin: '8px 12px 4px' },
  propertyLocation: { fontSize: '13px', margin: '0 12px' },
  propertyPrice: {
    margin: '8px 12px 12px',
    color: '#00c763',
    fontWeight: 'bold',
  },
};

// --- Helper to parse human query ---
const parseQuery = (q) => {
  const query = q.toLowerCase();

  // Extract number of bedrooms
  const bedroomMatch = query.match(/(\d+)\s*(bed(room)?|br)/);
  const bedrooms = bedroomMatch ? parseInt(bedroomMatch[1], 10) : null;

  // Normalize property type
  let propertyType = null;
  if (
    query.includes('apartment') ||
    query.includes('unit') ||
    query.includes('flat')
  ) {
    propertyType = 'apartment';
  } else if (query.includes('studio') || query.includes('bedsitter')) {
    propertyType = 'studio';
  } else if (query.includes('condo')) {
    propertyType = 'condo';
  }

  // Location keywords
  const locationWords = query
    .replace(/\d+\s*bed(room)?/g, '')
    .split(' ')
    .filter((w) => w.length > 2);

  return { bedrooms, propertyType, locationWords };
};

function SearchBar({ query, setQuery, onSearch, suggestions }) {
  return (
    <div style={styles.searchWrapper}>
      <input
        style={styles.searchBar}
        value={query}
        placeholder="Search for apartments, e.g. '1 bedroom in Kilimani'"
        onChange={(e) => {
          setQuery(e.target.value);
          onSearch(e.target.value);
        }}
      />
      <Search style={styles.searchIcon} size={20} />
      {suggestions.length > 0 && (
        <div style={styles.suggestionsBox}>
          {suggestions.map((s, idx) => (
            <div
              key={idx}
              style={styles.suggestionItem}
              onClick={() => {
                setQuery(s);
                onSearch(s);
              }}
            >
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

SearchBar.propTypes = {
  query: PropTypes.string.isRequired,
  setQuery: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  suggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

function MasonryGrid({ data }) {
  const navigate = useNavigate();
  return (
    <div style={styles.propertyGrid}>
      {data.map((item) => (
        <div
          key={item.id}
          style={styles.propertyCard}
          onClick={() => navigate(`/findhouse/${item.id}`)}
        >
          <img
            src={item.images?.[0] || fallbackImage}
            alt={item.title}
            style={styles.propertyImage}
          />
          <p style={styles.propertyTitle}>{item.title}</p>
          <p style={styles.propertyLocation}>
            {item.city}, {item.state}
          </p>
          <p style={styles.propertyPrice}>
            KES {item.rent_amount?.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}

MasonryGrid.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      images: PropTypes.arrayOf(PropTypes.string),
      city: PropTypes.string,
      state: PropTypes.string,
      rent_amount: PropTypes.number,
      bedrooms: PropTypes.number,
      property_type: PropTypes.string,
      address: PropTypes.string,
      building_name: PropTypes.string,
    })
  ).isRequired,
};

export default function FindHouse() {
  const [units, setUnits] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          'https://swyft-agent-01.vercel.app/api/vacant-units'
        );
        const json = await res.json();

        if (json.success && Array.isArray(json.data)) {
          setUnits(json.data);
          setFiltered(json.data);
        } else {
          throw new Error('Invalid API response structure');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching units:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUnits();
  }, []);

  const handleSearch = (q) => {
    if (!q.trim()) {
      setFiltered(units);
      setSuggestions([]);
      return;
    }

    const { bedrooms, propertyType, locationWords } = parseQuery(q);

    // Filter units
    const results = units.filter((u) => {
      let match = true;

      if (bedrooms !== null) match = match && u.bedrooms === bedrooms;
      if (propertyType)
        match = match && u.property_type?.toLowerCase() === propertyType;
      if (locationWords.length > 0) {
        match =
          match &&
          locationWords.some((word) =>
            [u.address, u.city, u.state, u.building_name]
              .join(' ')
              .toLowerCase()
              .includes(word)
          );
      }

      return match;
    });

    setFiltered(results);

    // Build suggestions based on available units
    const newSuggestions = [];
    if (bedrooms === null)
      newSuggestions.push('1 bedroom apartment in Kilimani');
    if (!propertyType) newSuggestions.push('Studio in Westlands');
    if (locationWords.length === 0)
      newSuggestions.push('2 bedroom flat in Karen');

    setSuggestions(newSuggestions);
  };

  if (loading) return <div style={styles.pageContainer}>Loading units...</div>;
  if (error) return <div style={styles.pageContainer}>Error: {error}</div>;

  return (
    <div style={styles.pageContainer}>
      <SearchBar
        query={query}
        setQuery={setQuery}
        onSearch={handleSearch}
        suggestions={suggestions}
      />
      {filtered.length > 0 ? (
        <MasonryGrid data={filtered} />
      ) : (
        <p>No units found.</p>
      )}
    </div>
  );
}
