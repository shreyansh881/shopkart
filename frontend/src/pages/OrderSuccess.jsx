import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';

const OrderSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refreshCart } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const response = await api.get(`/orders/${id}`);
        setOrder(response.data.order);
        await refreshCart();
      } catch (error) {
        setError(error.response?.data?.message || 'Unable to load this order');
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [id, refreshCart]);

  if (loading) return <div className="state-box">Confirming your order...</div>;
  if (error) {
    return (
      <div className="state-box error-state">
        <h2>Order unavailable</h2>
        <p>{error}</p>
        <button type="button" className="primary-btn small-btn" onClick={() => navigate('/orders')}>My Orders</button>
      </div>
    );
  }

  return (
    <div className="success-page">
      <div className="success-icon">✓</div>
      <span className="eyebrow">Payment confirmed</span>
      <h1>Order Placed Successfully</h1>
      <p>Your order has been saved and your cart has been cleared.</p>
      <div className="success-details">
        <div><span>Order ID</span><strong>{order._id}</strong></div>
        <div><span>Total</span><strong>₹{order.totalAmount.toLocaleString('en-IN')}</strong></div>
        <div><span>Status</span><strong>{order.status}</strong></div>
      </div>
      <div className="success-actions">
        <Link to="/orders" className="primary-btn">View My Orders</Link>
        <Link to="/products" className="secondary-btn">Continue Shopping</Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
