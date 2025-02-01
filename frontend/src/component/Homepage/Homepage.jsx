import React from 'react';
import Navbar from '../Navbar/Navbar'; // นำ Navbar มาใช้
import './Homepage.css';
import { FaSearch } from "react-icons/fa";

const Homepage = () => {
  return (
    <div className="homepage-container">
      {/* เรียกใช้ Navbar ที่แยกออกมา */}
      <Navbar />

      {/* ส่วนค้นหาสถานที่ วันเวลา จำนวน */}
      
      <div className="search-section">
        <input 
          type="text" 
          className="search-input" 
          placeholder="ค้นหาสถานที่" 
        />

        <div className="date-time-container">
          <input type="date" className="date-input" />
          <input type="time" className="time-input" />

          <select className="people-select-value">
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

      {/* ส่วนไอคอนกีฬา */}
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
