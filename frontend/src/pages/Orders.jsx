import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const formatDate = (value) => new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
}).format(new Date(value));

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await api.get('/orders');
        setOrders(response.data.orders || []);
      } catch (error) {
        setError(error.response?.data?.message || 'Unable to load your orders');
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  if (loading) return <div className="state-box">Loading your orders...</div>;
  if (error) return <div className="state-box error-state"><p>{error}</p></div>;

  if (orders.length === 0) {
    return (
      <div className="state-box empty-state">
        <div className="empty-cart">
          <div className="empty-cart-icon">📦</div>
          <h2>No orders yet</h2>
          <p>You have not placed any orders yet.</p>
          <Link to="/products" className="primary-btn small-btn">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-heading">
        <div><span className="eyebrow">Order history</span><h1>My Orders</h1></div>
        <Link to="/products" className="primary-btn small-btn">Continue Shopping</Link>
      </div>
      <div className="orders-list">
        {orders.map((order) => (
          <article className="order-card" key={order._id}>
            <div className="order-card-main">
              <div>
                <span className="order-id">Order #{order._id}</span>
                <span className="order-date">{formatDate(order.createdAt)}</span>
              </div>
              <span className={`status-badge status-${order.status.toLowerCase()}`}>{order.status}</span>
            </div>
            <div className="order-items">
              {order.items.map((item) => (
                <span key={`${item.product}-${item.name}`}>{item.quantity} × {item.name}</span>
              ))}
            </div>
            <div className="order-card-footer">
              <strong>Total: ₹{order.totalAmount.toLocaleString('en-IN')}</strong>
              <button type="button" className="secondary-btn" onClick={() => navigate(`/orders/${order._id}`)}>View Details</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Orders;
