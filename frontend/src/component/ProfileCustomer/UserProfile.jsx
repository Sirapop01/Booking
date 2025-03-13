import React, { useState, useEffect } from "react";
import "./UserProfile.css";
import defaultProfilePic from "../assets/threeman.png";
import { FaPencilAlt } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const UserProfile = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [id, setId] = useState("");
  const [member, setMember] = useState({});
  const [showLogoutModal, setShowLogoutModal] = useState(false); // ✅ New state for popup modal
  const navigate = useNavigate();
  const [decodedToken, setDecodedToken] = useState(null);
  const [token, setToken] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");

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
    if (file) {
      setNewProfileImage(file); // ✅ เก็บไฟล์ไว้ แต่ยังไม่อัปโหลด
      setProfileImage(URL.createObjectURL(file)); // ✅ แสดงรูปที่เลือกเป็น preview
    }
  };


  useEffect(() => {
    if (id) {
      console.log("✅ Ready to fetch data with ID:", id);
      getMB();
    }
  }, [id]);

  // ✅ โหลดรายชื่อจังหวัด
  useEffect(() => {
    axios.get("http://localhost:4000/api/location/provinces")
      .then((res) => setProvinces(res.data))
      .catch((err) => console.error("❌ Error fetching provinces:", err));
  }, []);

  // ✅ โหลดอำเภอเมื่อเลือกจังหวัด
  const handleProvinceChange = async (e) => {
    const provinceName = e.target.value;
    setMember({ ...member, province: provinceName, district: "", subdistrict: "" });

    try {
      const res = await axios.get(`http://localhost:4000/api/location/districts/${provinceName}`);
      setDistricts(res.data);
      setSubdistricts([]);
    } catch (error) {
      console.error("❌ Error fetching districts:", error);
    }
  };

  // ✅ โหลดตำบลเมื่อเลือกอำเภอ
  const handleDistrictChange = async (e) => {
    const districtName = e.target.value;
    setMember({ ...member, district: districtName, subdistrict: "" });

    try {
      const res = await axios.get(`http://localhost:4000/api/location/subdistricts/${member.province}/${districtName}`);
      setSubdistricts(res.data);
    } catch (error) {
      console.error("❌ Error fetching subdistricts:", error);
    }
  };


  const getMB = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/auth/getinfo/${id}`);
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
  
      if (newProfileImage) {
        await uploadImage(newProfileImage); // ✅ Upload image first
      }
  
      console.log("📤 Sending Updated Data:", updatedData);
  
      const response = await axios.put(`http://localhost:4000/api/auth/update/${id}`, updatedData);
      console.log("✅ Updated Member Data:", response.data);
  
      alert("🎉 อัปเดตข้อมูลสำเร็จ!");
      await getMB();
      setIsEditable(false);
      setNewProfileImage(null);
    } catch (error) {
      console.error("❌ Error updating member data:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
    }
  };
  
  const uploadImage = async (file) => {
    try {
        if (!file) {
            alert("กรุณาเลือกไฟล์ก่อนอัปโหลด");
            return;
        }

        const formData = new FormData();
        formData.append("profileImage", file);

        console.log("📤 กำลังอัปโหลดไฟล์:", file);

        const response = await axios.put(
            `http://localhost:4000/api/auth/updateProfileImage/${id}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );

        console.log("✅ อัปโหลดรูปภาพสำเร็จ:", response.data);
        alert("🎉 อัปโหลดรูปภาพสำเร็จ!");
        getMB(); // โหลดข้อมูลใหม่
        setIsEditable(false);
    } catch (error) {
        console.error("❌ อัปโหลดรูปไม่สำเร็จ:", error);
        alert("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ");
    }
};


  const toggleLogout = () => {
    setShowLogoutModal(true); // ✅ Open the modal
  };

  const DeleteUser = async () => {
    try {
      // ✅ ให้ผู้ใช้กรอกอีเมลเพื่อยืนยัน
      const { value: emailInput } = await Swal.fire({
        title: "ยืนยันการลบบัญชี",
        input: "email",
        inputLabel: "กรุณากรอกอีเมลของคุณ",
        inputPlaceholder: member.email,
        showCancelButton: true,
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
        customClass: {
          input: "swal-input-custom", // ✅ ปรับแต่ง input
          confirmButton: "swal-confirm-btn", // ✅ ปรับแต่งปุ่ม "ยืนยัน"
          cancelButton: "swal-cancel-btn" // ✅ ปรับแต่งปุ่ม "ยกเลิก"
        },
        inputValidator: (value) => {
          if (!value) {
            return "กรุณากรอกอีเมล!";
          }
          if (value !== member.email) {
            return "อีเมลไม่ถูกต้อง!";
          }
        }
      });

      // ✅ ถ้าไม่ได้กด "ยืนยัน" ให้ยกเลิกการลบ
      if (!emailInput) {
        return;
      }

      // ✅ แสดง SweetAlert ยืนยันก่อนส่ง API
      const confirmDelete = await Swal.fire({
        title: "คุณแน่ใจหรือไม่?",
        text: "เมื่อลบแล้วจะไม่สามารถกู้คืนบัญชีได้!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "ลบบัญชี",
        cancelButtonText: "ยกเลิก"
      });

      if (!confirmDelete.isConfirmed) {
        return;
      }

      const response = await axios.delete(`http://localhost:4000/api/auth/delete/${id}`)

      if (response.status === 200) {
        await Swal.fire("ลบสำเร็จ!", "บัญชีของคุณถูกลบแล้ว", "success");
        localStorage.clear();
        sessionStorage.clear();
        navigate("/");
      } else {
        await Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถลบบัญชีได้", "error");
      }
    } catch (error) {
      console.log("❌ ไม่สามารถลบข้อมูลผู้ใช้ได้", error);
      await Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถลบบัญชีได้", "error");
    }
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
    <div className="profile-container" type="user-profile">
      {/* 🔹 Header Navigation */}
      <header className="profile-header">
        <nav className="nav-menu">
          <button onClick={() => navigate("/historybooking")}>ประวัติการจอง</button>
          <button onClick={() => navigate("/FavoritesList")}>รายการโปรด</button>
          <button onClick={() => navigate("/")}>ค้นหาสนาม</button>
          <button onClick={() => navigate("/promotion")}>โปรโมชั่น</button>
          <button onClick={() => navigate("/Discount")}>คูปอง</button>
        </nav>
      </header>
  
      {/* 🔹 Profile Card (Left Side) */}
      <aside className="profile-card">
        <div className="profile-image">
          <label htmlFor="fileUpload" className="image-upload-label">
            <img src={profileImage || defaultProfilePic} alt="Profile" />
            {isEditable && (
              <input
                id="fileUpload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="image-upload-input"
              />
            )}
          </label>
        </div>
  
        {/* ✅ "Edit Profile" Button (Only when NOT editing) */}
{!isEditable && (
  <button className="edit-profile-button" onClick={toggleEdit}>
    แก้ไขโปรไฟล์และข้อมูล
  </button>
)}

{/* ✅ "บันทึก" (Save) Button (Only when Editing) */}
{isEditable && (
  <button className="save-button" onClick={updateMemberData}>
    บันทึก
  </button>
)}

  
        
  
        {/* ✅ Account Actions: Forgot Password & Delete Account */}
        <div className="account-actions">
          <h3 className="forgot-password-user" onClick={() => navigate("/forgot-password")}>
            ลืมรหัสผ่าน ?
          </h3>
          <h3 className="user-delete" onClick={DeleteUser}>
            ลบบัญชี !
          </h3>
        </div>
  
        {/* ✅ Logout Button */}
        <button className="logout-button" onClick={toggleLogout}>
          ลงชื่อออก
        </button>
      </aside>
  
      {/* 🔹 Profile Content (Right Side) */}
      <main className="profile-content">
        {/* ✅ Personal Info Card */}
        <div className="info-card">
          <h3>📌 ข้อมูลส่วนตัว</h3>
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
            <div className="input-group">
              <label>วัน/เดือน/ปีเกิด</label>
              <input type="date" name="birthdate" value={member?.birthdate ? member.birthdate.substring(0, 10) : ""} onChange={handleChange} readOnly={!isEditable} />
            </div>
          </div>
        </div>
  
        {/* ✅ Location Info Card */}
        <div className="info-card">
          <h3>📍 บริเวณที่สนใจ</h3>
          <div className="form-grid">
            {isEditable ? (
              <>
                <div className="input-group">
                  <label>จังหวัด</label>
                  <select name="province" value={member.province || ""} onChange={handleProvinceChange}>
                    <option value="">เลือกจังหวัด</option>
                    {provinces.map((province) => (
                      <option key={province.name_th} value={province.name_th}>{province.name_th}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label>อำเภอ</label>
                  <select name="district" value={member.district || ""} onChange={handleDistrictChange} disabled={!districts.length}>
                    <option value="">เลือกอำเภอ</option>
                    {districts.map((district) => (
                      <option key={district.name_th} value={district.name_th}>{district.name_th}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label>ตำบล</label>
                  <select name="subdistrict" value={member.subdistrict || ""} onChange={(e) => setMember({ ...member, subdistrict: e.target.value })} disabled={!subdistricts.length}>
                    <option value="">เลือกตำบล</option>
                    {subdistricts.map((subdistrict) => (
                      <option key={subdistrict.name_th} value={subdistrict.name_th}>{subdistrict.name_th}</option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <>
                <div className="input-group">
                  <label>จังหวัด</label>
                  <input type="text" name="province" value={member?.province || ""} readOnly />
                </div>
                <div className="input-group">
                  <label>อำเภอ/เขต</label>
                  <input type="text" name="district" value={member?.district || ""} readOnly />
                </div>
                <div className="input-group">
                  <label>ตำบล/แขวง</label>
                  <input type="text" name="subdistrict" value={member?.subdistrict || ""} readOnly />
                </div>
              </>
            )}
          </div>
        </div>
      </main>
  
      {/* ✅ Logout Popup Modal */}
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



export default UserProfile;
