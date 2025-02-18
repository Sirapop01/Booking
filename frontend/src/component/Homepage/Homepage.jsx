import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import HomepageOpera from '../HomepageOper/Homepageopera';
import './Homepage.css';
import { jwtDecode } from 'jwt-decode';
import ListCard from '../ListCard/ListCard';

const Homepage = () => {
  const [decodedToken, setDecodedToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimes, setSelectedTimes] = useState([]); // เปลี่ยนเป็น array
  const [showTimeModal, setShowTimeModal] = useState(false);

  const timeSlots = [
    '08:00-09:00', '09:00-10:00', '10:00-11:00',
    '11:00-12:00', '12:00-13:00', '13:00-14:00',
    '14:00-15:00', '15:00-16:00', '16:00-17:00',
    '17:00-18:00', '18:00-19:00', '19:00-20:00',
  ];

  useEffect(() => {
    const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        setDecodedToken(decoded);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    setLoading(false);
  }, []);

  const handleToggleTime = (time) => {
    // ถ้าเลือกเวลาเดิมให้เอาออก
    if (selectedTimes.includes(time)) {
      setSelectedTimes(selectedTimes.filter((t) => t !== time));
    } else {
      setSelectedTimes([...selectedTimes, time]);
    }
  };

  const handleConfirmTime = () => {
    setShowTimeModal(false); // ปิด Modal
  };

  if (loading) return <div>Loading...</div>;

  if (!decodedToken || decodedToken.role === 'customer') {
    return (
      <div className="homepage-container">
        <Navbar />
        <div className="search-section">
          <input type="text" className="search-input" placeholder="ค้นหาสถานที่" />
          <div className="date-time-container">
            <input type="date" className="date-input" />

            {/* ช่องเวลา */}
            <div className="time-input-container" onClick={() => setShowTimeModal(true)}>
              <input
                type="text"
                className="time-input-display"
                value={selectedTimes.length > 0 ? selectedTimes.join(', ') : ''}
                placeholder="เลือกเวลา"
                readOnly
              />
            </div>

            <select className="people-select-value">
              <option>จำนวน</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
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

        {/* Modal เลือกเวลา */}
        {showTimeModal && (
          <div className="time-modal-overlay" onClick={() => setShowTimeModal(false)}>
            <div className="time-modal" onClick={(e) => e.stopPropagation()}>
              {timeSlots.map((time) => (
                <button
                  key={time}
                  className={`time-slot-button ${selectedTimes.includes(time) ? 'selected' : ''}`}
                  onClick={() => handleToggleTime(time)}
                >
                  🕒 {time}
                </button>
              ))}
              <div className="confirm-button-wrapper">
                <button className="confirm-button-homepage" onClick={handleConfirmTime}>
                  ตกลง
                </button>
              </div>
            </div>
          </div>
        )}

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

        <ListCard />
      </div>
    );
  } else {
    return <HomepageOpera />;
  }
};

export default Homepage;
