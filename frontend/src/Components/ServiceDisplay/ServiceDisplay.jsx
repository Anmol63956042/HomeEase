import React, { useContext } from "react";
import "./ServiceDisplay.css";
import { StoreContext } from "../context/storeContext";
import ServiceItem from "../ServiceItem/ServiceItem";

const ServiceDisplay = ({ category }) => {
  const { serviceList } = useContext(StoreContext); // updated to match context

  // Filter services based on selected category
  const filteredServices = serviceList.filter(
    (item) => category === "All" || item.category === category
  );

  return (
    <section className="service-display" id="service-display">
      <h2>Top Services Near You!</h2>

      <div className="service-display-list">
        {filteredServices.length > 0 ? (
          filteredServices.map((item) => (
            <ServiceItem
              key={item._id}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
            />
          ))
        ) : (
          <p className="no-services-message">
            No services found for the selected category.
          </p>
        )}
      </div>
    </section>
  );
};

export default ServiceDisplay;
