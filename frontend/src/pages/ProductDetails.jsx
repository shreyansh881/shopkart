import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');
  const isInCart = cartItems.some((item) => item.product._id === id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.get(`/products/${id}`);
        setProduct(response.data.product);
      } catch (err) {
        setError('Something went wrong while loading the product.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="state-box">Loading product...</div>;
  if (error) return <div className="state-box error-state">{error}</div>;
  if (!product) return <div className="state-box empty-state">Product not found.</div>;

  const handleAddToCart = async () => {
    if (adding || product.stock < 1) return;
    setAdding(true);
    setMessage('');
    try {
      await addToCart(product._id);
      setMessage('✓ Added to Cart');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to add product to cart');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="details-page">
      <button type="button" className="back-btn" onClick={() => navigate('/products')}>
        ← Back to products
      </button>

      <div className="details-card">
        <img src={product.image} alt={product.name} className="details-image" />

        <div className="details-info">
          <span className="product-category">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="details-price">₹{product.price.toLocaleString('en-IN')}</p>
          <p className="details-description">{product.description}</p>

          <div className="details-meta">
            <div>
              <span>Stock</span>
              <strong>{product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</strong>
            </div>
          </div>

          <button type="button" className="primary-btn details-btn" onClick={handleAddToCart} disabled={adding || product.stock < 1}>
            {adding ? 'Adding...' : isInCart ? 'Add Another' : product.stock < 1 ? 'Out of Stock' : 'Add to Cart'}
          </button>
          {message && <div className="action-message success">{message}</div>}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
