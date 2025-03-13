import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ใช้สำหรับเปลี่ยนหน้า
import './ListCard.css';

const ListCard = ({ stadiums }) => {  // ✅ รับ props stadiums จาก Homepage
  const navigate = useNavigate(); // ใช้ Hook สำหรับเปลี่ยนเส้นทาง

  const handleCardClick = (stadiumId) => {
    navigate(`/BookingArena/${stadiumId}`); // ✅ เมื่อกดที่การ์ด ให้ไปหน้า /BookingArena/:id
  };

  useEffect(() => {
    console.log("Stadiums:", stadiums); // ✅ แสดงข้อมูลทั้งก้อนก่อน
    if (stadiums && Array.isArray(stadiums) && stadiums.length > 0) {
      console.log("First Stadium ID:", stadiums[0]._id); // ✅ ลองแสดง _id ของตัวแรก
    }
  }, [stadiums]); // ✅ ให้ useEffect ทำงานเมื่อ stadiums เปลี่ยนแปลง

  return (
    <div className="stadium-container">
      <h2 className="recommend-title">สถานที่แนะนำ</h2>
      <div className="stadium-list">
        {stadiums.length > 0 ? (
          stadiums.slice(0, 10).map((stadium) => (
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
                <h3>
                  {stadium.averageRating !== undefined ? (
                    <span className="rating"> ⭐ {stadium.averageRating}</span>
                  ) : (
                    <span className="no-rating"> ⭐ -</span>
                  )}

                </h3>
                <h3>
                  {stadium.fieldName}
                </h3>

                <p>โทร: {stadium.phone}</p>
                <p>เวลาเปิด: {stadium.startTime} - {stadium.endTime}</p>
                <p>ระยะห่าง: {stadium.distance ? `${stadium.distance.toFixed(2)} กม.` : "ไม่ระบุ"}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">❌ ไม่พบข้อมูลสนามกีฬา</p>
        )}
      </div>
    </div>
  );
};

export default ListCard;
