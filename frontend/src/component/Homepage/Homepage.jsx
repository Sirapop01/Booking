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
    <div className="homepage-container">
      {/* ส่วน Navbar */}
      <nav className="navbar">
        <button className="navbar-button">โปรโมชั่น</button>
        <div className="navbar-logo">
          <img src={logo} alt="logo" className="navbar-logo-img" />
          MatchWeb
        </div>
        <div className="navbar-links">
          <button className="navbar-link" onClick={handleLoginClick}>
            เข้าสู่ระบบ
          </button>
          <button className="navbar-button" onClick={handleRegisterClick}>
            ลงทะเบียน
          </button>
        </div>
      </nav>

      {/* ส่วนค้นหาสถานที่ วันเวลา จำนวน */}
      <div className="search-section">
        <input 
          type="text" 
          className="search-input" 
          placeholder="ค้นหาสถานที่" 
        />

        <div className="date-time-container">
          <input 
            type="text" 
            className="date-input" 
            placeholder="xx/xx/xxxx"
          />
          <input 
            type="text" 
            className="time-input" 
            placeholder="xx:xx-xx:xx"
          />

          <select className="people-select">
            <option>จำนวน</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>

          <div className="booking-status">
            <label>
              <input type="radio" name="booking" defaultChecked />
              จองได้
            </label>
            <label>
              <input type="radio" name="booking" />
              แสดงทั้งหมด
            </label>
          </div>

          <button className="search-button">ค้นหา</button>
        </div>
      </div>

      {/* ส่วนไอคอนกีฬา (ใช้อีโมจิแทนการใช้ react-icons) */}
      <div className="sports-icons">
        <button className="sport-btn">⚽</button>
        <button className="sport-btn">🏀</button>
        <button className="sport-btn">🏸</button>
        <button className="sport-btn">🎾</button>
        <button className="sport-btn">🏐</button>
        <button className="sport-btn">🏓</button>
        <button className="sport-btn">🥊</button>
        <button className="sport-btn">🎳</button>
        <button className="sport-btn">⛳</button>
        <button className="sport-btn">...</button>
      </div>
    </div>
  );
};

export default Homepage;
