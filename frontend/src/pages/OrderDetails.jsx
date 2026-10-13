import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';

const formatDate = (value) => new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
}).format(new Date(value));

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const response = await api.get(`/orders/${id}`);
        setOrder(response.data.order);
      } catch (error) {
        setError(error.response?.data?.message || 'Unable to load this order');
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [id]);

  if (loading) return <div className="state-box">Loading order details...</div>;
  if (error) return <div className="state-box error-state"><p>{error}</p></div>;
  if (!order) return <div className="state-box empty-state">Order not found.</div>;

  return (
    <div className="order-details-page">
      <Link to="/orders" className="back-link">← Back to My Orders</Link>
      <div className="order-details-header">
        <div><span className="eyebrow">Order details</span><h1>Order #{order._id}</h1><p>Placed on {formatDate(order.createdAt)}</p></div>
        <span className={`status-badge status-${order.status.toLowerCase()}`}>{order.status}</span>
      </div>
      <div className="order-details-grid">
        <section className="order-detail-card">
          <h2>Items</h2>
          {order.items.map((item) => (
            <div className="order-detail-item" key={`${item.product}-${item.name}`}>
              <img src={item.image || '/placeholder.png'} alt={item.name} />
              <div><strong>{item.name}</strong><span>Quantity: {item.quantity}</span></div>
              <strong>₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong>
            </div>
          ))}
        </section>
        <aside className="order-detail-card order-address-card">
          <h2>Shipping Address</h2>
          <p><strong>{order.shippingAddress.fullName}</strong></p>
          <p>{order.shippingAddress.addressLine1}</p>
          <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
          <p>Phone: {order.shippingAddress.phone}</p>
          <div className="details-total"><span>Total Amount</span><strong>₹{order.totalAmount.toLocaleString('en-IN')}</strong></div>
        </aside>
      </div>
    </div>
  );
};

export default OrderDetails;
