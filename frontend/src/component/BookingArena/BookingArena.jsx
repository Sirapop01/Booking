import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './BookingArena.css';

const BookingArena = () => {
  const { id } = useParams(); // ดึง id จาก URL
  const [arena, setArena] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:4000/api/arenas/getArenaById/${id}`)
      .then((response) => {
        setArena(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching arena:', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="loading-text">กำลังโหลดข้อมูล...</div>;
  }

  if (!arena) {
    return <div className="loading-text">ไม่พบข้อมูลสนามกีฬา</div>;
  }

  return (
    <div className="booking-arena-container">
      <div className="arena-card">
        <div className="main-image-container">
          <img
            src={arena.images.length > 0 ? arena.images[0] : 'https://via.placeholder.com/400'}
            alt={arena.fieldName}
            className="main-image"
          />
        </div>

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

          <div className="sub-stadiums">
            {arena.images.slice(1).map((img, index) => (
              <div key={index} className="sub-stadium-card">
                <img src={img} alt={`สนามย่อย ${index + 1}`} />
                <p>สนามบาสเกตบอล {index + 1}</p>
              </div>
            ))}
          </div>
        </div>

        <button className="booking-button">จองเลย</button>
      </div>
    </div>
  );
};

export default BookingArena;