import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState('');

  const handleWishlist = async () => {
    if (saving) return;

    try {
      setSaving(true);
      setMessage('');
      await api.post(`/wishlist/${product._id}`);
      setSaved(true);
      setMessage('♥ Added to Wishlist');
    } catch (error) {
      const status = error.response?.status;
      if (status === 409) {
        setSaved(true);
        setMessage('♥ Added to Wishlist');
      } else {
        setMessage('Unable to save product. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />
      <div className="product-body">
        <div className="product-meta-row">
          <span className="product-category">{product.category}</span>
          <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
            {product.stock > 0 ? `${product.stock} units left` : 'Out of stock'}
          </span>
        </div>

        <h3>{product.name}</h3>
        <p className="product-price">₹{product.price.toLocaleString('en-IN')}</p>

        <div className="card-actions">
          <button type="button" className="view-details-btn" onClick={() => navigate(`/products/${product._id}`)}>
            View Details
          </button>

          <button type="button" className={`wishlist-btn ${saved ? 'saved' : ''}`} onClick={handleWishlist} disabled={saving}>
            {saving ? '⏳ Saving...' : saved ? '♥ Added to Wishlist' : '♡ Add to Wishlist'}
          </button>
        </div>

        {message && <div className={`wishlist-message ${saved ? 'success' : 'error'}`}>{message}</div>}
      </div>
    </div>
  );
};

export default ProductCard;
