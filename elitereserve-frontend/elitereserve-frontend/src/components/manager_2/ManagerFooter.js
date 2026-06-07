import React from 'react';
import './ManagerFooter.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
      <footer className="footer">
        <div className="footer-container">
          {/* Main Footer Grid - 5 Column Layout */}

          {/* Column 1: Brand */}
          <div className="footer-col footer-col-brand">
            <a href="/public" className="footer-logo">
              <span className="logo-e">elite</span>
              <span className="logo-reserve">reserve</span>
            </a>
            <p className="footer-description">
              Redefining luxury hospitality through unparalleled service,
              exclusive properties, and unforgettable experiences across
              the world's most coveted destinations.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 2H7C4.2 2 2 4.2 2 7V17C2 19.8 4.2 22 7 22H17C19.8 22 22 19.8 22 17V7C22 4.2 19.8 2 17 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 11.37C16.1234 12.2022 15.9812 13.0522 15.5937 13.799C15.2062 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.908 12.2384 16.0396 11.4077 15.9059C10.5771 15.7723 9.80971 15.3801 9.21479 14.7852C8.61987 14.1902 8.22768 13.4229 8.09402 12.5922C7.96035 11.7615 8.09193 10.9099 8.47024 10.1584C8.84855 9.40685 9.45414 8.79376 10.2009 8.40626C10.9477 8.01876 11.7978 7.87658 12.63 8C13.4789 8.12588 14.2648 8.52146 14.8717 9.1283C15.4785 9.73515 15.8741 10.5211 16 11.37Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17.5 6.5H17.51" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23 3C22.0424 3.67546 20.9821 4.19212 19.86 4.53C19.2577 3.83756 18.4573 3.34674 17.567 3.12393C16.6767 2.90112 15.7395 2.9572 14.8821 3.28445C14.0247 3.61171 13.2884 4.19441 12.773 4.95373C12.2575 5.71304 11.9877 6.61235 12 7.53V8.53C10.2426 8.57557 8.50127 8.18582 6.93101 7.39545C5.36074 6.60508 4.01032 5.43864 3 4C3 4 -1 13 8 17C5.94053 18.398 3.48716 19.099 1 19C10 24 21 19 21 7.5C20.9991 7.22145 20.9723 6.94359 20.92 6.67C21.9406 5.66349 22.6608 4.39271 23 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 9H2V21H6V9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="YouTube">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.54 6.42C22.4212 5.94541 22.1793 5.51057 21.8387 5.15941C21.498 4.80824 21.0707 4.55318 20.6 4.42C18.88 4 12 4 12 4C12 4 5.12 4 3.4 4.46C2.92925 4.59318 2.50198 4.84824 2.16131 5.19941C1.82064 5.55057 1.57875 5.98541 1.46 6.46C1.1453 8.20556 0.991235 9.97631 1 11.75C0.988765 13.537 1.14283 15.3213 1.46 17.08C1.59096 17.5398 1.83831 17.9581 2.17814 18.2945C2.51797 18.6309 2.93882 18.8738 3.4 19C5.12 19.46 12 19.46 12 19.46C12 19.46 18.88 19.46 20.6 19C21.0707 18.8668 21.498 18.6118 21.8387 18.2606C22.1793 17.9094 22.4212 17.4746 22.54 17C22.8525 15.2676 23.0065 13.5103 23 11.75C23.0112 9.96295 22.8572 8.1787 22.54 6.42Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9.75 15.02L15.5 11.75L9.75 8.48V15.02Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Discover */}
          <div className="footer-col">
            <h3 className="footer-col-title">Discover</h3>
            <ul className="footer-links">
              <li><a href="/destinations">Destinations</a></li>
              <li><a href="/hotels">Hotels & Resorts</a></li>
              <li><a href="/villas">Private Villas</a></li>
              <li><a href="/experiences">Curated Experiences</a></li>
              <li><a href="/collections">Exclusive Collections</a></li>
              <li><a href="/offers">Seasonal Offers</a></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="footer-col">
            <h3 className="footer-col-title">Company</h3>
            <ul className="footer-links">
              <li><a href="/about">Our Story</a></li>
              <li><a href="/leadership">Leadership</a></li>
              <li><a href="/careers">Careers</a></li>
              <li><a href="/press">Press Room</a></li>
              <li><a href="/sustainability">Sustainability</a></li>
              <li><a href="/blog">Journal</a></li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div className="footer-col">
            <h3 className="footer-col-title">Support</h3>
            <ul className="footer-links">
              <li><a href="/help">Help Center</a></li>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/faq">FAQs</a></li>
              <li><a href="/cancellation">Cancellation Policy</a></li>
              <li><a href="/gift-cards">Gift Cards</a></li>
              <li><a href="/reviews">Guest Reviews</a></li>
            </ul>
          </div>

          {/* Column 5: Connect */}
          <div className="footer-col">
            <h3 className="footer-col-title">Connect</h3>
            <ul className="footer-links footer-contact">
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 16.92V19C22.0001 19.5304 21.8591 20.0507 21.592 20.5006C21.3249 20.9505 20.9424 21.3123 20.4884 21.544C20.0345 21.7758 19.5262 21.8682 19.0231 21.8114C18.52 21.7547 18.0428 21.5511 17.65 21.23C14.824 18.8598 12.6065 15.8599 11.21 12.46C10.9506 11.841 10.8042 11.1821 10.78 10.51C10.7647 9.95778 10.8691 9.40911 11.086 8.905C11.303 8.40088 11.6262 7.95525 12.03 7.6C12.2817 7.3894 12.5752 7.23292 12.891 7.14099C13.2069 7.04906 13.5384 7.0236 13.8642 7.06605C14.1899 7.1085 14.5025 7.21806 14.782 7.38708C15.0615 7.55611 15.3018 7.78072 15.487 8.045L17.466 10.86C17.6447 11.1264 17.7625 11.4282 17.8111 11.7441C17.8597 12.06 17.838 12.3823 17.7475 12.689C17.657 12.9957 17.5 13.2794 17.287 13.5202C17.074 13.7611 16.8104 13.953 16.514 14.082L15.096 14.695C14.7338 14.8616 14.4767 15.1987 14.417 15.593C14.3573 15.9872 14.4775 16.386 14.742 16.683C15.631 17.735 16.748 18.585 18.011 19.176C18.3386 19.334 18.7042 19.3923 19.0612 19.3451C19.4183 19.298 19.7517 19.1476 20.022 18.914C20.3104 18.6565 20.5413 18.3403 20.699 17.987C20.8566 17.6336 20.9375 17.2513 20.936 16.865L20.934 16.057C20.9217 15.6355 20.757 15.2361 20.4763 14.9283C20.1956 14.6205 19.8182 14.4253 19.409 14.38L17.967 14.191" stroke="currentColor"/>
                </svg>
                <a href="tel:+97259497524">+972 59-949-7524</a>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor"/>
                  <path d="M22 6L12 13L2 6" stroke="currentColor"/>
                </svg>
                <a href="mailto:elitereserveguide@gmail.com">elitereserveguide@gmail.com</a>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22C12 22 20 18 20 10C20 5.58 16.42 2 12 2C7.58 2 4 5.58 4 10C4 18 12 22 12 22Z" stroke="currentColor"/>
                  <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor"/>
                </svg>
                <span>Bu str.<br/>Bethlehem, Palestine</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-inner">
            <div className="footer-copyright">
              <p>© {currentYear} EliteReserve. All rights reserved.</p>
            </div>
            <div className="footer-legal-links">
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
              <a href="/cookies">Cookie Policy</a>
              <a href="/accessibility">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
  );
};

export default Footer;