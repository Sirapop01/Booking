import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';
import logo from '../assets/logo.png';

const Homepage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/RegisterChoice');
  };

  return (

    <div className="homepage">
      {/* Navbar Section */}
      <nav className="homepage-navbar">
        <button className="homepage-navbar-promo-btn">โปรโมชั่น</button>
        <div className="homepage-navbar-logo">
          <img src={logo} alt="logo" className="homepage-logo-img" />
          MatchWeb
        </div>
        <div className="homepage-navbar-actions">
          <button className="homepage-login-btn" onClick={handleLoginClick}>
            เข้าสู่ระบบ
          </button>
          <button className="homepage-register-btn" onClick={handleRegisterClick}>
            ลงทะเบียน
          </button>
        </div>
      </nav>

      {/* Search Section */}
      <div className="homepage-search-section">
        <input 
          type="text" 
          className="homepage-search-input" 
          placeholder="ค้นหาสถานที่" 
        />

        <div className="homepage-date-time">
          <input 
            type="text" 
            className="homepage-date-input" 
            placeholder="xx/xx/xxxx"
          />
          <input 
            type="text" 

            className="homepage-time-input" 
            placeholder="xx:xx-xx:xx"
          />

          <select className="homepage-people-select">
            <option>จำนวน</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>


          <div className="homepage-booking-options">
            <label>
              <input type="radio" name="booking" defaultChecked />
              จองได้
            </label>
            <label>
              <input type="radio" name="booking" />
              แสดงทั้งหมด
            </label>
          </div>


          <button className="homepage-search-btn">ค้นหา</button>
        </div>
      </div>

      {/* Sports Icons Section */}
      <div className="homepage-sports-icons">
        <button className="homepage-sport-icon">⚽</button>
        <button className="homepage-sport-icon">🏀</button>
        <button className="homepage-sport-icon">🏸</button>
        <button className="homepage-sport-icon">🎾</button>
        <button className="homepage-sport-icon">🏐</button>
        <button className="homepage-sport-icon">🏓</button>
        <button className="homepage-sport-icon">🥊</button>
        <button className="homepage-sport-icon">🎳</button>
        <button className="homepage-sport-icon">⛳</button>
        <button className="homepage-sport-icon">...</button>
      </div>
    </div>
  );
};

export default Homepage;
