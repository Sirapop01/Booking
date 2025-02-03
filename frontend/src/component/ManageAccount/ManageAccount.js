import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManageAccount.css";
import homeLogo from "../assets/logoalt.png";

const ManageAccount = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // 📌 โหลดข้อมูลบัญชีจาก API
  useEffect(() => {
    axios.get("http://localhost:4000/api/manage-account")
      .then(response => {
        setUsers(response.data);
        if (response.data.length > 0) {
          setSelectedUser(response.data[0]); // เลือกบัญชีแรกเป็นค่าเริ่มต้น
        }
      })
      .catch(error => console.error("Error fetching users:", error));
  }, []);

  // 📌 ฟังก์ชันลบบัญชี
  const deleteUser = (id) => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบบัญชีนี้?")) {
      axios.delete(`http://localhost:4000/api/manage-account/${id}`)
        .then(() => {
          setUsers(users.filter(user => user._id !== id));
          setSelectedUser(null);
        })
        .catch(error => console.error("Error deleting user:", error));
    }
  };

  // 📌 ฟังก์ชันตั้งหรือยกเลิก Blacklist
  const toggleBlacklist = (id) => {
    axios.put(`http://localhost:4000/api/manage-account/blacklist/${id}`)
      .then(() => {
        setUsers(users.map(user =>
          user._id === id ? { ...user, status: user.status === "blacklisted" ? "active" : "blacklisted" } : user
        ));
        setSelectedUser(prevUser => prevUser && prevUser._id === id
          ? { ...prevUser, status: prevUser.status === "blacklisted" ? "active" : "blacklisted" }
          : prevUser
        );
      })
      .catch(error => console.error("Error toggling blacklist:", error));
  };

  return (
    <div className="manage-account-container">
      {/* ✅ ปุ่มกลับไปยังหน้า Home */}
          <a href="/" className="home-button">
            <img src={homeLogo} alt="Home Logo" className="home-logo" />
          </a>

      <h1 className="page-title">การจัดการบัญชี</h1>

      <div className="account-content">
        {/* 📌 Container สำหรับ User List */}
        <div className="user-list-container">
          <div className="list-header">บัญชีผู้ใช้</div>
          <div className="user-items">
            {users.map((user) => (
              <div
                key={user._id}
                className={`user-item ${selectedUser?._id === user._id ? "selected" : ""} ${user.status === "blacklisted" ? "blacklisted" : ""}`}
                onClick={() => setSelectedUser(user)}
              >
                {user.firstName} {user.lastName}
              </div>
            ))}
          </div>
        </div>

        {/* 📌 Container สำหรับ User Details */}
          {selectedUser && (
            <div className="user-details-container">
              <div className="user-header">รายละเอียด</div>
              {/* ✅ รูปโปรไฟล์ */}
              <div className="profile-image">
                <img src={selectedUser.profileImage || "https://via.placeholder.com/100"} alt="User Profile" />
              </div>

              {/* ✅ หัวข้อ "ข้อมูลส่วนตัว" */}
              <div className="details-header">ข้อมูลส่วนตัว</div>

              {/* ✅ ข้อมูลผู้ใช้แสดงแบบ 3 คอลัมน์ */}
              <div className="info-section">
                <p><strong>ชื่อ:</strong> {selectedUser.firstName}</p>
                <p><strong>นามสกุล:</strong> {selectedUser.lastName}</p>
                <p><strong>เพศ:</strong> {selectedUser.gender || "-"}</p>
                <p><strong>หมายเลขโทรศัพท์:</strong> {selectedUser.phoneNumber}</p>
                <p><strong>อีเมล:</strong> {selectedUser.email}</p>
                <p><strong>สนใจกีฬา:</strong> {selectedUser.interestedSports || "-"}</p>
                <p><strong>ที่อยู่:</strong> {`${selectedUser.subdistrict}, ${selectedUser.district}, ${selectedUser.province}`}</p>
                <p><strong>สถานะ:</strong> 
                  <span className={selectedUser.status === "blacklisted" ? "blacklisted-text" : "active-text"}>
                    {selectedUser.status}
                  </span>
                </p>
              </div>

              {/* ✅ ปุ่มดำเนินการ */}
              <div className="action-buttons">
                <button className="delete-button3" onClick={() => deleteUser(selectedUser._id)}>ลบบัญชี</button>
                <button className={`blacklist-button ${selectedUser.status === "blacklisted" ? "remove-blacklist" : ""}`} 
                  onClick={() => toggleBlacklist(selectedUser._id)}>
                  {selectedUser.status === "blacklisted" ? "ยกเลิก Blacklist" : "เพิ่มใน Blacklist"}
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default ManageAccount;
