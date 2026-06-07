import React from 'react';
import './css/AdvertiseSection.css';

const AdvertiseSection = () => {
  return (
      <section className="cadvertise-section">
        <div className="cadvertise-container">
          <div className="cstory-content">
            <div className="cstory-badge">
              <span>Experience</span>
            </div>
            <h2>Where Every Stay Becomes a Memory</h2>
            <p>
              From sunrise views over pristine waters to evenings wrapped in luxury,
              we curate moments that linger long after checkout.
            </p>

            <div className="cstory-features">
              <div className="cstory-item">
                <div className="cstory-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 3v18M3 12h18"/>
                  </svg>
                </div>
                <span>Seamless Booking</span>
              </div>
              <div className="cstory-item">
                <div className="cstory-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                </div>
                <span>24/7 Concierge</span>
              </div>
            </div>

            <button className="cdiscover-btn">
              <span>Start Your Journey</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <polyline points="19 12 12 19 5 12"/>
              </svg>
            </button>
          </div>

          <div className="cimmersive-visual">
            <div className="cgallery-main">
              <img
                  src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Luxury Experience"
              />
              <div className="cgallery-overlay">
                <span className="cexperience-tag">Curated For You</span>
              </div>
            </div>

            <div className="cgallery-floating cfloating-1">
              <img
                  src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Dining"
              />
            </div>

            <div className="cgallery-floating cfloating-2">
              <img
                  src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Relaxation"
              />
            </div>

            <div className="cgallery-accent cacent-1"></div>
            <div className="cgallery-accent cacent-2"></div>
          </div>
        </div>

        <div className="cdecoration-ring cring-1"></div>
        <div className="cdecoration-ring cring-2"></div>
      </section>
  );
};

export default AdvertiseSection;