import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/customers/me');
        setUser(response.data);
      } catch (error) {
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return <div className="status-box">Loading your profile...</div>;
  }

  if (!user) {
    return <div className="status-box">Unable to load profile.</div>;
  }

  return (
    <div className="home-page">
      <div className="home-card">
        <span className="eyebrow">Account overview</span>
        <h1>Welcome back, {user.fullName}!</h1>

        <div className="user-grid">
          <div className="info-card">
            <span>Name</span>
            <strong>{user.fullName}</strong>
          </div>
          <div className="info-card">
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>
          <div className="info-card">
            <span>Phone</span>
            <strong>{user.phone}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
