import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Components/context/storeContext';
import './MyOrders.css';
import { motion } from 'framer-motion';
import { FaEnvelope, FaSearch, FaCheck, FaPrint, FaEye, FaShoppingBag, FaTruck } from 'react-icons/fa';
import { Container, Row, Col, Button, Spinner, Form, Modal, Badge } from "react-bootstrap";
import { BsClockHistory, BsBoxSeam, BsCheck2Circle } from "react-icons/bs";
import { MdOutlineDeliveryDining, MdCancel } from 'react-icons/md';

const MyOrders = () => {
  const { token } = useContext(StoreContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (token || storedEmail) {
      const email = storedEmail || '';
      setUserEmail(email);
      if (email) fetchOrders(email);
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchOrders = async (email) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`http://localhost:4000/api/orders/user/${email}`);
      setOrders(res.data || []);
    } catch (err) {
      setError('Failed to load orders. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!emailInput) return;
    setLoadingEmail(true);
    localStorage.setItem('userEmail', emailInput);
    setUserEmail(emailInput);
    fetchOrders(emailInput).finally(() => setLoadingEmail(false));
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setShowModal(false);
  };

  const getFilteredOrders = () => {
    switch(activeTab) {
      case 'active':
        return orders.filter(o => ['order_placed','confirmed','processing','dispatched','out_for_delivery'].includes(o.trackingStatus));
      case 'delivered':
        return orders.filter(o => o.trackingStatus === 'delivered');
      case 'cancelled':
        return orders.filter(o => o.trackingStatus === 'cancelled');
      default:
        return orders;
    }
  };

  const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '';

  const printOrder = () => {
    if (!selectedOrder) return;
    const w = window.open('', '_blank');
    w.document.write(`<h1>Order #${selectedOrder._id}</h1><p>Date: ${formatDate(selectedOrder.createdAt)}</p>`);
    w.print();
  };

  if (loading) return (
    <Container className="py-5 text-center">
      <Spinner animation="border" variant="primary" />
      <p>Loading orders...</p>
    </Container>
  );

  return (
    <Container className="my-5">
      {!userEmail ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="email-form">
          <h3>Enter Email to View Orders</h3>
          <Form onSubmit={handleEmailSubmit}>
            <Form.Group>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" disabled={loadingEmail}>
              {loadingEmail ? <Spinner size="sm" /> : 'Find My Orders'} <FaSearch />
            </Button>
          </Form>
        </motion.div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : getFilteredOrders().length === 0 ? (
        <NoOrders navigate={navigate} />
      ) : (
        <div className="orders-list">
          {getFilteredOrders().map(order => (
            <motion.div key={order._id} className="order-card" whileHover={{ scale: 1.02 }}>
              <Row>
                <Col>
                  <div>Order #{order._id?.substring(0,8)}</div>
                  <div>{formatDate(order.createdAt)}</div>
                </Col>
                <Col xs="auto">
                  <Badge bg="info">{order.trackingStatus?.replace('_',' ') || 'PROCESSING'}</Badge>
                </Col>
              </Row>
              <Button className="mt-3" onClick={() => viewOrderDetails(order)}>
                <FaEye /> View Details
              </Button>
            </motion.div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <OrderModal 
          order={selectedOrder} 
          show={showModal} 
          handleClose={closeModal} 
          printOrder={printOrder} 
        />
      )}
    </Container>
  );
};

// Simple NoOrders Component
const NoOrders = ({ navigate }) => (
  <div className="text-center py-5">
    <h3>No Orders Found</h3>
    <p>Place your first order to see it here.</p>
    <Button onClick={() => navigate('/')}>Shop Now</Button>
  </div>
);

// Order Details Modal
const OrderModal = ({ order, show, handleClose, printOrder }) => (
  <Modal show={show} onHide={handleClose} size="lg">
    <Modal.Header closeButton>
      <Modal.Title>Order #{order._id?.substring(0,8)}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>Status: {order.trackingStatus}</p>
      <p>Placed on: {new Date(order.createdAt).toLocaleString()}</p>
      <h5>Items:</h5>
      {order.orderItems?.map((item, idx) => (
        <div key={idx}>{item.name} x {item.quantity}</div>
      ))}
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>Close</Button>
      <Button variant="primary" onClick={printOrder}><FaPrint /> Print</Button>
    </Modal.Footer>
  </Modal>
);

export default MyOrders;
