import React, { useContext, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/frontend_assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../context/storeContext";

const Navbar = () => {
  const [menu, setMenu] = useState("Home");
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="navbar-logo">
        <img src={assets.logo} alt="Homease Logo" />
      </Link>

      {/* Menu Links */}
      <ul className="navbar-menu">
        <li>
          <Link
            to="/"
            onClick={() => setMenu("Home")}
            className={menu === "Home" ? "active" : ""}
          >
            Home
          </Link>
        </li>
        <li>
          <a
            href="#explore-services"
            onClick={() => setMenu("Services")}
            className={menu === "Services" ? "active" : ""}
          >
            Services
          </a>
        </li>
        <li>
          <a
            href="#footer"
            onClick={() => setMenu("Contact Us")}
            className={menu === "Contact Us" ? "active" : ""}
          >
            Contact Us
          </a>
        </li>
        <li>
          <Link
            to="/my-orders"
            onClick={() => setMenu("My Orders")}
            className={menu === "My Orders" ? "active" : ""}
          >
            My Orders
          </Link>
        </li>
      </ul>

      {/* Right Section: Cart & Profile */}
      <div className="navbar-right">
        {/* Cart Icon */}
        <Link to="/cart" className="navbar-cart">
          <img src={assets.basket_icon} alt="Cart" />
          {getTotalCartAmount() > 0 && <span className="cart-dot"></span>}
        </Link>

        {/* Profile / Auth */}
        {token ? (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="Profile" className="profile-icon" />
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate("/profile")}>
                <img src={assets.profile_icon} alt="Profile" />
                <p>My Profile</p>
              </li>
              <li onClick={() => navigate("/my-orders")}>
                <img src={assets.bag_icon} alt="Orders" />
                <p>My Orders</p>
              </li>
              <hr />
              <li onClick={handleLogout}>
                <img src={assets.logout_icon} alt="Logout" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        ) : (
          <button className="navbar-auth-btn" onClick={() => navigate("/auth")}>
            Sign Up
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
