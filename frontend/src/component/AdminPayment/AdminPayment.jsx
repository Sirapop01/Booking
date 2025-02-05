import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPayment.css";
import homeLogo from "../assets/logoalt.png";
import closeIcon from "../assets/icons/close.png";

const AdminPayment = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showSlipPopup, setShowSlipPopup] = useState(false);
  const [slipImageUrl, setSlipImageUrl] = useState("");
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // ✅ โหลดรายชื่อบัญชีผู้ใช้
  useEffect(() => {
    axios.get("http://localhost:4000/api/verify-payments/payment-users")
      .then(response => {
        setUsers(response.data);
        if (response.data.length > 0) {
          setSelectedUser(response.data[0]);
        }
      })
      .catch(error => console.error("Error fetching users:", error));
  }, []);

  // ✅ โหลดรายการการจ่ายเงินของผู้ใช้ที่เลือก
  useEffect(() => {
    if (selectedUser) {
      axios.get(`http://localhost:4000/api/payment-history/${selectedUser._id}`)
        .then(response => setTransactions(response.data))
        .catch(error => console.error("Error fetching transactions:", error));

      // ✅ โหลดรูปสลิปของผู้ใช้ที่เลือก
      axios.get(`http://localhost:4000/api/payment-slip/${selectedUser._id}`)
        .then(response => setSlipImageUrl(response.data.slipImageUrl))
        .catch(error => console.error("Error fetching slip image:", error));
    }
  }, [selectedUser]);

  // ✅ คำนวณยอดรวม
  const calculateTotal = () => {
    return transactions.reduce((total, transaction) => total + transaction.total, 0);
  };

  // ✅ ฟังก์ชันเปิด Pop-up สลิป
  const openSlipPopup = () => {
    setShowSlipPopup(true);
  };

  // ✅ ฟังก์ชันปิด Pop-up สลิป
  const closeSlipPopup = () => {
    setShowSlipPopup(false);
  };

  // ✅ ฟังก์ชันเปิด Pop-up Reject
  const openRejectPopup = () => {
    setShowRejectPopup(true);
  };

  // ✅ ฟังก์ชันปิด Pop-up Reject
  const closeRejectPopup = () => {
    setShowRejectPopup(false);
    setRejectReason("");
  };

  // ✅ ฟังก์ชันปฏิเสธการชำระเงิน (Reject)
  const confirmReject = () => {
    if (!rejectReason.trim()) {
      alert("กรุณากรอกเหตุผลในการปฏิเสธการชำระเงิน ❌");
      return;
    }

    axios.post(`http://localhost:4000/api/reject-payment/${selectedUser._id}`, { reason: rejectReason })
      .then(() => {
        alert(`การชำระเงินของ ${selectedUser.username} ถูกปฏิเสธแล้ว ✅`);
        closeRejectPopup(); // ปิด Pop-up
      })
      .catch(error => console.error("Error rejecting payment:", error));
  };

  return (
    <div className="admin-payment-container">
      {/* 🔙 ปุ่มกลับไปยังหน้า Home */}
      <a href="/" className="home-button">
        <img src={homeLogo} alt="Home Logo" className="home-logo" />
      </a>

      <h1 className="page-title3">ตรวจสอบการจ่ายเงิน</h1>

      <div className="payment-content">
        {/* 📜 รายชื่อผู้ใช้ */}
        <div className="user-list-container3">
          <div className="user-list3">
            <div className="list-header3">บัญชีผู้ใช้</div>
            {users.map((user) => (
              <div
                key={user._id}
                className={`user-item3 ${selectedUser?._id === user._id ? "selected" : ""}`}
                onClick={() => setSelectedUser(user)}
              >
                {user.username}
              </div>
            ))}
          </div>
        </div>

        {/* 📊 ตารางรายการจ่ายเงิน */}
        <div className="payment-table-container3">
          <div className="payment-table3">
            <div className="table-header3">รายละเอียด</div>
            <table>
              <thead>
                <tr>
                  <th>วัน/เวลา</th>
                  <th>สินค้าหรือสนาม</th>
                  <th>ยอดเงิน</th>
                  <th>เรียกเก็บ 10%</th>
                  <th>รวม</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr><td colSpan="6" className="no-data">ไม่มีรายการ</td></tr>
                ) : (
                  transactions.map((transaction, index) => (
                    <tr key={index}>
                      <td>{transaction.dateTime}</td>
                      <td>{transaction.item}</td>
                      <td>{transaction.amount} $</td>
                      <td>{transaction.tax} $</td>
                      <td>{transaction.total} $</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* 💲 รวมยอดเงินทั้งหมด */}
            <div className="total-box2">
              <strong>Total: {calculateTotal()} $</strong>
            </div>

            {/* 🛠 ปุ่มจัดการ */}
            <div className="action-buttons3">
              <button className="reject-button" onClick={openRejectPopup}>Reject</button>
              <button className="confirm-button3">ยืนยัน</button>
              <button className="blacklist-button">Blacklist</button>
              <button className="slip-button" onClick={openSlipPopup}>สลิป</button>
            </div>
          </div>
        </div>
      </div>

      {/* 🖼 Pop-up แสดงสลิป */}
      {showSlipPopup && (
        <div className="slip-popup">
          <div className="slip-popup-content">
            <img src={closeIcon} alt="Close" className="close-slip-popup" onClick={closeSlipPopup} />
            <h2>สลิป</h2>
            {slipImageUrl ? <img src={slipImageUrl} alt="Slip" className="slip-image" /> : <p>ไม่มีสลิป</p>}
          </div>
        </div>
      )}

      {/* 🚫 Pop-up ปฏิเสธการชำระเงิน */}
      {showRejectPopup && (
        <div className="reject-popup">
          <div className="reject-popup-content">
            <img src={closeIcon} alt="Close" className="close-reject-popup" onClick={closeRejectPopup} />
            <h2>ปฏิเสธการชำระเงิน</h2>
            <textarea
              className="reject-reason-input"
              placeholder="กรุณากรอกสาเหตุ..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="popup-buttons3">
              <button className="confirm-reject" onClick={confirmReject}>ยืนยัน</button>
              <button className="cancel-reject" onClick={closeRejectPopup}>ยกเลิก</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayment;
