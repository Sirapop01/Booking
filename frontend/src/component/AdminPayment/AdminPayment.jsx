import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPayment.css";
import homeLogo from "../assets/logoalt.png";

const AdminPayment = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [transactions, setTransactions] = useState([]);

  // ✅ โหลดรายชื่อบัญชีผู้ใช้
  useEffect(() => {
    axios.get("http://localhost:4000/api/payment-users")
      .then(response => {
        setUsers(response.data);
        if (response.data.length > 0) {
          setSelectedUser(response.data[0]); // เลือกบัญชีแรก
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
    }
  }, [selectedUser]);

  // ✅ คำนวณยอดรวม
  const calculateTotal = () => {
    return transactions.reduce((total, transaction) => total + transaction.total, 0);
  };

  // ✅ ฟังก์ชันลบรายการที่เลือก
  const deleteSelected = () => {
    const remainingTransactions = transactions.filter(t => !t.selected);
    setTransactions(remainingTransactions);
  };

  // ✅ ฟังก์ชันยืนยันการจ่ายเงิน
  const confirmPayment = () => {
    alert("ยืนยันการจ่ายเงินแล้ว! ✅");
  };

  // ✅ ฟังก์ชันเพิ่มบัญชีเข้า Blacklist
  const blacklistUser = () => {
    axios.put(`http://localhost:4000/api/blacklist/${selectedUser._id}`)
      .then(() => alert(`${selectedUser.username} ถูกเพิ่มใน Blacklist`))
      .catch(error => console.error("Error blacklisting user:", error));
  };

  // ✅ ฟังก์ชันล้างการเลือก
  const clearSelection = () => {
    setTransactions(transactions.map(t => ({ ...t, selected: false })));
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
                  <th>เลือก</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr><td colSpan="6" className="no-data">ไม่มีรายการ</td></tr>
                ) : (
                  transactions.map((transaction, index) => (
                    <tr key={index} className={transaction.selected ? "selected-row3" : ""}>
                      <td>{transaction.dateTime}</td>
                      <td>{transaction.item}</td>
                      <td>{transaction.amount} $</td>
                      <td>{transaction.tax} $</td>
                      <td>{transaction.total} $</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={transaction.selected || false}
                          onChange={() => {
                            setTransactions(transactions.map((t, i) =>
                              i === index ? { ...t, selected: !t.selected } : t
                            ));
                          }}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* 🛠 ปุ่มจัดการ */}
            <div className="action-buttons3">
              <button className="delete-button" onClick={deleteSelected}>ลบที่เลือก</button>
              <button className="confirm-button3" onClick={confirmPayment}>ยืนยัน</button>
              <button className="blacklist-button" onClick={blacklistUser}>Blacklist</button>
              <button className="slip-button" onClick={clearSelection}>สลิป</button>
            </div>

            {/* 💲 รวมยอดเงินทั้งหมด */}
            <div className="total-box2">
              <strong>Total: {calculateTotal()} $</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPayment;
