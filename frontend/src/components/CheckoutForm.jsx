import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import loadRazorpay from '../services/razorpay';

const initialAddress = {
  fullName: '',
  phone: '',
  addressLine1: '',
  city: '',
  state: '',
  pincode: '',
};

const CheckoutForm = () => {
  const navigate = useNavigate();
  const { cartItems, subtotal, itemCount, refreshCart } = useCart();
  const [shippingAddress, setShippingAddress] = useState(initialAddress);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const validate = () => {
    const nextErrors = {};
    if (!shippingAddress.fullName.trim()) nextErrors.fullName = 'Full name is required';
    if (!/^\d{10}$/.test(shippingAddress.phone.replace(/\s/g, ''))) nextErrors.phone = 'Enter a valid 10-digit phone number';
    if (!shippingAddress.addressLine1.trim()) nextErrors.addressLine1 = 'Address is required';
    if (!shippingAddress.city.trim()) nextErrors.city = 'City is required';
    if (!shippingAddress.state.trim()) nextErrors.state = 'State is required';
    if (!/^\d{6}$/.test(shippingAddress.pincode.trim())) nextErrors.pincode = 'Pincode must contain 6 digits';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setShippingAddress((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setPaymentError('');
  };

  const verifyPayment = async (paymentResponse, shopKartOrderId) => {
    const response = await api.post('/orders/verify-payment', {
      shopKartOrderId,
      razorpay_order_id: paymentResponse.razorpay_order_id,
      razorpay_payment_id: paymentResponse.razorpay_payment_id,
      razorpay_signature: paymentResponse.razorpay_signature,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Payment verification failed');
    }

    await refreshCart();
    navigate(`/order-success/${response.data.order._id}`, { replace: true });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    if (cartItems.length === 0) {
      setPaymentError('Your cart is empty. Add at least one product before checkout.');
      return;
    }

    setSubmitting(true);
    setPaymentError('');

    try {
      const response = await api.post('/orders/create-payment-order', { shippingAddress });
      const Razorpay = await loadRazorpay();
      const payment = new Razorpay({
        key: response.data.key,
        amount: response.data.amount,
        currency: response.data.currency,
        name: 'ShopKart',
        description: 'ShopKart order',
        order_id: response.data.razorpayOrderId,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/ShopKart_logo.svg/1200px-ShopKart_logo.svg.png',
        prefill: {
          name: shippingAddress.fullName,
          contact: shippingAddress.phone,
        },
        theme: { color: '#4f46e5' },
        handler: async (paymentResponse) => {
          try {
            await verifyPayment(paymentResponse, response.data.shopKartOrderId);
          } catch (error) {
            setPaymentError(error.response?.data?.message || error.message || 'Payment verification failed');
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
          },
        },
      });

      payment.open();
    } catch (error) {
      setPaymentError(error.response?.data?.message || error.message || 'Unable to start checkout');
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-heading">
        <span className="eyebrow">Secure checkout</span>
        <h1>Shipping Details</h1>
        <p>Complete your details. Your cart and prices will be validated on the server.</p>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <section className="form-section">
            <h2>Delivery Address</h2>
            <div className="form-grid">
              <label className="form-field full-width">
                <span>Full Name</span>
                <input name="fullName" value={shippingAddress.fullName} onChange={handleChange} placeholder="Enter full name" />
                {errors.fullName && <small className="field-error">{errors.fullName}</small>}
              </label>
              <label className="form-field">
                <span>Phone Number</span>
                <input name="phone" inputMode="numeric" value={shippingAddress.phone} onChange={handleChange} placeholder="10-digit number" />
                {errors.phone && <small className="field-error">{errors.phone}</small>}
              </label>
              <label className="form-field">
                <span>Pincode</span>
                <input name="pincode" inputMode="numeric" value={shippingAddress.pincode} onChange={handleChange} placeholder="6-digit pincode" />
                {errors.pincode && <small className="field-error">{errors.pincode}</small>}
              </label>
              <label className="form-field full-width">
                <span>Address Line 1</span>
                <input name="addressLine1" value={shippingAddress.addressLine1} onChange={handleChange} placeholder="House number, street, landmark" />
                {errors.addressLine1 && <small className="field-error">{errors.addressLine1}</small>}
              </label>
              <label className="form-field">
                <span>City</span>
                <input name="city" value={shippingAddress.city} onChange={handleChange} placeholder="City" />
                {errors.city && <small className="field-error">{errors.city}</small>}
              </label>
              <label className="form-field">
                <span>State</span>
                <input name="state" value={shippingAddress.state} onChange={handleChange} placeholder="State" />
                {errors.state && <small className="field-error">{errors.state}</small>}
              </label>
            </div>
          </section>

          {paymentError && <div className="checkout-error">{paymentError}</div>}
          <button type="submit" className="primary-btn checkout-submit" disabled={submitting || itemCount === 0}>
            {submitting ? 'Creating secure payment order...' : 'Place Order with Razorpay'}
          </button>
          <p className="secure-note">🔒 Payment is processed in Razorpay Test Mode. No card details are stored by ShopKart.</p>
        </form>

        <aside className="checkout-summary">
          <h2>Order Summary</h2>
          <div className="checkout-items">
            {cartItems.map((item) => (
              <div className="checkout-item" key={item.product._id}>
                <img src={item.product.image} alt={item.product.name} />
                <div>
                  <strong>{item.product.name}</strong>
                  <span>Qty: {item.quantity}</span>
                </div>
                <strong>₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</strong>
              </div>
            ))}
          </div>
          <div className="checkout-total">
            <span>Total</span>
            <strong>₹{subtotal.toLocaleString('en-IN')}</strong>
          </div>
          <div className="checkout-total-detail">{itemCount} {itemCount === 1 ? 'item' : 'items'} · Server-calculated total</div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutForm;
