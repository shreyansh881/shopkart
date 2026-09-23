import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthRoute = ['/login', '/register'].includes(location.pathname);

  const handleLogout = async () => {
    try {
      await api.post('/customers/logout');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
      navigate('/login');
    }
  };

  return (
    <header className="navbar">
      <div className="brand-wrap">
        <div className="brand-mark">S</div>
        <div>
          <p className="brand-name">ShopKart</p>
          <small>Customer portal</small>
        </div>
      </div>

      {!isAuthRoute && (
        <div className="nav-actions">
          <nav className="nav-links">
            <NavLink to="/home" className="nav-link">Home</NavLink>
            <NavLink to="/products" className="nav-link">Products</NavLink>
            <NavLink to="/wishlist" className="nav-link">Wishlist</NavLink>
          </nav>
          <button type="button" className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
