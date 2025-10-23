import React, { useContext, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../Components/context/storeContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { cartItems, getTotalCartAmount, clearCart, token } = useContext(StoreContext);
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    email: localStorage.getItem("userEmail") || "",
    street: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
    phone: "",
    serviceDate: "",
  });

  const totalAmount = getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 200;

  // Handle all input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // For service date, prevent past dates
    if (name === "serviceDate") {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        alert("You cannot select a date from the past.");
        return;
      }
    }

    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (Object.keys(cartItems).length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const services = Object.keys(cartItems).map((key) => ({
      name: key,
      quantity: cartItems[key],
    }));

    try {
      // Create Razorpay order
      const { data } = await axios.post("http://localhost:4000/api/orders/create-order", {
        amount: totalAmount,
      });

      const options = {
        key: "rzp_test_ckOaggIIemTmet",
        amount: data.amount,
        currency: "INR",
        name: "Homease Services",
        description: "Service Payment",
        order_id: data.id,
        handler: async function (response) {
          alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);

          // Verify payment and store order
          const verifyResponse = await axios.post(
            "http://localhost:4000/api/orders/verify-payment",
            {
              orderId: data.id,
              paymentId: response.razorpay_payment_id,
              userDetails,
              services,
              amount: totalAmount,
            }
          );

          // Store user's email in localStorage for order tracking
          localStorage.setItem("userEmail", userDetails.email);

          console.log("OTP for admin:", verifyResponse.data.otp);
          alert("An OTP has been sent to your email for verification.");

          clearCart();
          navigate("/", { state: { message: "Your service has been booked successfully!" } });
        },
        prefill: {
          name: `${userDetails.firstName} ${userDetails.lastName}`,
          email: userDetails.email,
          contact: userDetails.phone,
        },
        theme: { color: "#FF5733" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error in payment:", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <form className="place-order" onSubmit={handlePayment}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-field">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={userDetails.firstName}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={userDetails.lastName}
            onChange={handleInputChange}
            required
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={userDetails.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="street"
          placeholder="Street"
          value={userDetails.street}
          onChange={handleInputChange}
          required
        />

        <div className="multi-field">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={userDetails.city}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="district"
            placeholder="District"
            value={userDetails.district}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="multi-field">
          <input
            type="text"
            name="state"
            placeholder="State"
            value={userDetails.state}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={userDetails.pincode}
            onChange={handleInputChange}
            required
          />
        </div>

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={userDetails.phone}
          onChange={handleInputChange}
          required
        />

        <label>Select Service Date:</label>
        <input
          type="date"
          name="serviceDate"
          value={userDetails.serviceDate}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>Rs. {getTotalCartAmount()}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <p>Service charges</p>
            <p>Rs. {getTotalCartAmount() === 0 ? 0 : 200}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <b>Total</b>
            <b> Rs. {totalAmount}</b>
          </div>
          <button type="submit" disabled={getTotalCartAmount() === 0}>
            PROCEED TO PAYMENT
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
