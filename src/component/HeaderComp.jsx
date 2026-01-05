import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated, logout } from '../authen/authen';
import './HeaderComp.css';

const HeaderComp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const authenticated = isAuthenticated();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Hide login button on home page (profile)
  const isProfilePage = location.pathname === '/' || location.pathname === '/profile';
  const showLoginButton = !isProfilePage;

  const handleLogout = () => {
    logout();
    navigate('/');
    window.location.reload();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="header-container">
      <div className="header-content">
        <Link to="/" className="header-logo">
          <span className="logo-icon">✨</span>
          <span className="logo-text">My Profile</span>
        </Link>

        {authenticated && (
          <button 
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        )}

        <nav className={`header-nav ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
          {!isProfilePage && (
            <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
          )}
          
          {authenticated ? (
            <>
              <Link to="/my-profile" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                My Profile
              </Link>
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }} 
                className="nav-button"
              >
                Logout
              </button>
            </>
          ) : (
            showLoginButton && (
              <Link to="/login" className="nav-link nav-link-primary" onClick={() => setMobileMenuOpen(false)}>
                Login
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
};

export default HeaderComp;
