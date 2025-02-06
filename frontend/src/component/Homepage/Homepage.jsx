import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import HomepageOpera from '../HomepageOper/Homepageopera'; // นำเข้า HomepageOpera
import './Homepage.css';
import { FaSearch } from "react-icons/fa";
import { jwtDecode } from 'jwt-decode';

const Homepage = () => {
  const [decodedToken, setDecodedToken] = useState(null);
  const [loading, setLoading] = useState(true); // สำหรับแสดงสถานะการโหลด

  useEffect(() => {
    const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        setDecodedToken(decoded);
        console.log("✅ Token Decoded:", decoded);
      } catch (error) {
        console.error("❌ Error decoding token:", error);
        setDecodedToken(null);
      }
    } else {
      console.log("⚠ No token found in localStorage.");
    }

    setLoading(false); // จบการโหลด
  }, []);

  // รอให้โหลดข้อมูลเสร็จ
  if (loading) {
    return <div>Loading...</div>;
  }

  // เช็ค role จาก token ถ้าเป็น user ให้แสดง Homepage ถ้าไม่ใช่ให้แสดง HomepageOpera
  if ( !decodedToken || decodedToken.role === "user") {
    return (
      <div className="homepage-container">
        <Navbar />
        <div className="search-section">
          <input type="text" className="search-input" placeholder="ค้นหาสถานที่" />
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
  } else {
    return <HomepageOpera />; // แสดงหน้า HomepageOpera ถ้า role ไม่ใช่ user
  }
};

export default Homepage;
