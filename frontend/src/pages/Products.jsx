import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const categories = ['All Categories', 'Electronics', 'Fashion', 'Books', 'Home'];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (category && category !== 'All Categories') params.set('category', category);

      const response = await api.get('/products', { params });
      setProducts(response.data.products || []);
    } catch (err) {
      setError('Something went wrong while loading products.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, category]);

  const activeCount = useMemo(() => products.length, [products]);

  return (
    <div className="products-page">
      <div className="products-header">
        <div>
          <span className="eyebrow">Discover</span>
          <h1>ShopKart Products</h1>
        </div>
        <div className="results-count">{activeCount} products</div>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search products..."
          className="search-input"
        />

        <select value={category} onChange={(event) => setCategory(event.target.value)} className="category-select">
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="state-box">Loading products...</div>
      ) : error ? (
        <div className="state-box error-state">{error}</div>
      ) : products.length === 0 ? (
        <div className="state-box empty-state">No products found.</div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
