import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/RegisterChoice');
  };

  return (
    <nav className="navbar">
      <button className="navbar-button">โปรโมชั่น</button>
      <div className="navbar-logo">MatchWeb</div>
      <div className="navbar-links">
        <button className="navbar-link" onClick={handleLoginClick}>เข้าสู่ระบบ</button>
        <button className="navbar-button" onClick={handleRegisterClick}>ลงทะเบียน</button>
      </div>
    </nav>
  );
};

export default Navbar;
