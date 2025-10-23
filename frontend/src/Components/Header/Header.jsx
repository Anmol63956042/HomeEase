import React from "react";
import "./Header.css";
import { assets } from "../../assets/frontend_assets/assets";

const Header = () => {
  return (
    <header className="header">
      <div className="header-contents">
        {/* Main Heading */}
        <h1 className="header-title">
          Professional Home Services at Your Fingertips
        </h1>

        {/* Divider */}
        <div className="header-divider"></div>

        {/* Description */}
        <p className="header-intro">
          Welcome to <strong>Homease</strong>, your trusted partner for all home service needs.
        </p>
        <p className="header-description">
          We connect you with verified professionals for cleaning, electrical work, 
          plumbing, relocation, painting, and repairs — all with just a few clicks. 
          Experience reliable, quality service delivery while you focus on what matters most.
        </p>

        {/* Buttons */}
        <div className="header-buttons">
          <a href="#explore-services">
            <button className="primary-btn">Explore Services</button>
          </a>
          <button className="secondary-btn">How It Works</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
