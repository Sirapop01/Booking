import React, { useState, useEffect } from 'react';
import './BookingArena.css';
import axios from 'axios';

const BookingArena = () => {
  const [arenas, setArenas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:4000/api/arenas/getArenas')
      .then(response => {
        setArenas(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching arenas:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading-text">กำลังโหลดข้อมูล...</div>;
  }

  if (arenas.length === 0) {
    return <div className="loading-text">ไม่พบข้อมูลสนามกีฬา</div>;
  }

  return (
    <div className="booking-arena-container">
      {arenas.map((arena) => (
        <div key={arena._id} className="arena-card">
          {/* รูปสนามหลัก */}
          <div className="main-image-container">
            <img
              src={arena.images.length > 0 ? arena.images[0] : 'https://via.placeholder.com/400'}
              alt={arena.fieldName}
              className="main-image"
            />
          </div>

          {/* ข้อมูลสนาม */}
          <div className="arena-info-container">
            <div className="arena-left-section">
              <h2 className="arena-title">{arena.fieldName}</h2>
              <div className="arena-meta">
                <span className="star">⭐ 5.0</span>
                <span className="distance-tag">📍 20.2 กม</span>
                <span>{arena.additionalInfo}</span>
              </div>

              <div className="google-map-box">
                {arena.location?.coordinates?.length === 2 && (
                  <iframe
                    src={`https://www.google.com/maps?q=${arena.location.coordinates[1]},${arena.location.coordinates[0]}&z=14&output=embed`}
                    title="Google Maps"
                    className="google-map"
                    allowFullScreen
                    loading="lazy"
                  />
                )}
              </div>

              <div className="amenities-section">
                <h3>สิ่งอำนวยความสะดวก</h3>
                <div className="amenities-list">
                  {arena.amenities.map((item, index) => (
                    <span key={index} className="amenity-item">✅ {item}</span>
                  ))}
                </div>
              </div>

              <div className="booking-conditions">
                <h3>เงื่อนไขการจอง</h3>
                <p>เวลาเปิดทำการ: {arena.startTime} - {arena.endTime}</p>
                <p>{arena.additionalInfo}</p>
              </div>
            </div>

            {/* รูปสนามย่อย */}
            <div className="sub-stadiums">
              {arena.images.slice(1).map((img, index) => (
                <div key={index} className="sub-stadium-card">
                  <img src={img} alt={`สนามย่อย ${index + 1}`} />
                  <p>สนามบาสเกตบอล {index + 1}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ปุ่มจองเลย */}
          <button className="booking-button">จองเลย</button>
        </div>
      ))}
    </div>
  );
};

export default BookingArena;
