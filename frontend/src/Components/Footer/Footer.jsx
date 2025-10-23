import React from "react";
import "./Footer.css";
import { assets } from "../../assets/frontend_assets/assets";

const Footer = () => {
  return (
    <footer className="footer" id="footer">
      <div className="footer-content">
        {/* Left Section: Logo & Description */}
        <div className="footer-left">
          <img className="footer-logo" src={assets.logo} alt="Homease Logo" />
          <p>
            Homease connects you with trusted professionals for all your home service needs.
            Our vetted experts deliver quality services with convenience and reliability,
            helping you maintain a beautiful and functional living space without the hassle.
          </p>
          <div className="footer-social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <img src={assets.facebook_icon} alt="Facebook" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <img src={assets.twitter_icon} alt="Twitter" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <img src={assets.linkedin_icon} alt="LinkedIn" />
            </a>
          </div>
        </div>

        {/* Center Section: Quick Links */}
        <div className="footer-center">
          <h3>Quick Links</h3>
          <div className="footer-divider"></div>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="#explore-services">Our Services</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
          </ul>
        </div>

        {/* Right Section: Contact */}
        <div className="footer-right">
          <h3>Contact Us</h3>
          <div className="footer-divider"></div>
          <ul className="footer-contact">
            <li>
              <span className="contact-icon phone-icon" aria-hidden="true"></span>
              <a href="tel:+916395604255">+91-6395604255</a>
            </li>
            <li>
              <span className="contact-icon email-icon" aria-hidden="true"></span>
              <a href="mailto:yanmol1813@gmail.com">yanmol1813@gmail.com</a>
            </li>
            <li>
              <span className="contact-icon location-icon" aria-hidden="true"></span>
              Department of Computer Science, AMU, Aligarh, India
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <hr />
        <p>
          &copy; {new Date().getFullYear()} Homease - Your Home Service Partner | All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
