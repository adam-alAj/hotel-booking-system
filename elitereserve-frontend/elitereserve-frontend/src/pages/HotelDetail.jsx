import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { hotelAPI, roomTypeAPI, bookingAPI } from '../services/customerApi';
import { getImageUrl } from '../utils/imageUrl';
import BookingModal from '../components/customer/BookingModal';
import './css/HotelDetail.css';

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [priceBreakdown, setPriceBreakdown] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [expandedRoom, setExpandedRoom] = useState(null);

  const searchParams = JSON.parse(localStorage.getItem('searchParams') || '{}');

  const handleFeedback = (type) => {
    setFeedback(type);
  };

  useEffect(() => {
    if (id) fetchHotelData();
  }, [id]);

  const fetchHotelData = async () => {
    try {
      setLoading(true);
      const hotelRes = await hotelAPI.getHotelById(id);
      const roomTypesRes = await roomTypeAPI.getRoomTypesByHotel(id);

      setHotel(hotelRes.data);
      setRoomTypes(roomTypesRes.data);
    } catch {
      setError('Failed to load hotel');
    } finally {
      setLoading(false);
    }
  };

  const handleReserveClick = async (roomType) => {
    setSelectedRoomType(roomType);

    if (searchParams.checkIn && searchParams.checkOut) {
      try {
        const res = await bookingAPI.calculatePrice(
          id,
          roomType.id,
          searchParams.checkIn,
          searchParams.checkOut
        );
        setPriceBreakdown(res.data);
      } catch { }
    }

    setShowBookingModal(true);
  };

  const renderStars = (rating) => {
    const full = Math.floor(rating / 2);
    return [...Array(5)].map((_, i) => (
      <svg key={i} className={`c-star ${i < full ? 'c-filled' : ''}`} viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ));
  };

  // updated amenity formatter to handle common formats better
  const formatAmenity = (a) => {
    if (!a) return '';
    // Convert 'BREAKFAST_INCLUDED' -> 'Breakfast Included' or 'WIFI' -> 'Wifi'
    return a.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  const AmenityIcon = ({ type }) => {
    // SVG definitions with class amenity-icon-svg (styled in CSS)
    const icons = {
      WIFI: (
        <path d="M5 12a10 10 0 0 1 14 0M8 15a6 6 0 0 1 8 0M11 18a2 2 0 0 1 2 0" />
      ),
      BREAKFAST_INCLUDED: (
        <>
          <path d="M18 8a3 3 0 0 1 3 3 10 10 0 0 1-20 0 3 3 0 0 1 3-3Z" />
          <path d="M11 2v4M7 3v3M15 3v3M8 14l6 0" />
        </>
      ),
      LAUNDRY_SERVICE: (
        <>
          <path d="M3 6h18M5 6v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6" />
          <circle cx="12" cy="13" r="3" />
          <path d="M11 13h2" />
        </>
      ),
      AIR_CONDITIONING: <path d="M12 3v18M3 12h18" />,
      SWIMMING_POOL: <path d="M2 20c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />,
      PARKING: <path d="M6 4h8a4 4 0 1 1 0 8H6z" />,
    };

    return (
      <svg viewBox="0 0 24 24" className="c-amenity-icon-svg">
        {icons[type] || <circle cx="12" cy="12" r="4" />}
        {/* Fallback to a dot if icon not found */}
      </svg>
    );
  };

  if (loading) return <div className="c-loading">Loading...</div>;
  if (error) return <div className="c-error">{error}</div>;
  if (!hotel) return <div>No hotel</div>;

  return (
    <div className="c-hotel-detail-page">

      {/* HERO */}
      <section className="c-hotel-hero">
        <img
          src={getImageUrl(hotel.imageUrl)}
          alt={hotel.name}
        />

        <div className="c-hero-overlay" />

        <div className="c-hero-info-card">
          <div className="c-hero-rating">
            <div className="c-stars">{renderStars(hotel.averageRating || 0)}</div>
            <span>{hotel.averageRating?.toFixed(1)}</span>
          </div>

          <h1>{hotel.name}</h1>

          <div className="c-location">{hotel.city}</div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="c-detail-content">

        {/* HOTEL INFO */}
        <section className="c-hotel-info-section">
          <h2>About this hotel</h2>

          <p className="c-hotel-description">{hotel.description}</p>

          <div className="c-address-box">
            <div className="c-address-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>

            <div className="c-address-content">
              <span className="c-address-label">Address</span>
              <span className="c-address-value">{hotel.address}</span>

              <div className="c-address-actions">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(hotel.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="c-map-link"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0 0 21 18.382V7.618a1 1 0 0 0-.553-.894L15 4m0 13V4" />
                  </svg>
                  View on map
                </a>
              </div>
            </div>
          </div>

          {/* FAQ SECTION */}
          <div className="c-faq-section">
            <h3>FAQs about {hotel.name}</h3>

            <div className="c-faq-list">
              {[{
                q: `What type of room can I book at ${hotel.name}?`,
                a: roomTypes.length > 0
                  ? `Room options at ${hotel.name} include: ${roomTypes.map(r => r.roomTypeName).join(', ')}.`
                  : `Various room types are available at ${hotel.name} to suit your needs.`
              },
              {
                q: `How much does it cost to stay at ${hotel.name}?`,
                a: `The prices at ${hotel.name} may vary depending on your stay (e.g. dates you select, hotel's policy etc.). See the prices by entering your dates.`
              },
              {
                q: `What are the check-in and check-out times at ${hotel.name}?`,
                a: `Check-in at ${hotel.name} is from 15:00, and check-out is until 11:00.`
              },
              {
                q: `How far is ${hotel.name} from the centre of ${hotel.city}?`,
                a: `${hotel.name} is located in ${hotel.city}. Contact the hotel for specific distance information.`
              }
              ].map((faq, idx) => (
                <div key={idx} className={`c-faq-item ${openFaq === idx ? 'c-open' : ''}`}>
                  <button
                    className="c-faq-question"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  >
                    {faq.q}
                    <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  <div className="c-faq-answer">
                    <p>{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ROOMS */}
        <section className="c-room-types-section">
          <div className="c-room-section-header">
            <h2>Select Your Room</h2>
            <span className="c-room-count"><strong>{roomTypes.length}</strong> room types available</span>
          </div>

          <div className="c-room-types-grid">
            {roomTypes.map((roomType) => {
              const isExpanded = expandedRoom === roomType.id;
              const allAmenities = roomType.amenities || [];
              const showCount = 3;
              const hasMore = allAmenities.length > showCount;
              const remainingCount = allAmenities.length - showCount;

              return (
                <div key={roomType.id} className="c-room-card">

                  <div className="c-room-image-container">
                    <span className="c-room-badge">Available Now</span>
                    <img
                      src={getImageUrl(roomType.imageUrl)}
                      alt={roomType.roomTypeName}
                    />
                  </div>

                  <div className="c-room-details">
                    <div className="c-room-header">
                      <h3>{roomType.roomTypeName}</h3>
                      <div className="c-room-type-meta">High quality & amenity luxuary</div>
                    </div>

                    {!isExpanded ? (
                      <div className="c-room-amenities-row">
                        {allAmenities.slice(0, showCount).map((a, idx) => (
                          <span key={`${a}-${idx}`} className="c-amenity-pill">
                            <AmenityIcon type={a} />
                            {formatAmenity(a)}
                          </span>
                        ))}
                        {hasMore && (
                          <button
                            className="c-amenity-pill c-more-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedRoom(roomType.id);
                            }}
                            type="button"
                          >
                            +{remainingCount}
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="c-expanded-amenities-box">
                        <div className="c-expanded-header">
                          <span>All amenities ({allAmenities.length})</span>
                          <button
                            className="c-close-btn-x"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedRoom(null);
                            }}
                            type="button"
                          >
                            ×
                          </button>
                        </div>
                        <div className="c-expanded-list">
                          {allAmenities.map((a, idx) => (
                            <span key={`${a}-${idx}`} className="c-amenity-pill">
                              <AmenityIcon type={a} />
                              {formatAmenity(a)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="c-room-footer">
                      <div className="c-price-block">
                        <span className="c-price-label">per night</span>
                        <div className="c-price">
                          ${roomType.basePrice}
                          <span>/ night</span>
                        </div>
                      </div>

                      <button onClick={() => handleReserveClick(roomType)}>
                        Reserve
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </section>

      </div>

      {/* FEEDBACK SECTION */}
      <div className="c-feedback-section">
        <div className="c-feedback-content">
          <h3>How do you like EliteReserve so far?</h3>
          <p>Your feedback helps us improve</p>

          <div className="c-feedback-buttons">
            <button
              className={`c-feedback-btn c-like ${feedback === 'like' ? 'c-selected' : ''}`}
              onClick={() => handleFeedback('like')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
              </svg>
              I like it
            </button>

            <button
              className={`c-feedback-btn c-dislike ${feedback === 'dislike' ? 'c-selected' : ''}`}
              onClick={() => handleFeedback('dislike')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" />
              </svg>
              Could be better
            </button>
          </div>

          {feedback && (
            <div className={`c-feedback-message ${feedback ? 'c-show' : ''}`}>
              {feedback === 'like' ? 'Thanks for the love!' : "Thanks for your feedback! We'll work on it."}
            </div>
          )}
        </div>
      </div>

      {showBookingModal && (
        <BookingModal
          hotel={hotel}
          roomType={selectedRoomType}
          priceBreakdown={priceBreakdown}
          searchParams={searchParams}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </div>
  );
};

export default HotelDetail;