import React, { useContext } from "react";
import "./ServiceItem.css";
import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../context/storeContext";

const ServiceItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart, BASE_URL } = useContext(StoreContext);
  const quantity = cartItems[id] || 0;

  return (
    <div className="service-card">
      {/* Service Image */}
      <div className="service-image-container">
        <img
          className="service-image"
          src={`${BASE_URL}/images/${image}`}
          alt={name}
        />
      </div>

      {/* Service Details */}
      <div className="service-details">
        <h3 className="service-title">{name}</h3>

        {/* Rating */}
        <div className="service-rating">
          <img src={assets.rating_stars} alt={`${name} rating`} />
        </div>

        {/* Description */}
        <p className="service-description">{description}</p>

        {/* Footer: Price and Actions */}
        <div className="service-card-footer">
          <p className="service-price">Rs. {price}</p>

          <div className="service-actions">
            {quantity === 0 ? (
              <button className="add-button" onClick={() => addToCart(id)}>
                <img src={assets.add_icon_white} alt="Add" />
              </button>
            ) : (
              <div className="counter-container">
                <button
                  onClick={() => removeFromCart(id)}
                  className="counter-button"
                >
                  <img src={assets.remove_icon_red} alt="Remove" />
                </button>

                <span className="counter-quantity">{quantity}</span>

                <button
                  onClick={() => addToCart(id)}
                  className="counter-button"
                >
                  <img src={assets.add_icon_green} alt="Add" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceItem;
