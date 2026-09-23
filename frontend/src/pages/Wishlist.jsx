import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/wishlist');
      setWishlist(response.data.wishlist || []);
    } catch (err) {
      setError('Unable to load wishlist.');
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleRemove = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      await fetchWishlist();
    } catch (err) {
      setError('Unable to remove product from wishlist.');
    }
  };

  if (loading) {
    return <div className="state-box">Loading your wishlist...</div>;
  }

  if (error) {
    return (
      <div className="state-box error-state">
        <div>
          <p>{error}</p>
          <button type="button" className="primary-btn small-btn" onClick={fetchWishlist}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="state-box empty-state">
        <div className="empty-wishlist">
          <div className="empty-heart">❤️</div>
          <h2>Your wishlist is empty</h2>
          <p>Save products you love and find them here later.</p>
          <button type="button" className="primary-btn small-btn" onClick={() => navigate('/products')}>
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <div>
          <span className="eyebrow">Saved items</span>
          <h1>My Wishlist</h1>
        </div>
        <div className="results-count">{wishlist.length} products saved</div>
      </div>

      <div className="wishlist-grid">
        {wishlist.map((product) => (
          <div key={product._id} className="wishlist-card">
            <img src={product.image} alt={product.name} className="wishlist-image" />

            <div className="wishlist-body">
              <h3>{product.name}</h3>
              <p className="product-price">₹{product.price.toLocaleString('en-IN')}</p>
              <span className="product-category">{product.category}</span>
              <p className="wishlist-stock">{product.stock > 0 ? `${product.stock} units left` : 'Out of stock'}</p>

              <div className="wishlist-actions">
                <button type="button" className="view-details-btn" onClick={() => navigate(`/products/${product._id}`)}>
                  View Details
                </button>
                <button type="button" className="remove-btn" onClick={() => handleRemove(product._id)}>
                  Remove from Wishlist
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
