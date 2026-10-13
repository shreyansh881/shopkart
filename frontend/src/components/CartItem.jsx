import { useState } from 'react';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const [updating, setUpdating] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleQuantityChange = async (nextQuantity) => {
    if (updating || nextQuantity < 1) return;
    setUpdating(true);
    try {
      await updateQuantity(item.product._id, nextQuantity);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (removing) return;
    setRemoving(true);
    try {
      await removeFromCart(item.product._id);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <article className="cart-item">
      <img src={item.product.image} alt={item.product.name} className="cart-item-image" />
      <div className="cart-item-details">
        <div>
          <span className="product-category">{item.product.category || 'ShopKart'}</span>
          <h3>{item.product.name}</h3>
          <p className="cart-item-price">₹{item.product.price.toLocaleString('en-IN')} each</p>
        </div>

        <div className="cart-item-controls">
          <div className="quantity-control" aria-label={`Quantity for ${item.product.name}`}>
            <button type="button" onClick={() => handleQuantityChange(item.quantity - 1)} disabled={updating} aria-label="Decrease quantity">
              −
            </button>
            <span>{item.quantity}</span>
            <button type="button" onClick={() => handleQuantityChange(item.quantity + 1)} disabled={updating || item.quantity >= item.product.stock} aria-label="Increase quantity">
              +
            </button>
          </div>
          <button type="button" className="remove-btn" onClick={handleRemove} disabled={removing}>
            {removing ? 'Removing...' : 'Remove'}
          </button>
        </div>
      </div>
      <strong className="cart-item-total">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</strong>
    </article>
  );
};

export default CartItem;
