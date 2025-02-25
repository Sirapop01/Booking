import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPayment.css";
import homeLogo from "../assets/logoalt.png";
import closeIcon from "../assets/icons/close.png";
import NavbarAdmin from "../NavbarAdmin/NavbarAdmin";


const AdminPayment = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showSlipPopup, setShowSlipPopup] = useState(false);
  const [slipImageUrl, setSlipImageUrl] = useState("");
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // ✅ Fetch JWT Token from LocalStorage
  const token = localStorage.getItem("token");

  // ✅ Load users with `state: "payment"`
  useEffect(() => {
    if (!token) return;

    axios
      .get("http://localhost:4000/api/verify-payments/payment-users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUsers(response.data);
        if (response.data.length > 0) {
          setSelectedUser(response.data[0]); // Select first user automatically
        }
      })
      .catch((error) =>
        console.error("❌ Error fetching users:", error.response?.data || error.message)
      );
  }, [token]);

  // ✅ Load transactions and slip image for the selected user
  useEffect(() => {
    if (!selectedUser || !token) return;

    axios
      .get(`http://localhost:4000/api/verify-payments/payment-details?state=payment&userId=${selectedUser._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setTransactions(response.data))
      .catch((error) =>
        console.error("❌ Error fetching transactions:", error.response?.data || error.message)
      );

      axios.get(`http://localhost:4000/api/verify-payments/payment-slip?state=payment&userId=${selectedUser._id}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => setSlipImageUrl(response.data.slipImageUrl))
    .catch(error => console.error("❌ Error fetching slip image:", error.response?.data || error.message));
    
  }, [selectedUser, token]);

  // ✅ Calculate Total Amount
  const calculateTotal = () => {
    return transactions.reduce((total, transaction) => total + transaction.total, 0);
  };

  // ✅ Toggle Slip Popup
  const toggleSlipPopup = () => setShowSlipPopup(!showSlipPopup);

  // ✅ Toggle Reject Popup
  const toggleRejectPopup = () => setShowRejectPopup(!showRejectPopup);

  // ✅ Reject Payment
  const confirmReject = () => {
    if (!rejectReason.trim()) {
      alert("กรุณากรอกเหตุผลในการปฏิเสธการชำระเงิน ❌");
      return;
    }

    axios
      .post(
        `http://localhost:4000/api/verify-payments/reject-payment/${selectedUser._id}`,
        { reason: rejectReason },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        alert(`🚫 การชำระเงินของ ${selectedUser.firstName} ถูกปฏิเสธแล้ว!`);
        toggleRejectPopup();
      })
      .catch((error) =>
        console.error("❌ Error rejecting payment:", error.response?.data || error.message)
      );
  };

  return (
    <div className="admin-payment-container">
      {/* ✅ ใช้ NavbarAdmin แทน Home Button */}
      <NavbarAdmin />

     

      <div className="payment-content">
        {/* 📜 User List */}
        <div className="user-list-container3">
          <div className="user-list3">
            <div className="list-header3">บัญชีผู้ใช้</div>
            {users.map((user) => (
              <div
                key={user._id}
                className={`user-item3 ${selectedUser?._id === user._id ? "selected" : ""}`}
                onClick={() => setSelectedUser(user)}
              >
                {user.firstName} {user.lastName}
              </div>
            ))}
          </div>
        </div>

        {/* 📊 Payment Table */}
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
                  <tr>
                    <td colSpan="5" className="no-data">
                      ไม่มีรายการ
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction, index) => (
                    <tr key={index}>
                      <td>{new Date(transaction.dateTime).toLocaleString()}</td>
                      <td>{transaction.item}</td>
                      <td>{transaction.amount} $</td>
                      <td>{transaction.tax} $</td>
                      <td>{transaction.total} $</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* 💲 Total */}
            <div className="total-box2">
              <strong>Total: {calculateTotal()} $</strong>
            </div>

            {/* 🛠 Action Buttons */}
            <div className="action-buttons3">
              <button className="reject-button" onClick={toggleRejectPopup}>
                Reject
              </button>
              <button className="confirm-button3">ยืนยัน</button>
              <button className="blacklist-button">Blacklist</button>
              <button className="slip-button" onClick={toggleSlipPopup}>
                สลิป
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🖼 Slip Popup */}
      {showSlipPopup && (
        <div className="slip-popup">
          <div className="slip-popup-content">
            <img src={closeIcon} alt="Close" className="close-slip-popup" onClick={toggleSlipPopup} />
            <h2>สลิป</h2>
            {slipImageUrl ? (
              <img src={slipImageUrl} alt="Slip" className="slip-image" />
            ) : (
              <p>ไม่มีสลิป</p>
            )}
          </div>
        </div>
      )}

      {/* 🚫 Reject Popup */}
      {showRejectPopup && (
        <div className="reject-popup">
          <div className="reject-popup-content">
            <img src={closeIcon} alt="Close" className="close-reject-popup" onClick={toggleRejectPopup} />
            <h2>ปฏิเสธการชำระเงิน</h2>
            <textarea
              className="reject-reason-input"
              placeholder="กรุณากรอกสาเหตุ..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="popup-buttons3">
              <button className="confirm-reject" onClick={confirmReject}>
                ยืนยัน
              </button>
              <button className="cancel-reject" onClick={toggleRejectPopup}>
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayment;
