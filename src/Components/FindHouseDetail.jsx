import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import '../Styles/Dash.css'; // ✅ styles
import fallbackImage from '../assets/fallback.jpeg';
import {
  Bed,
  Bath,
  Ruler,
  Building,
  Car,
  PawPrint,
  Eye,
  Wallet,
  CheckCircle,
  Lightbulb,
  X,
  Share2,
  Layers2,
  MapPin,
  CalendarSync,
} from 'lucide-react';
import agentPic from '../assets/profile.jpeg';

export default function FindHouseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showSchedulePopup, setShowSchedulePopup] = useState(false);
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('');

  // ---- Bottom sheet state ----
  const [isOpen, setIsOpen] = useState(false);
  const [startY, setStartY] = useState(null);
  const [offsetY, setOffsetY] = useState(0);

  // ---- Carousel state ----
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);

  const panelHeight = 500; // bigger panel
  const closedPosition = panelHeight;

  const baseTranslate = isOpen ? 0 : closedPosition;
  const translateY =
    startY !== null
      ? Math.min(Math.max(baseTranslate + offsetY, 0), closedPosition)
      : baseTranslate;

  const dashStyle = {
    transform: `translateY(${translateY}px)`,
    transition: startY !== null ? 'none' : 'transform 0.3s ease-out',
  };

  const handleTouchStart = (e) => setStartY(e.touches[0].clientY);
  const handleTouchMove = (e) => {
    if (startY !== null) {
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;
      setOffsetY(deltaY);
    }
  };
  const handleTouchEnd = () => {
    const finalTranslate = baseTranslate + offsetY;
    setIsOpen(finalTranslate < closedPosition / 2);
    setOffsetY(0);
    setStartY(null);
  };

  // ---- Fetch property ----
  useEffect(() => {
    const fetchUnit = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          'https://swyft-agent-01.vercel.app/api/vacant-units'
        );
        const json = await res.json();

        if (json.success && Array.isArray(json.data)) {
          const match = json.data.find((u) => u.id === id);
          setProperty(match || null);
        } else {
          throw new Error('Invalid API response structure');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching unit:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUnit();
  }, [id]);

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (error) return <p style={{ padding: 20 }}>Error: {error}</p>;
  if (!property) return <p style={{ padding: 20 }}>Property Not Found</p>;

  const handleCall = () => {
    window.location.href = `tel:${property.contact_info}`;
  };

  // Utility to normalize phone numbers
  const formatPhoneNumber = (phone) => {
    let cleaned = (phone || '').replace(/\s+/g, ''); // remove spaces

    if (cleaned.startsWith('+')) {
      cleaned = cleaned.substring(1);
    } else if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.substring(1);
    }

    return cleaned;
  };

  // const handleWhatsApp = () => {
  //   const phone = formatPhoneNumber(property.contact_info);
  //   window.open(`https://wa.me/${phone}`, '_blank');
  // };

  const closeSchedulePopup = () => {
    setShowSchedulePopup(false);
  };

  const handleScheduleVisit = () => {
    if (!visitDate || !visitTime) {
      alert('Please select both date and time');
      return;
    }

    const humanDate = new Date(visitDate).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    const url = window.location.href;
    const text = `Hello, I would like to schedule a visit for the property: ${property.title}
📍 ${property.city}, ${property.state}
🗓 Date: ${humanDate}
⏰ Time: ${visitTime}

Link: ${url}`;

    const phone = formatPhoneNumber(property.contact_info);
    const whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(
      text
    )}`;
    window.open(whatsappLink, '_blank');
    setShowSchedulePopup(false);
  };
  const handlePlanMove = () => {
    navigate('/dash');
  };

  const handleShareWhatsApp = () => {
    const url = window.location.href;
    const text = `Check out this space: ${property.title}\n📍 ${property.city}, ${property.state}\n\n${url}`;

    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappLink, '_blank');
  };

  const images =
    property.images?.length > 0 ? property.images : [fallbackImage];

  const handleCarouselScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const width = e.target.clientWidth;
    const index = Math.round(scrollLeft / width);
    setActiveIndex(index);
  };

  return (
    <div className="FindHouseDetail">
      {/* Close button overlay */}
      <button className="closeBtn" onClick={() => navigate('/findhouse')}>
        ✕
      </button>

      <div
        className="blurBackground"
        style={{
          backgroundImage: `url(${images[activeIndex]})`,
        }}
      ></div>

      {/* ---- Carousel with Blurred Background ---- */}
      <div className="carouselWrapper">
        <div
          className="imageCarousel"
          ref={carouselRef}
          onScroll={handleCarouselScroll}
        >
          {images.map((src, i) => (
            <img key={i} src={src} alt={`${property.title} ${i + 1}`} />
          ))}
        </div>
      </div>

      {/* Indicators */}
      <div className="indicators">
        {images.map((_, i) => (
          <span key={i} className={i === activeIndex ? 'active' : ''}></span>
        ))}
      </div>

      {/* ---- Draggable Dash ---- */}
      <div
        className={`FindHseDash ${isOpen ? 'open' : ''}`}
        style={dashStyle}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="notch"></div>
        {/* Title & Price */}
        <h2>{property.title}</h2>
        <h3 className="rent">
          KES {property.rent_amount?.toLocaleString()}/month
        </h3>{' '}
        <p className="location">
          <MapPin size={16} /> {property.city}, {property.state}
        </p>
        <p className="location">
          <Wallet size={16} /> Deposit: KES{' '}
          {property.deposit_amount?.toLocaleString()}
        </p>
        {/* Frequency message */}
        <p className="frequencyInfo">
          <Layers2 size={16} />{' '}
          {property.frequency === 0 ? (
            <>This is the only listing in this building</>
          ) : (
            <>
              There {property.frequency === 1 ? 'is' : 'are'}{' '}
              {property.frequency} similar unit
              {property.frequency > 1 && 's'}
            </>
          )}
        </p>
        <p className="viewingFee">
          <Eye size={16} /> Viewing Fee: KES{' '}
          {property.viewing_fee?.toLocaleString()}
        </p>
        <p
          className="shareProperty"
          onClick={handleShareWhatsApp}
          style={{ cursor: 'pointer' }}
        >
          <Share2 size={16} /> Share
        </p>
        <div className="badge">
          <CalendarSync size={18} className="badge-icon" />{' '}
          <span className="rentOrsale">{property.category}</span>
        </div>
        {/* Key Details */}
        <h4 className="TitleName">Key Details</h4>
        <div className="keyDetails">
          <p>
            <Bed size={16} /> {property.bedrooms} Bedrooms
          </p>
          <p>
            <Bath size={16} /> {property.bathrooms} Bathrooms
          </p>
          <p>
            <Ruler size={16} /> {property.square_feet} Sq Ft
          </p>
          <p>
            <Building size={16} /> {property.property_type}
          </p>
          {property.parking_available && (
            <p>
              <Car size={16} /> Parking Available
            </p>
          )}
          <p>
            <PawPrint size={16} /> Pets: {property.pet_policy}
          </p>
        </div>
        {/* About */}
        <h4 className="TitleName">About This Property</h4>
        <p>{property.description}</p>
        {/* Amenities */}
        <h4 className="TitleName">Features & Amenities</h4>
        <div className="amenities-grid">
          {property.amenities?.map((a, i) => (
            <div key={i} className="grid-item">
              <CheckCircle size={16} color="#00c763" />
              <span>{a.replace(/_/g, ' ')}</span>
            </div>
          ))}
          {property.parking_available && (
            <div className="grid-item">
              <CheckCircle size={16} color="#00c763" />
              <span>Parking available</span>
            </div>
          )}
        </div>
        {/* Utilities */}
        <h4>Utilities Included</h4>
        <div className="utilities-grid">
          {property.utilities_included?.map((u, i) => (
            <div key={i} className="grid-item">
              <Lightbulb size={16} />
              <span>{u}</span>
            </div>
          ))}
        </div>
        {/* Agent Info */}
        <div className="agentCard">
          <img src={agentPic} alt="agent pic" className="agentPic" />
          <h4>Agent Information</h4>
          <p>{property.role === 'agent' ? 'Agent' : 'Owner'}</p>
          <p>{property.contact_info}</p>

          <div className="actions">
            <button className="btn call" onClick={handleCall}>
              Call Agent
            </button>
            <button className="btn whatsapp" onClick={handlePlanMove}>
              Plan My Move
            </button>
          </div>
          <button
            className="btn schedule"
            onClick={() => setShowSchedulePopup(true)}
          >
            Schedule a Visit
          </button>
        </div>
      </div>

      {/* ---- Schedule Visit Popup (moved outside dash) ---- */}
      {showSchedulePopup && (
        <div className="schedule-overlay" role="dialog" aria-modal="true">
          <div className="schedule-modal">
            <button
              className="modal-close"
              onClick={closeSchedulePopup}
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <h3 className="modal-title">Schedule a Visit</h3>

            <label className="modal-label">Select Date</label>
            <input
              type="date"
              className="modal-input"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
            />

            <label className="modal-label">Select Time</label>
            <input
              type="time"
              className="modal-input"
              value={visitTime}
              onChange={(e) => setVisitTime(e.target.value)}
            />

            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={closeSchedulePopup}>
                Cancel
              </button>
              <button
                className="modal-btn confirm"
                onClick={handleScheduleVisit}
              >
                Confirm & Send via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
