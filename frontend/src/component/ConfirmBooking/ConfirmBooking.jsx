import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./ConfirmBooking.css";
import Navbar from "../Navbar/Navbar";
import { useParams } from "react-router-dom";

const ConfirmBooking = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const { stadiumId } = useParams();

  if (!token) {
    console.warn("🚨 Token missing! Redirecting to login...");
    navigate("/login");
  }

  useEffect(() => {
    axios.get(`http://localhost:4000/api/payments/paid-users?stadiumId=${stadiumId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(({ data }) => {
        console.log("✅ Paid Users Fetched", data);
        setUsers(data);
      })
      .catch((error) => console.error("❌ Error fetching paid users:", error));
  }, [token]);

  useEffect(() => {
    if (!selectedUser || !token) return;

    axios
      .get(`http://localhost:4000/api/payments/user-bookings?userId=${selectedUser.userId._id}&sessionId=${selectedUser.sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        console.log("✅ ข้อมูลการจองของ Session:", selectedUser.sessionId, data);
        setBookings(data);
      })
      .catch((error) => console.error("❌ Error fetching user bookings:", error));
  }, [selectedUser, token]);

  // ✅ ฟังก์ชันยืนยันการจอง (แก้ไขแล้ว)
  const confirmBooking = async () => {
    if (!selectedBooking || !selectedBooking._id) {
      console.error("❌ Error: ไม่พบข้อมูลการจอง", selectedBooking);
      Swal.fire("ผิดพลาด!", "ไม่พบข้อมูลการจอง กรุณาลองใหม่", "error");
      return;
    }

    // ✅ ตรวจสอบว่า `_id` เป็น string
    const bookingId = String(selectedBooking._id);
    const apiUrl = `http://localhost:4000/api/payments/confirm/${bookingId}`;

    console.log("🛠️ Debug: Booking ID:", bookingId);
    console.log("🛠️ Debug: API URL:", apiUrl);

    Swal.fire({
      title: "ยืนยันการจอง?",
      text: "คุณต้องการยืนยันการจองนี้หรือไม่?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "✔️ ยืนยัน",
      cancelButtonText: "❌ ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.put(
            apiUrl,
            {}, // ✅ ไม่ต้องใส่ body เพราะ id อยู่ใน URL แล้ว
            { headers: { Authorization: `Bearer ${token}` } }
          );

          console.log("✅ Booking Confirmed:", response.data);
          Swal.fire("สำเร็จ!", "การจองถูกยืนยันแล้ว", "success");

          // ✅ อัปเดตสถานะใน UI
          setBookings((prevBookings) =>
            prevBookings.map((booking) =>
              booking._id === selectedBooking._id
                ? { ...booking, status: "confirmed" }
                : booking
            )
          );

          setSelectedBooking(null); // ✅ เคลียร์การเลือกหลังยืนยัน
        } catch (error) {
          console.error("❌ เกิดข้อผิดพลาดในการยืนยันการจอง:", error);
          Swal.fire("ผิดพลาด!", "ไม่สามารถยืนยันการจองได้", "error");
        }
      }
    });
  };


  const rejectBooking = async () => {
    if (!selectedBooking || !selectedBooking._id) {
      console.error("❌ Error: ไม่พบข้อมูลการจอง", selectedBooking);
      Swal.fire("ผิดพลาด!", "ไม่พบข้อมูลการจอง กรุณาลองใหม่", "error");
      return;
    }

    const bookingId = String(selectedBooking._id);
    const apiUrl = `http://localhost:4000/api/payments/reject/${bookingId}`;

    console.log("🛠️ Debug: Booking ID ที่จะปฏิเสธ:", bookingId);
    console.log("🛠️ Debug: API URL:", apiUrl);

    // ✅ Popup ให้แอดมินกรอกเหตุผล
    const { value: rejectionReason } = await Swal.fire({
      title: "กรุณาระบุเหตุผลที่ปฏิเสธ",
      input: "textarea",
      inputPlaceholder: "พิมพ์เหตุผลที่นี่...",
      showCancelButton: true,
      confirmButtonText: "✔️ ส่งเหตุผล",
      cancelButtonText: "❌ ยกเลิก",
    });

    if (!rejectionReason) {
      Swal.fire("❌ ปฏิเสธไม่สำเร็จ", "กรุณาระบุเหตุผลในการปฏิเสธ", "error");
      return;
    }

    Swal.fire({
      title: "ปฏิเสธการจอง?",
      text: "คุณแน่ใจหรือไม่ว่าต้องการปฏิเสธการจองนี้?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "❌ ปฏิเสธ",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.put(
            apiUrl,
            { rejectionReason }, // ✅ ส่งเหตุผลไปด้วย
            { headers: { Authorization: `Bearer ${token}` } }
          );

          console.log("✅ Booking Rejected:", response.data);
          Swal.fire("สำเร็จ!", "การจองถูกปฏิเสธแล้ว", "success");

          // ✅ อัปเดตสถานะใน UI
          setBookings((prevBookings) =>
            prevBookings.map((booking) =>
              booking._id === selectedBooking._id
                ? { ...booking, status: "rejected", rejectionReason }
                : booking
            )
          );

          setSelectedBooking(null); // ✅ เคลียร์การเลือกหลังปฏิเสธ
        } catch (error) {
          console.error("❌ เกิดข้อผิดพลาดในการปฏิเสธการจอง:", error);
          Swal.fire("ผิดพลาด!", "ไม่สามารถปฏิเสธการจองได้", "error");
        }
      }
    });
  };


  return (
    <div className="admin-payment-container">
      <Navbar />
      <div className="payment-content">
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
                  {user.userId?.firstName ?? "ไม่ทราบชื่อ"} {user.userId?.lastName ?? ""}
                </div>
              ))
            )}
          </div>
        </div>

        {selectedUser && (
          <div className="payment-table-container3">
            <div className="payment-table3">
              <div className="table-header3">
                รายละเอียดการจองของ {selectedUser.userId.firstName} {selectedUser.userId.lastName} (Session: {selectedUser.sessionId})
              </div>
              <table>
                <thead>
                  <tr>
                    <th>วัน</th>
                    <th>เวลา</th>
                    <th>ประเภทกีฬา</th>
                    <th>จำนวนเงิน</th>
                    <th>สถานะ</th>
                    <th>สลิป</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", color: "red" }}>
                        ❌ ไม่มีข้อมูลการจองของ Session นี้
                      </td>
                    </tr>
                  ) : (
                    bookings.map((booking, index) => {
                      if (!Array.isArray(booking.details) || booking.details.length === 0) {
                        return (
                          <tr key={`no-details-${index}`}>
                            <td colSpan="6" style={{ textAlign: "center", color: "red" }}>❌ ไม่มีข้อมูลการจอง</td>
                          </tr>
                        );
                      }

                      return booking.details.map((details, idx) => (
                        <tr key={`${booking._id}-${idx}`} onClick={() => setSelectedBooking(booking)}>
                          <td>{details.bookingDate ? new Date(details.bookingDate).toLocaleDateString() : "❌ ไม่มีข้อมูล"}</td>
                          <td>{details.startTime || "❌ ไม่มีเวลา"} - {details.endTime || "❌ ไม่มีเวลา"}</td>
                          <td>{details.sportName || "❌ ไม่มีประเภทกีฬา"}</td>
                          <td>{booking.amount} ฿</td>
                          <td>{booking.status}</td>
                          <td>
                            <button onClick={() => Swal.fire({
                              title: "สลิปการโอนเงิน",
                              imageUrl: booking.slipImage,
                              imageAlt: "Slip Image",
                              showCloseButton: true,
                              confirmButtonText: "ปิด",
                            })}>🖼️ ดูสลิป</button>
                          </td>
                        </tr>
                      ));
                    })
                  )}
                </tbody>
              </table>

              {selectedBooking && (
                <div className="action-buttons3">
                  <button className="confirm-button3" onClick={confirmBooking}>✔️ ยืนยัน</button>
                  <button className="reject-button3" onClick={rejectBooking}>❌ ปฏิเสธ</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmBooking;
