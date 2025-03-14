import React, { useState, useEffect } from "react";
//import "./UserProfile.css";
import defaultProfilePic from "../assets/threeman.png";
import { FaPencilAlt } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./BusinessProfile.css";

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
    const { name, value } = e.target;

    setMember((prevMember) => {
      let updatedValue = value;

      // ✅ แปลงค่าที่ได้รับจาก input type="date" ให้เป็น Date object
      if (name === "dob") {
        updatedValue = new Date(value).toISOString(); // แปลงเป็น ISO String format
      }

      const updatedMember = { ...prevMember, [name]: updatedValue };
      console.log("✏️ Updated Member Data Locally:", updatedMember);
      return updatedMember;
    });
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
      Swal.fire({
        icon: "success",
        title: "🎉 อัปเดตข้อมูลสำเร็จ!",
        text: "ข้อมูลของคุณถูกอัปเดตเรียบร้อยแล้ว",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "ตกลง",
      });

      // ✅ โหลดข้อมูลใหม่จาก API ทันที
      await getMB();

      // ✅ ปิดโหมดแก้ไข
      setIsEditable(false);
      setNewProfileImage(null);
    } catch (error) {
      console.error("❌ Error updating member data:", error);
      Swal.fire({
        icon: "error",
        title: "❌ เกิดข้อผิดพลาด!",
        text: "ไม่สามารถอัปเดตข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        confirmButtonColor: "#d33",
        confirmButtonText: "ตกลง",
      });
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
    <div className="business-profile-container">
      {/* 🔹 Header Navigation */}
      <header className="business-profile-header">
        <nav className="business-nav-menu">
          <button onClick={() => navigate("/stadium-list")}>สนามของฉัน</button>
          <button onClick={() => navigate(`/Ownerledger/${id}`)}>บัญชีรายรับ</button>
          <button onClick={() => navigate(`/Addpromotion`)}>เพิ่มโปรโมชั่น</button>
          <button onClick={() => navigate(`/reviewowner/${id}`)}>รีวิวทั้งหมด</button>
          <button>ตรวจสอบการจ่ายเงิน</button>
          
        </nav>
      </header>
  
      {/* 🔹 Profile Content (Combined Card) */}
      <main className="business-profile-content">
        
  
        {/* ✅ รวมข้อมูลส่วนตัว + บริเวณที่สนใจ */}
        <section className="business-profile-card">
        <div className="business-profile-card-header">
         <h2>
            <span className="jaosanum">ข้อมูลเจ้าของสนาม</span>
         </h2>
        </div>
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
              <input type="text" name="phoneNumber" value={member?.phoneNumber || ""} inputMode="numeric" maxLength="10" onChange={handleChange} readOnly={!isEditable} />
            </div>
            <div className="input-group">
              <label>วัน/เดือน/ปีเกิด</label>
              <input
                type="date"
                name="dob"
                value={member?.dob ? new Date(member.dob).toISOString().split("T")[0] : ""}
                onChange={handleChange}
                readOnly={!isEditable}
              />
            </div>
            <div className="input-group">
              <label>หมายเลขบัตรประชาชน</label>
              <input type="text" name="idCard" value={member?.idCard || ""} readOnly />
            </div>
          </div>


          {/* ✅ ปุ่มบันทึก + ลืมรหัสผ่าน + แก้ไขโปรไฟล์ + Logout */}
          {isEditable && <button className="business-save-button" onClick={updateMemberData}>บันทึก</button>}

        
         {/* ✅ Buttons Aligned Horizontally */}
          <div className="business-action-container">
            <button className="business-edit-profile-button" onClick={toggleEdit}>
              แก้ไขโปรไฟล์
            </button>
           
            <button className="business-logout-button" onClick={toggleLogout}>
              ลงชื่อออก
            </button>
          </div>
          <h3 className="business-forgot-password" onClick={() => navigate("/forgot-password")}>
              ลืมรหัสผ่าน ?
            </h3>
        </section>
      </main>
  
      {/* 🔹 Logout Popup Modal */}
      {showLogoutModal && (
        <div className="logout-popup-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="logout-popup" onClick={(e) => e.stopPropagation()}>
            <p>คุณต้องการออกจากระบบหรือไม่?</p>
            <div className="logout-buttons">
              <button className="confirm-btn" onClick={confirmLogout}>ยืนยัน</button>
              <button className="confirm-btn" onClick={() => setShowLogoutModal(false)}>ยกเลิก</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
  
};

export default BusinessProfile;