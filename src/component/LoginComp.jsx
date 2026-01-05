import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/API';
import { setToken, setUser } from '../authen/authen';
import HeaderComp from './HeaderComp';
import FooterComp from './FooterComp';
import './LoginComp.css';

const LoginComp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(email, password);
      
      if (response.access_token) {
        setToken(response.access_token);
        setUser(response.user);
        
        // Navigate immediately, don't use alert (alert can block navigation)
        // Use window.location to ensure navigation
        window.location.href = '/my-profile';
      } else {
        setError('Login failed. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your information.');
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <HeaderComp />
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Login</h1>
          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
              />
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
      <FooterComp contacts={[]} />
    </div>
  );
};

export default LoginComp;
