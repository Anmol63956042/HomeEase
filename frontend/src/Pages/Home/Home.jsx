import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Home.css";
import Header from "../../Components/Header/Header"; // Import Header component
import ExploreMenu from "../../Components/ExploreMenu/ExploreMenu"; // Import ExploreMenu
import ServiceDisplay from "../../Components/ServiceDisplay/ServiceDisplay"; // Import ServiceDisplay
import AppDownload from "../../Components/AppDownload/AppDownload"; // Import AppDownload

// Backend URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Home = () => {
  const location = useLocation();
  const [notification, setNotification] = useState("");
  const [category, setCategory] = useState("All"); // Define category state

  useEffect(() => {
    if (location.state?.message) {
      setNotification(location.state.message);

      // Clear the notification after 5 seconds
      const timer = setTimeout(() => {
        setNotification("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [location.state]);

  return (
    <div className="home-page">
      {notification && (
        <div className="notification">
          <p>{notification}</p>
        </div>
      )}

      {/* Pass API_BASE_URL to child components if needed */}
      <Header apiUrl={API_BASE_URL} />
      <ExploreMenu category={category} setCategory={setCategory} apiUrl={API_BASE_URL} />
      <ServiceDisplay category={category} apiUrl={API_BASE_URL} />
      <AppDownload />
    </div>
  );
};

export default Home;
