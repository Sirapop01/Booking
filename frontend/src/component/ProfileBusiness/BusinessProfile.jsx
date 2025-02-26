import React, { useState, useEffect } from "react";
//import "./UserProfile.css";
import defaultProfilePic from "../assets/threeman.png";
import { FaPencilAlt } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BusinessProfile = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [id, setId] = useState("");
  const [member, setMember] = useState({});
  const [showLogoutModal, setShowLogoutModal] = useState(false); // ✅ New state for popup modal
  const navigate = useNavigate();
  const [decodedToken, setDecodedToken] = useState(null);
  const [token, setToken] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [newProfileImage, setNewProfileImage] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        setDecodedToken(decoded);
        setToken(storedToken);
        setId(decoded.id);
        console.log("decoded", decodedToken)
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
    setIsEditable((prev) => !prev);
  };



  const handleChange = (e) => {
    setMember((prevMember) => {
      const updatedMember = { ...prevMember, [e.target.name]: e.target.value };
      console.log("✏️ Member Updated Locally:", updatedMember);
      return updatedMember;
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewProfileImage(file); // ✅ เก็บไฟล์ไว้ แต่ยังไม่อัปเดต DB
    setProfileImage(URL.createObjectURL(file)); // แสดง preview
    uploadImage(file);
  };

  useEffect(() => {
    if (id) {
      getMB();
    }
  }, [id]);

  const getMB = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/business/getinfo/${id}`);
      console.log("📥 Updated Member Data from DB:", res.data);

      // ✅ เช็คว่าข้อมูลเปลี่ยนหรือไม่ก่อนอัปเดต UI
      setMember((prevMember) => {
        if (JSON.stringify(prevMember) !== JSON.stringify(res.data)) {
          console.log("🔄 Updating UI with New Data:", res.data);
          return res.data;
        }
        return prevMember;
      });

      setProfileImage(res.data.profileImage);
    } catch (error) {
      console.error("❌ Error fetching member data:", error);
    }
  };


  const updateMemberData = async () => {
    try {
      let updatedData = { ...member };
      let imageUrl = profileImage;

      // ✅ อัปโหลดรูปถ้ามีการเปลี่ยนแปลง
      if (newProfileImage) {
        const formData = new FormData();
        formData.append("profileImage", newProfileImage);

        const uploadResponse = await axios.put(
          `http://localhost:4000/api/upload/images/${id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        console.log("✅ Profile Image Updated:", uploadResponse.data);
        imageUrl = uploadResponse.data.profileImage;
        updatedData.profileImage = imageUrl;

      }

      console.log("📤 Sending Updated Data:", updatedData);

      // ✅ อัปเดตข้อมูลผู้ใช้
      const response = await axios.put(`http://localhost:4000/api/business/update/${id}`, updatedData);

      console.log("✅ Updated Member Data:", response.data);
      alert("🎉 อัปเดตข้อมูลสำเร็จ!");

      // ✅ โหลดข้อมูลใหม่จาก API ทันที
      await getMB();

      // ✅ ปิดโหมดแก้ไข
      setIsEditable(false);
      setNewProfileImage(null);
    } catch (error) {
      console.error("❌ Error updating member data:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
    }
  };

  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("profileImage", file);
      formData.append("id", id);

      const response = await axios.put(
        `http://localhost:4000/api/upload/images/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("✅ Profile Image Updated:", response.data);
      alert("🎉 อัปโหลดรูปภาพสำเร็จ!");
      getMB(); // โหลดข้อมูลใหม่
      setIsEditable(false);
    } catch (error) {
      console.error("❌ Error uploading image:", error);
      alert("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ");
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
        sessionStorage.clear();
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
    <div className="profile-container" style={{
      overflowY: "hidden",
      display: "flex",
      minHeight: "100vh",
    }}>
      {/* เมนูด้านซ้าย */}
      <aside
        className="sidebar"
        style={{
          backgroundColor: "#0d1b2a", // น้ำเงินเข้มแบบเต็ม
          height: "100vh", // เต็มความสูงของหน้าจอ
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          paddingTop: "8%"
        }}
      >


        <nav>
          <button onClick={() => navigate("/stadium-list")}>สนามของฉัน</button>
          <button onClick={() => navigate(`/Ownerledger/${id}`)}>บัญชีรายรับ</button>
          <button onClick={() => navigate(`/Addpromotion`)}>เพิ่มโปรโมชั่น</button>
          <button>รีวิวทั้งหมด</button>
          <button>ตรวจสอบการจ่ายเงิน</button>
          <button className="logout-button" onClick={toggleLogout}>ลงชื่อออก</button>
        </nav>

      </aside>

      {/* ข้อมูลผู้ใช้ */}
      <main className="profile-content">
        <h2>ข้อมูลเจ้าของสนาม</h2>

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
              <label>อีเมล</label>
              <input type="email" name="email" value={member?.email || ""} readOnly />
            </div>
            <div className="input-group">
              <label>หมายเลขโทรศัพท์</label>
              <input type="text" name="phoneNumber" value={member?.phoneNumber || ""} onChange={handleChange} readOnly={!isEditable} />
            </div>


          </div>
        </section>

        {/* บริเวณที่สนใจ */}
        <section className="location-info">

          <div className="form-grid">
            <div className="input-group">
              <label>วัน/เดือน/ปีเกิด</label>
              <input
                type="date"
                name="birthdate"
                value={member?.dob ? member.dob.substring(0, 10) : ""}
                onChange={handleChange}
                readOnly={!isEditable}
              />
            </div>
            <div className="input-group">
              <label>หมายเลขบัตรประชาชน</label>
              <input type="idCard" name="idCard" value={member?.idCard || ""} readOnly />
            </div>
          </div>
        </section>

        {isEditable && <button className="save-button" onClick={updateMemberData}>บันทึก</button>}
        .
      </main>

      {/* 🔹 Logout Popup Modal */}
      {showLogoutModal && (
        <div className="logout-popup-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="logout-popup" onClick={(e) => e.stopPropagation()}>
            <p>คุณต้องการออกจากระบบหรือไม่?</p>
            <div className="logout-buttons">
              <button className="confirm-btn" onClick={confirmLogout}>ยืนยัน</button>
              <button className="cancel-btn" onClick={() => setShowLogoutModal(false)}>ยกเลิก</button>
            </div>
          </div>
        </div>
      )}
    </div>


  );
};

export default BusinessProfile;
