import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BookingArena.css";

const BookingArena = () => {
  const { id } = useParams(); // รับ arenaId จาก URL
  const navigate = useNavigate();
  const [arena, setArena] = useState(null);
  const [sports, setSports] = useState([]);
  const [subStadiums, setSubStadiums] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedSubStadiums, setSelectedSubStadiums] = useState([]); // เก็บสนามย่อยที่ถูกเลือก

  useEffect(() => {
    axios.get(`http://localhost:4000/api/arenas/getArenaById/${id}`)
      .then((response) => setArena(response.data))
      .catch((error) => console.error("Error fetching arena data:", error));
  }, [id]);

  useEffect(() => {
    axios.get(`http://localhost:4000/api/sports/${id}`)
      .then((response) => setSports(response.data))
      .catch((error) => console.error("Error fetching sports categories:", error));
  }, [id]);

  useEffect(() => {
    if (sports.length > 0) {
      const fetchSubStadiums = async () => {
        let groupedSubStadiums = {};
        for (const sport of sports) {
          try {
            const response = await axios.get(`http://localhost:4000/api/substadiums/${id}/${sport._id}`);
            groupedSubStadiums[sport.sportName] = response.data;
          } catch (error) {
            console.error(`Error fetching sub-stadiums for sport ${sport.sportName}:`, error);
          }
        }
        setSubStadiums(groupedSubStadiums);
        setLoading(false);
      };
      fetchSubStadiums();
    } else {
      setLoading(false);
    }
  }, [sports, id]);

  // ฟังก์ชันเลือกหรือยกเลิกสนามย่อย
  const toggleSubStadiumSelection = (subStadiumId) => {
    setSelectedSubStadiums((prev) =>
      prev.includes(subStadiumId)
        ? prev.filter((id) => id !== subStadiumId)
        : [...prev, subStadiumId]
    );
  };

  // ฟังก์ชันไปยังหน้าจองพร้อมข้อมูลสนามย่อยที่เลือก
  const handleBooking = () => {
    if (selectedSubStadiums.length > 0) {
      navigate(`/booking`, { state: { selectedSubStadiums } });
    } else {
      alert("กรุณาเลือกสนามย่อยก่อนทำการจอง!");
    }
  };

  if (loading) return <div className="loading-text">กำลังโหลดข้อมูล...</div>;
  if (!arena) return <div className="loading-text">ไม่พบข้อมูลสนามกีฬา</div>;

  return (
    <div className="booking-arena-container">
      <div className="arena-card">
        <div className="main-image-container">
          <img
            src={arena.images.length > 0 ? arena.images[0] : "https://via.placeholder.com/400"}
            alt={arena.fieldName}
            className="main-image"
          />
        </div>

        <div className="arena-info-container">
          <div className="arena-left-section">
            <h2 className="arena-title">{arena.fieldName}</h2>
            <div className="arena-meta">
              <span className="star">⭐ 5.0</span>
              <span className="distance-tag">📍 20.2 km</span>
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

          {/* กลุ่มของสนามย่อย */}
          <div className="grouped-sub-stadiums">
            {Object.entries(subStadiums).length > 0 ? (
              Object.entries(subStadiums).map(([sportName, stadiums]) => (
                <div key={sportName} className="sport-group">
                  <h3 className="sport-title">{sportName}</h3>
                  <div className="sub-stadium-row">
                    {stadiums.map((sub) => (
                      <button
                        key={sub._id}
                        className={`sub-stadium-button ${selectedSubStadiums.includes(sub._id) ? "selected" : ""}`}
                        onClick={() => toggleSubStadiumSelection(sub._id)}
                      >
                        <img src={sub.images.length > 0 ? sub.images[0] : "https://via.placeholder.com/150"} alt={sub.name} />
                        <p>{sub.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p>ไม่มีสนามย่อยให้เลือก</p>
            )}
          </div>
        </div>

        {/* ปุ่มจอง */}
        <button className="booking-button" onClick={handleBooking}>
          จองสนาม ({selectedSubStadiums.length})
        </button>
      </div>
    </div>
  );
};

export default BookingArena;
