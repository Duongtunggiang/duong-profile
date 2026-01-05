import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated, logout } from '../authen/authen';
import './HeaderComp.css';

const HeaderComp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const authenticated = isAuthenticated();
  
  // Ẩn nút đăng nhập trên trang chủ (profile)
  const isProfilePage = location.pathname === '/' || location.pathname === '/profile';
  const showLoginButton = !isProfilePage;

  const handleLogout = () => {
    logout();
    navigate('/');
    window.location.reload();
  };

  return (
    <header className="header-container">
      <div className="header-content">
        <Link to="/" className="header-logo">
          <span className="logo-icon">✨</span>
          <span className="logo-text">My Profile</span>
        </Link>

        <nav className="header-nav">
          <Link to="/" className="nav-link">
            Trang Chủ
          </Link>
          
          {authenticated ? (
            <>
              <Link to="/my-profile" className="nav-link">
                Hồ Sơ Của Tôi
              </Link>
              <button onClick={handleLogout} className="nav-button">
                Đăng Xuất
              </button>
            </>
          ) : (
            showLoginButton && (
              <Link to="/login" className="nav-link nav-link-primary">
                Đăng Nhập
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
};

export default HeaderComp;
