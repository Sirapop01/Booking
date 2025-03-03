import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManageAccount.css";
import homeLogo from "../assets/logoalt.png";
import arrowForwardIcon from "../assets/icons/arrow-ios-forward.png";
import arrowBackwardIcon from "../assets/icons/arrow-ios-back.png";

const ManageAccount = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isOwnerMode, setIsOwnerMode] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");

  // 📌 โหลดข้อมูลบัญชีจาก API
  useEffect(() => {
    const apiUrl = isOwnerMode
      ? "http://localhost:4000/api/manage-owner" // ✅ API สำหรับเจ้าของสนาม
      : "http://localhost:4000/api/manage-account"; // ✅ API สำหรับบัญชีผู้ใช้

    axios.get(apiUrl)
      .then(response => {
        setUsers(response.data);
        if (response.data.length > 0) {
          setSelectedUser(response.data[0]); // เลือกบัญชีแรกเป็นค่าเริ่มต้น
        }
      })
      .catch(error => console.error("Error fetching users:", error));
  }, [isOwnerMode]);

  // 📌 ฟังก์ชันลบบัญชี (จะถูกเรียกเมื่อกดยืนยัน)
  const confirmDeleteUser = () => {
    if (deleteInput === "Delete") {
      const deleteUrl = isOwnerMode
        ? `http://localhost:4000/api/manage-owner/${selectedUser._id}`
        : `http://localhost:4000/api/manage-account/${selectedUser._id}`;

      axios.delete(deleteUrl)
        .then(() => {
          setUsers(users.filter(user => user._id !== selectedUser._id));
          setSelectedUser(null);
          setShowDeletePopup(false);
          setDeleteInput(""); // รีเซ็ตค่า input
        })
        .catch(error => console.error("Error deleting user:", error));
    } else {
      alert("กรุณาพิมพ์ Delete ให้ถูกต้อง");
    }
  };

  // 📌 ฟังก์ชันตั้งหรือยกเลิก Blacklist
  const toggleBlacklist = (id) => {
    const blacklistUrl = isOwnerMode
      ? `http://localhost:4000/api/manage-owner/blacklist/${id}`
      : `http://localhost:4000/api/manage-account/blacklist/${id}`;

    axios.put(blacklistUrl)
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
        <div className="list-header" onClick={() => setIsOwnerMode(!isOwnerMode)}>
            <span>{isOwnerMode ? "บัญชีเจ้าของสนาม" : "บัญชีผู้ใช้"}</span>
            <img
              src={isOwnerMode ? arrowBackwardIcon : arrowForwardIcon} 
              alt="Switch Mode"
              className="header-forward-icon"
            />
          </div>
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
              {isOwnerMode && <p><strong>สนามของ:</strong> {selectedUser.firstName}</p>}
            </div>

            {/* ✅ ปุ่มดำเนินการ */}
            <div className="action-buttons">
              <button className="delete-button3" onClick={() => setShowDeletePopup(true)}>ลบบัญชี</button>
              <button className={`blacklist-button ${selectedUser.status === "blacklisted" ? "remove-blacklist" : ""}`} 
                onClick={() => toggleBlacklist(selectedUser._id)}>
                {selectedUser.status === "blacklisted" ? "ยกเลิก Blacklist" : "เพิ่มใน Blacklist"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Pop-up ยืนยันการลบบัญชี */}
      {showDeletePopup && (
        <div className="delete-popup2">
          <div className="popup-content2">
            <h2>ลบบัญชีนี้</h2>
            <p>โปรดพิมพ์ "Delete" เพื่อยืนยัน</p>
            <input
              type="text"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              className="delete-input2"
            />
            <div className="popup-buttons2">
              <button className="confirm-delete2" onClick={confirmDeleteUser}>ยืนยัน</button>
              <button className="cancel-delete2" onClick={() => setShowDeletePopup(false)}>ยกเลิก</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAccount;
