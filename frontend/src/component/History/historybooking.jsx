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

    const fetchBookingHistory = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/bookinghistories?userId=${decodedToken.id}`);
            console.log("📌 Booking History Data:", response.data);
            setBookingHistory(response.data);
        } catch (error) {
            console.error("❌ ไม่สามารถดึงข้อมูลประวัติการจอง:", error);
        }
    };

    fetchBookingHistory();
    
    // 🔄 ตั้ง interval ดึงข้อมูลทุก 10 วินาที
    const interval = setInterval(() => {
        console.log("🔄 กำลังเช็คสถานะการจอง...");
        fetchBookingHistory();
    }, 10000);

    return () => clearInterval(interval); // ✅ ล้าง interval เมื่อ component ถูก unmount
}, [decodedToken]);



  if (loading) return <div>กำลังโหลดข้อมูล...</div>;

  return (
    <div className="history-page">
      <Navbar />
      <h1 className="history-title">ประวัติการจอง</h1>

      <div className="history-container">
  {bookingHistory.length > 0 ? (
    bookingHistory
      .filter(booking => booking.fieldName && booking.fieldName !== "ไม่พบชื่อสนาม") // ✅ กรองเฉพาะสนามที่มีข้อมูล
      .map((booking) => (
        <div 
          className="history-card" 
          key={booking._id} 
          onClick={() => navigate(`/BookingArena/${booking.stadiumId}`)}
        >
          <div className="history-details">
            <div className="left">
              <h2>สนาม: {booking.fieldName}</h2>
              {booking.details.map((detail, index) => ( // 🔥 วนลูปแสดงทุกกีฬา
                <div key={index} className="detail-item">
                  <p><strong>กีฬา:</strong> {detail.sportName}</p> 
                  <p><strong>วันที่จอง:</strong> {new Date(detail.bookingDate).toLocaleDateString()}</p>
                  <p><strong>ช่วงเวลา:</strong> {detail.startTime} - {detail.endTime}</p>
                  <p><strong>สนามย่อย:</strong> {detail.subStadiumName || "ไม่พบชื่อสนามย่อย"}</p>
                  <p><strong>ราคา:</strong> {detail.price} บาท</p>
                </div>
              ))}

              <p className="total-price"><strong>รวม:</strong> {booking.totalPrice} บาท</p>

                <p>
                  <strong>สถานะ:</strong> 
                  <span className={`status ${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span>

                  {/* ✅ แสดงเหตุผลการปฏิเสธถ้าสถานะเป็น "rejected" */}
                  {booking.status === "rejected" && booking.rejectionReason && (
                    <span className="rejection-reason"> (เหตุผล: {booking.rejectionReason})</span>
                  )}
                </p>

              {/* ✅ ปุ่ม รีวิวสนาม */}
              <button 
                className="review-button" 
                onClick={(e) => {
                  e.stopPropagation(); // ป้องกันการคลิกที่ Card แล้วไปหน้า Booking
                  navigate(`/review/${booking.stadiumId}`);
                }}
              >
                รีวิวสนาม
              </button>
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
