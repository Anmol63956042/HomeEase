import React from "react";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/frontend_assets/assets";

const ExploreMenu = ({ category, setCategory }) => {
  // Toggle category selection
  const handleCategoryClick = (menuName) => {
    setCategory((prev) => (prev === menuName ? "All" : menuName));
  };

  return (
    <section className="explore-services" id="explore-services">
      {/* Header */}
      <div className="explore-services-header">
        <h1>Expert Services for Your Home</h1>
        <div className="section-divider"></div>
      </div>

      {/* Description */}
      <p className="explore-services-text">
        Discover our comprehensive range of professional home services tailored to exceed your expectations.
        Each service is delivered by vetted professionals who bring expertise, reliability, and 
        exceptional craftsmanship to every project.
      </p>

      {/* Menu List */}
      <div className="explore-services-list-container">
        <div className="explore-services-list">
          {menu_list.map((item, index) => {
            const isActive = category === item.menu_name;
            return (
              <button
                key={index}
                onClick={() => handleCategoryClick(item.menu_name)}
                className={`explore-services-list-item ${isActive ? "active-item" : ""}`}
                aria-pressed={isActive}
              >
                <div className="service-icon-container">
                  <img
                    src={item.menu_image}
                    alt={item.menu_name}
                    className={isActive ? "active" : ""}
                  />
                </div>
                <p>{item.menu_name}</p>
                {isActive && <span className="service-selected-indicator" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Optional CTA */}
      {/*
      <div className="explore-services-cta">
        <p>Can't find what you need? We offer custom solutions too!</p>
        <button className="contact-btn">Contact Us</button>
      </div>
      */}

      <hr />
    </section>
  );
};

export default ExploreMenu;
