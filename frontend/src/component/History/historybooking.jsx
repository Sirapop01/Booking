import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import "./historybooking.css";

const HistoryBooking = () => {
  const navigate = useNavigate();
  const [decodedToken, setDecodedToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingHistory, setBookingHistory] = useState([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        setDecodedToken(decoded);
      } catch (error) {
        console.error("⚠️ Error decoding token:", error);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!decodedToken) return;

    console.log("📌 Fetching booking history for userId:", decodedToken.id); // ✅ ตรวจสอบค่า userId ก่อนเรียก API

    const fetchBookingHistory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/bookinghistories?userId=${decodedToken.id}`
        );
        console.log("📌 Booking History Data:", response.data); // ✅ ตรวจสอบข้อมูลที่ได้รับจาก API
        setBookingHistory(response.data);
      } catch (error) {
        console.error("❌ ไม่สามารถดึงข้อมูลประวัติการจอง:", error);
      }
    };

    fetchBookingHistory();
}, [decodedToken]);


  if (loading) return <div>กำลังโหลดข้อมูล...</div>;

  return (
    <div className="history-page">
      <Navbar />
      <h1 className="history-title">ประวัติการจอง</h1>
  
      <div className="history-container">
        {bookingHistory.length > 0 ? (
          bookingHistory.map((booking) => (
            <div 
              className="history-card" 
              key={booking._id} 
              onClick={() => navigate(`/BookingArena/${booking.stadiumId}`)}
            >
              <div className="history-details">
                <div className="left">
                  <h2>กีฬา: {booking.sportName}</h2>
                  <p><strong>วันที่จอง:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
                  
                  {/* ✅ ตรวจสอบ `timeSlots` ก่อนใช้ */}
                  {booking.timeSlots.length > 0 ? (
                    <p><strong>ช่วงเวลา:</strong> {booking.timeSlots.join(", ")}</p>
                  ) : (
                    <p><strong>ช่วงเวลา:</strong> ไม่ระบุ</p>
                  )}
  
                  <p>
                    <strong>สถานะ:</strong> 
                    <span className={`status ${booking.status.toLowerCase()}`}>
                      {booking.status}
                    </span>
                  </p>
  
                  <p><strong>สนาม:</strong> {booking.fieldName || "ไม่พบชื่อสนาม"}</p>
                  <p><strong>สนามย่อย:</strong> {booking.subStadiumName || "ไม่พบชื่อสนามย่อย"}</p>
                </div>
                <div className="history-image">
                  <img 
                    src={booking.stadiumImage || "https://via.placeholder.com/150"} 
                    alt={booking.fieldName || "สนามกีฬา"} 
                    onError={(e) => e.target.src = "https://via.placeholder.com/150"} 
                  /> 
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-history">ไม่มีประวัติการจอง</p>
        )}
      </div>
    </div>
  );
  
};

export default HistoryBooking;
