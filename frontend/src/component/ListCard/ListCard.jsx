import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ใช้สำหรับเปลี่ยนหน้า
import axios from 'axios';
import './ListCard.css';

const ListCard = () => {
  const [stadiums, setStadiums] = useState([]);
  const navigate = useNavigate(); // ใช้ Hook สำหรับเปลี่ยนเส้นทาง

  useEffect(() => {
    axios.get('http://localhost:4000/api/arenas/getArenas')
      .then((response) => {
        setStadiums(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleCardClick = (stadiumId) => {
    // เมื่อกดที่การ์ด ให้ไปหน้า /BookingArena/:id
    navigate(`/BookingArena/${stadiumId}`);
  };

  return (
    <div className="stadium-container">
      <h2 className="recommend-title">สถานที่แนะนำ</h2>
      <div className="stadium-list">
        {stadiums.slice(0, 10).map((stadium) => (
          <div
            key={stadium._id}
            className="stadium-card"
            onClick={() => handleCardClick(stadium._id)}
          >
            <img
              src={stadium.images && stadium.images.length > 0 ? stadium.images[0] : 'https://via.placeholder.com/150'}
              alt={stadium.fieldName}
              className="stadium-image"
            />
            <div className="stadium-info">
              <h3>{stadium.fieldName}</h3>
              <p>โทร: {stadium.phone}</p>
              <p>เวลาเปิด: {stadium.startTime} - {stadium.endTime}</p>
              <p>
                พิกัด: {stadium.location && stadium.location.coordinates
                  ? stadium.location.coordinates.join(', ')
                  : 'ไม่มีข้อมูลพิกัด'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListCard;