import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, loading, error, subtotal, itemCount, refreshCart } = useCart();

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  if (loading) return <div className="state-box">Loading your cart...</div>;
  if (error) {
    return (
      <div className="state-box error-state">
        <div>
          <p>{error}</p>
          <button type="button" className="primary-btn small-btn" onClick={refreshCart}>Try Again</button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="state-box empty-state">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <Link to="/products" className="primary-btn small-btn">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <div>
          <span className="eyebrow">Shopping cart</span>
          <h1>My Cart</h1>
        </div>
        <div className="results-count">{itemCount} {itemCount === 1 ? 'item' : 'items'}</div>
      </div>

      <div className="cart-layout">
        <div className="cart-items-list">
          {cartItems.map((item) => (
            <CartItem key={item.product._id} item={item} />
          ))}
        </div>

        <aside className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Items ({itemCount})</span>
            <strong>₹{subtotal.toLocaleString('en-IN')}</strong>
          </div>
          <div className="summary-note">Delivery and taxes are calculated at checkout.</div>
          <button type="button" className="primary-btn checkout-btn" onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </button>
          <small className="summary-note">Secure Razorpay Test Mode checkout</small>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
