import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HotelCard from '../components/customer/HotelCard';
import AdvertiseSection from '../components/customer/AdvertiseSection';
import FeedbackSection from '../components/customer/FeedbackSection';
import { hotelAPI } from '../services/customerApi';
import './css/Home.css';

const Home = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchParams, setSearchParams] = useState({
    checkIn: '',
    checkOut: '',
    guests: 2,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchHotels();
  }, [page]);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await hotelAPI.getAllHotels(page, 8);
      setHotels(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError('Failed to load hotels');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    localStorage.setItem('searchParams', JSON.stringify(searchParams));
    fetchHotels();
  };

  const stats = [
    { value: '100+', label: 'Luxury Hotels' },
    { value: '30+', label: 'Countries' },
    { value: '1.2k+', label: 'Happy Guests' },
    { value: '8.9', label: 'Average Rating' },
  ];

  const features = [
    {
      icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
      ),
      title: 'Trust & Safety',
      description: 'Your security is our top priority'
    },
    {
      icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
      ),
      title: 'Secure Payments',
      description: 'Encrypted transactions'
    },
    {
      icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
      ),
      title: '24/7 Support',
      description: 'We\'re here to help anytime'
    },
    {
      icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
          </svg>
      ),
      title: 'Verified Reviews',
      description: 'Real feedback from guests'
    },
    {
      icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
      ),
      title: 'Best Price Guarantee',
      description: 'Find lower? We\'ll match it'
    }
  ];

  return (
      <div className="chome-page">
        <section className="chero-section">
          <div className="chero-bg">
            <div className="chero-gradient"></div>
            <div className="chero-grid"></div>
          </div>

          <div className="chero-contentt">
            <div className="chero-badge">
              <span>Premium Collection</span>
            </div>
            <h1 className="chero-title">
              Discover Your
              <span className="chighlight"> Perfect Escape</span>
            </h1>
            <p className="chero-subtitle">
              Curated luxury stays for the discerning traveler. Experience world-class hospitality in the world's most coveted destinations.
            </p>

            <div className="cfeatures-row">
              {features.map((feature, index) => (
                  <div key={index} className="cfeature-card-sm">
                    <div className="cfeature-icon-sm">
                      {feature.icon}
                    </div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
              ))}
            </div>

            <div className="chero-sta">
              {stats.map((stat, index) => (
                  <div key={index} className="cstat-it">
                    <span className="cstat-val">{stat.value}</span>
                    <span className="cstat-lab">{stat.label}</span>
                  </div>
              ))}
            </div>
          </div>

          <div className="cscroll-indicator">
            <div className="cmouse">
              <div className="cwheel"></div>
            </div>
            <span>Scroll to explore</span>
          </div>
        </section>

        <div className="clight-grey-section">
          <main className="cmain-content">
            <AdvertiseSection />

            <section className="chotels-section">
              <div className="csection-header">
                <div className="csection-title">
                  <span className="csection-badge">Handpicked</span>
                  <h2>Featured Hotels</h2>
                  <p>Discover our selection of exceptional properties</p>
                </div>
              </div>

              {loading ? (
                  <div className="cloading-state">
                    <div className="cspinner"></div>
                    <p>Discovering amazing hotels...</p>
                  </div>
              ) : error ? (
                  <div className="cerror-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <p>{error}</p>
                    <button onClick={fetchHotels} className="cretry-btn">Try Again</button>
                  </div>
              ) : (
                  <>
                    <div className="chotels-grid">
                      {hotels.map(hotel => (
                          <HotelCard key={hotel.id} hotel={hotel} />
                      ))}
                    </div>

                    <div className="cpagination">
                      <button
                          onClick={() => setPage(p => Math.max(0, p - 1))}
                          disabled={page === 0}
                          className="cpage-button"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="15 18 9 12 15 6"/>
                        </svg>
                        Previous
                      </button>

                      <div className="cpage-numbers">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = i + Math.max(0, Math.min(page - 2, totalPages - 5));
                          if (pageNum >= totalPages) return null;
                          return (
                              <button
                                  key={pageNum}
                                  onClick={() => setPage(pageNum)}
                                  className={`cpage-number ${page === pageNum ? 'cactive' : ''}`}
                              >
                                {pageNum + 1}
                              </button>
                          );
                        })}
                      </div>

                      <button
                          onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                          disabled={page >= totalPages - 1}
                          className="cpage-button"
                      >
                        Next
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="9 18 15 12 9 6"/>
                        </svg>
                      </button>
                    </div>
                  </>
              )}
            </section>

            <FeedbackSection />
          </main>
        </div>
      </div>
  );
};

export default Home;