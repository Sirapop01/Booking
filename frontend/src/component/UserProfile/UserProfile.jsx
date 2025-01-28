import React, { useState, useEffect } from "react";
import "./UserProfile.css";
import profilePic from "../assets/threeman.png";
import { FaPencilAlt } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [id, setId] = useState("");
  const [member, setMember] = useState({});
  const [showLogoutModal, setShowLogoutModal] = useState(false); // ✅ New state for popup modal
  const navigate = useNavigate();
  const [decodedToken, setDecodedToken] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        setDecodedToken(decoded);
        setToken(storedToken);
        setId(decoded.id);
        console.log("✅ Token Decoded ID:", decoded.id);
      } catch (error) {
        console.error("❌ Error decoding token:", error);
        setDecodedToken(null);
      }
    } else {
      console.log("⚠ No token found in localStorage.");
    }
  }, []);

  const toggleEdit = () => {
    setIsEditable(!isEditable);
  };

  const handleChange = (e) => {
    setMember({ ...member, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (id) {
      getMB();
    }
  }, [id]);

  const getMB = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/auth/getinfo/${id}`);
      setMember(res.data);
      console.log("✅ Member Data:", res.data);
    } catch (error) {
      console.error("❌ Error fetching member data:", error);
    }
  };

  const toggleLogout = () => {
    setShowLogoutModal(true); // ✅ Open the modal
  };

  const confirmLogout = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/auth/logout");

      console.log("✅ API Response:", response.data);

      if (response.data.message === "ออกจากระบบเสร็จสิ้น") {
        localStorage.clear();
        setMember({});
        navigate("/");
      } else {
        alert("เกิดข้อผิดพลาด: " + response.data.message);
      }
    } catch (error) {
      console.error("❌ Logout Error:", error);
      alert("เกิดข้อผิดพลาดในการออกจากระบบ");
    } finally {
      setShowLogoutModal(false); // ✅ Close the modal after action
    }
  };

  return (
    <div className="profile-container">
      {/* เมนูด้านซ้าย */}
      <aside className="sidebar">
        <div className="profile-image">
          <img src={profilePic} alt="Profile" />
        </div>
        <nav>
          <button>ประวัติการจอง</button>
          <button>รายการโปรด</button>
          <button>ค้นหาสนาม</button>
          <button>โปรโมชั่น</button>
          <button>คูปอง</button>
        </nav>
        <button className="logout-button" onClick={toggleLogout}>ลงชื่อออก</button>
      </aside>

      {/* ข้อมูลผู้ใช้ */}
      <main className="profile-content">
        <h2>ข้อมูลผู้ใช้</h2>

        {/* ข้อมูลส่วนตัว */}
        <section className="user-info">
          <h3>
            📌 ข้อมูลส่วนตัว 
            <FaPencilAlt className="edit-icon" onClick={toggleEdit} />
          </h3>
          <div className="form-grid">
            <div className="input-group">
              <label>ชื่อ</label>
              <input type="text" name="firstName" value={member?.firstName || ""} onChange={handleChange} readOnly={!isEditable} />
            </div>
            <div className="input-group">
              <label>นามสกุล</label>
              <input type="text" name="lastName" value={member?.lastName || ""} onChange={handleChange} readOnly={!isEditable} />
            </div>
            <div className="input-group">
              <label>เพศ</label>
              <input type="text" name="gender" value={member?.gender || ""} onChange={handleChange} readOnly={!isEditable} />
            </div>
            <div className="input-group">
              <label>หมายเลขโทรศัพท์</label>
              <input type="text" name="phoneNumber" value={member?.phoneNumber || ""} onChange={handleChange} readOnly={!isEditable} />
            </div>
            <div className="input-group">
              <label>กีฬาที่สนใจ</label>
              <input type="text" name="sport" value={member?.interestedSports || ""} onChange={handleChange} readOnly={!isEditable} />
            </div>
            <div className="input-group">
              <label>อีเมล</label>
              <input type="email" name="email" value={member?.email || ""} readOnly />
            </div>
          </div>
        </section>

        {/* บริเวณที่สนใจ */}
        <section className="location-info">
          <h3>
            📍 บริเวณที่สนใจ 
            <FaPencilAlt className="edit-icon" onClick={toggleEdit} />
          </h3>
          <div className="form-grid">
            <div className="input-group">
              <label>ตำบล/แขวง</label>
              <input type="text" name="subdistrict" value={member?.subdistrict || ""} onChange={handleChange} readOnly={!isEditable} />
            </div>
            <div className="input-group">
              <label>อำเภอ/เขต</label>
              <input type="text" name="district" value={member?.district || ""} onChange={handleChange} readOnly={!isEditable} />
            </div>
            <div className="input-group">
              <label>จังหวัด</label>
              <input type="text" name="province" value={member?.province || ""} onChange={handleChange} readOnly={!isEditable} />
            </div>
          </div>
        </section>

        {isEditable && <button className="save-button" onClick={toggleEdit}>บันทึก</button>}
        <button className="forgot-password">ลืมรหัสผ่าน ?</button>
      </main>

      {/* 🔹 Logout Popup Modal */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>ลงชื่อออก</h2>
            <p>แน่ใจหรือไม่</p>
            <div className="modal-buttons">
              <button className="confirm-button" onClick={confirmLogout}>ตกลง</button>
              <button className="cancel-button" onClick={() => setShowLogoutModal(false)}>ยกเลิก</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
