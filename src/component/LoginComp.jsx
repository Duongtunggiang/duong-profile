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
        
        // Chuyển trang ngay lập tức, không dùng alert (alert có thể chặn navigation)
        // Sử dụng window.location để đảm bảo chuyển trang
        window.location.href = '/my-profile';
      } else {
        setError('Đăng nhập thất bại. Vui lòng thử lại.');
        setLoading(false);
      }
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <HeaderComp />
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Đăng Nhập</h1>
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
                placeholder="Nhập email của bạn"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Nhập mật khẩu"
              />
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
            </button>
          </form>
        </div>
      </div>
      <FooterComp contacts={[]} />
    </div>
  );
};

export default LoginComp;
