import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Pages/Home/Home";
import Cart from "./Pages/Cart/Cart";
import PlaceOrder from "./Pages/PlaceOrder/PlaceOrder";
import Footer from "./Components/Footer/Footer";
// import { useSession } from "@descope/react-sdk";
import AuthPage from "./Pages/Auth/AuthPage"; // Authentication page
import MyOrders from "./Pages/MyOrders/MyOrders";
import Profile from "./Pages/Profile/Profile";

const App = () => {
  // Uncomment if using Descope session
  // const { isSessionLoading } = useSession();
  // if (isSessionLoading) return <p>Loading...</p>;

  return (
    <div className="app">
      {/* Navbar with proper padding */}
      <div style={{ padding: "0 100px" }}>
        <Navbar />
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<PlaceOrder />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/auth" element={<AuthPage />} /> {/* Authentication page */}
      </Routes>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
