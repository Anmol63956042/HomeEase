import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [serviceList, setServiceList] = useState([]);
  const [token, setToken] = useState("");

  // Base URL from environment variable or fallback to localhost
  const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";

  // Create an axios instance with base URL
  const api = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
  });

  // Fetch all services
  const fetchServiceList = async () => {
    try {
      const response = await api.get("/api/service/list");
      setServiceList(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch service list:", error);
    }
  };

  // Load cart data for logged-in user
  const loadCartData = async (userToken) => {
    if (!userToken) return;
    try {
      const response = await api.post(
        "/api/cart/get",
        {},
        { headers: { token: userToken } }
      );
      setCartItems(response.data.cartData || {});
    } catch (error) {
      console.error("Failed to load cart data:", error);
    }
  };

  // Add item to cart
  const addToCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));

    if (!token) return;
    try {
      await api.post("/api/cart/add", { itemId }, { headers: { token } });
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const newQty = (prev[itemId] || 0) - 1;
      return newQty > 0
        ? { ...prev, [itemId]: newQty }
        : Object.fromEntries(Object.entries(prev).filter(([key]) => key !== itemId));
    });

    if (!token) return;
    try {
      await api.post("/api/cart/remove", { itemId }, { headers: { token } });
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    setCartItems({});
    if (!token) return;
    try {
      await api.post("/api/cart/clear", {}, { headers: { token } });
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  // Calculate total cart amount
  const getTotalCartAmount = () => {
    return Object.entries(cartItems).reduce((total, [itemId, qty]) => {
      const item = serviceList.find((s) => s._id === itemId);
      return item ? total + item.price * qty : total;
    }, 0);
  };

  // Initial data load
  useEffect(() => {
    const initialize = async () => {
      await fetchServiceList();

      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        await loadCartData(savedToken);
      }
    };

    initialize();
  }, []);

  const contextValue = {
    serviceList,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    clearCart,
    token,
    setToken,
    BASE_URL,
  };

  return <StoreContext.Provider value={contextValue}>{children}</StoreContext.Provider>;
};

export default StoreContextProvider;
