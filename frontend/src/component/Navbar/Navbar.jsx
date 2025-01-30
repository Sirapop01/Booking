import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
      setUsername(user);
    }
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/RegisterChoice');
  };

  const handlePromotionClick = () => {
    navigate('/promotion');
  };

  const handleFavoritesClick = () => {
    navigate('/favorites');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUsername('');
    navigate('/');
  };

  return (
    <nav className="navbar-homepage">
      <div className="navbar-left">
        {isLoggedIn && (
          <button className="navbar-button-homepage" onClick={handleFavoritesClick}>
            รายการโปรด
          </button>
        )}
        <button className="navbar-button-homepage" onClick={handlePromotionClick}>
          โปรโมชั่น
        </button>
      </div>
      <div className="navbar-center">
        <img src={logo} alt="logo" className="navbar-logo-img-homepage" />
        <span className="navbar-title">MatchWeb</span>
      </div>
      <div className="navbar-links">
        {isLoggedIn ? (
          <div className="navbar-user">
            <span className="username">{username}</span>
            <button className="menu-icon" onClick={handleLogout}>☰</button>
          </div>
        ) : (
          <>
            <button className="navbar-link" onClick={handleLoginClick}>
              เข้าสู่ระบบ
            </button>
            <button className="navbar-button" onClick={handleRegisterClick}>
              ลงทะเบียน
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
