import React, { useState, useEffect, useContext } from 'react';
import { StoreContext } from '../../Components/context/storeContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const { token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName: '',
    email: localStorage.getItem('userEmail') || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [orders, setOrders] = useState([]);

  // Load user profile & orders
  useEffect(() => {
    if (!token) return navigate('/auth');

    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) setUserProfile(prev => ({ ...prev, email: savedEmail }));

    fetchUserOrders();
    setLoading(false);
  }, [token]);

  const fetchUserOrders = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      if (!email) return;

      const response = await axios.get(`http://localhost:4000/api/orders/user/${email}`);
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setMessage({ type: 'error', text: 'Failed to load orders.' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setUserProfile(prev => ({ ...prev, [name]: value }));
  };

  const toggleEdit = () => setIsEditing(!isEditing);

  const saveProfile = async e => {
    e.preventDefault();

    try {
      // In real app: API call to update profile
      localStorage.setItem('userEmail', userProfile.email);

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Failed to update profile.' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setToken('');
    navigate('/');
  };

  const formatDate = dateString =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  if (loading) return <div className="profile-loading">Loading your profile...</div>;

  return (
    <div className="profile-container">
      <h2>My Profile</h2>

      {message && <div className={`message ${message.type}`}>{message.text}</div>}

      <div className="profile-grid">
        {/* Personal Info Section */}
        <div className="profile-section">
          <div className="profile-header">
            <h3>Personal Information</h3>
            <button className="edit-button" onClick={toggleEdit}>
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          <form onSubmit={saveProfile}>
            <div className="form-grid">
              {[
                { label: 'First Name', name: 'firstName', required: true },
                { label: 'Last Name', name: 'lastName', required: true },
                { label: 'Email', name: 'email', type: 'email', required: true },
                { label: 'Phone', name: 'phone' },
                { label: 'Street', name: 'street' },
                { label: 'City', name: 'city' },
                { label: 'State', name: 'state' },
                { label: 'Pincode', name: 'pincode' },
              ].map(field => (
                <div className="form-group" key={field.name}>
                  <label>{field.label}</label>
                  <input
                    type={field.type || 'text'}
                    name={field.name}
                    value={userProfile[field.name]}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    required={field.required || false}
                  />
                </div>
              ))}
            </div>

            {isEditing && (
              <div className="form-actions">
                <button type="submit" className="save-button">
                  Save Changes
                </button>
              </div>
            )}
          </form>

          <div className="logout-section">
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="recent-orders-section">
          <h3>Recent Orders</h3>

          {orders.length === 0 ? (
            <p>You don't have any orders yet.</p>
          ) : (
            <div className="recent-orders-list">
              {orders.slice(0, 5).map(order => (
                <div key={order._id} className="order-card-small">
                  <div className="order-header-small">
                    <span>Order #{order.orderId}</span>
                    <span className={`order-status-small ${order.trackingStatus}`}>
                      {order.trackingStatus.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="order-details-small">
                    <p>
                      <strong>Date:</strong> {formatDate(order.createdAt)}
                    </p>
                    <p>
                      <strong>Amount:</strong> ₹{order.amount}
                    </p>
                  </div>
                  <button onClick={() => navigate('/my-orders')}>View Details</button>
                </div>
              ))}

              {orders.length > 5 && (
                <div className="view-all">
                  <button onClick={() => navigate('/my-orders')}>View All Orders</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
