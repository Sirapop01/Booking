import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ConfirmBooking.css";
import Navbar from "../Navbar/Navbar";
import closeIcon from "../assets/icons/close.png";

const ConfirmBooking = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [showSlipPopup, setShowSlipPopup] = useState(false);
  const [slipImageUrl, setSlipImageUrl] = useState("");

  // ✅ ดึง JWT Token
  const token = localStorage.getItem("token");

  // ✅ โหลดผู้ใช้ที่มีการชำระเงินแล้ว (`status: "paid"`)
  useEffect(() => {
    if (!token) return;

    axios
      .get("http://localhost:4000/api/payments/paid-users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUsers(response.data);
        if (response.data.length > 0) {
          setSelectedUser(response.data[0]); // เลือกผู้ใช้แรก
        }
      })
      .catch((error) =>
        console.error("❌ Error fetching paid users:", error.response?.data || error.message)
      );
  }, [token]);

  // ✅ โหลดข้อมูล `bookings` ของผู้ใช้ที่เลือก
  useEffect(() => {
    if (!selectedUser || !token) return;

    axios
      .get(`http://localhost:4000/api/payments/user-bookings?userId=${selectedUser._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setBookings(response.data);
      })
      .catch((error) =>
        console.error("❌ Error fetching user bookings:", error.response?.data || error.message)
      );
  }, [selectedUser, token]);

  // ✅ แสดง Popup สลิป
  const toggleSlipPopup = (imageUrl) => {
    setSlipImageUrl(imageUrl);
    setShowSlipPopup(true);
  };

  return (
    <div className="admin-payment-container">
      {/* ✅ Navbar */}
      <Navbar />

      <div className="payment-content">
        {/* 📜 รายชื่อผู้ใช้ที่ชำระเงินแล้ว */}
        <div className="user-list-container3">
          <div className="user-list3">
            <div className="list-header3">บัญชีผู้ใช้</div>
            {users.length === 0 ? (
              <p style={{ textAlign: "center" }}>ไม่มีผู้ใช้ที่ชำระเงิน</p>
            ) : (
              users.map((user) => (
                <div
                  key={user._id}
                  className={`user-item3 ${selectedUser?._id === user._id ? "selected" : ""}`}
                  onClick={() => setSelectedUser(user)}
                >
                  {user.firstName} {user.lastName}
                </div>
              ))
            )}
          </div>
        </div>

        {/* 📊 ตารางการจอง */}
        <div className="payment-table-container3">
          <div className="payment-table3">
            <div className="table-header3">รายละเอียดการจอง</div>
            <table>
              <thead>
                <tr>
                  <th>วัน/เวลา</th>
                  <th>สนามกีฬา</th>
                  <th>ประเภทกีฬา</th>
                  <th>จำนวนเงิน</th>
                  <th>จำนวนคอร์ท</th>
                  <th>สถานะ</th>
                  <th>สลิป</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="no-data">ไม่มีรายการจอง</td>
                  </tr>
                ) : (
                  bookings.map((booking, index) => (
                    <tr key={index}>
                      <td>{new Date(booking.bookingDate).toLocaleString()}</td>
                      <td>{booking.subStadiumName}</td>
                      <td>{booking.sportName}</td>
                      <td>{booking.amount} ฿</td>
                      <td>{booking.courtCount}</td>
                      <td>{booking.status}</td>
                      <td>
                        <img
                          src={booking.slipImage}
                          alt="Slip"
                          className="slip-image"
                          onClick={() => toggleSlipPopup(booking.slipImage)}
                          style={{ cursor: "pointer" }}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 🖼 Popup ดูสลิป */}
      {showSlipPopup && (
        <div className="slip-popup">
          <div className="slip-popup-content">
            <img src={closeIcon} alt="Close" className="close-slip-popup" onClick={() => setShowSlipPopup(false)} />
            <h2>สลิปการโอนเงิน</h2>
            {slipImageUrl ? (
              <img src={slipImageUrl} alt="Slip" className="slip-image" />
            ) : (
              <p>ไม่มีสลิป</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmBooking;
