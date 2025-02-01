import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RegisterCustomer.css';
import registerImage from '../assets/threeman.png';
import logo from '../assets/logo.png';

// ตัวอย่างข้อมูลจังหวัด อำเภอ และตำบล
const locationData = {
  "กรุงเทพมหานคร": {
    "เขตบางรัก": ["บางรัก", "สีลม", "มหาพฤฒาราม"],
    "เขตปทุมวัน": ["ปทุมวัน", "รองเมือง", "ลุมพินี"]
  },
  "เชียงใหม่": {
    "อำเภอเมืองเชียงใหม่": ["ช้างเผือก", "พระสิงห์", "ศรีภูมิ"],
    "อำเภอหางดง": ["หนองควาย", "หางดง", "น้ำแพร่"]
  }
};

function RegisterCustomer() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    gender: '',
    phoneNumber: '',
    interestedSports: '',
    province: '',
    district: '',
    subdistrict: '',
    profileImage: null,
  });

  const [districts, setDistricts] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);

  



  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profileImage") {
      setFormData((prevData) => ({
        ...prevData,
        profileImage: files[0], // เก็บไฟล์แรกที่เลือก
      }));
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));


    // เมื่อเลือกจังหวัด อัปเดตรายการอำเภอ
    if (name === "province") {
      setDistricts(Object.keys(locationData[value] || {}));
      setSubdistricts([]);
      setFormData((prevData) => ({
        ...prevData,
        district: '',
        subdistrict: '',
      }));
    }

    // เมื่อเลือกอำเภอ อัปเดตรายการตำบล
    if (name === "district") {
      setSubdistricts(locationData[formData.province]?.[value] || []);
      setFormData((prevData) => ({
        ...prevData,
        subdistrict: '',
      }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
  
    try {
      const formDataToSend = new FormData();
      
      // เพิ่มค่าปกติลง FormData
      Object.keys(formData).forEach((key) => {
        if (key !== "profileImage") { // ป้องกันการส่งค่า null
          formDataToSend.append(key, formData[key]);
        }
      });
  
      // ✅ เพิ่มไฟล์รูปภาพแค่ถ้ามีการเลือก
      if (formData.profileImage) {
        formDataToSend.append("profileImage", formData.profileImage);
      }
  
      formDataToSend.append("role", "user");
  
      const response = await axios.post("http://localhost:4000/api/auth/register", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      alert("✅ สมัครสมาชิกสำเร็จ!");
      navigate("/login");
    } catch (err) {
      alert("❌ เกิดข้อผิดพลาด: " + (err.response?.data?.message || "ลองใหม่อีกครั้ง"));
    }
  };

  return (
    <div className="container1">
      <div className="left-side">
        <div className="image-container">
          <img src={logo} alt="Logo" className="logo-on-image" />
          <p className="logo-text-on-image">MatchWeb</p>
          <img src={registerImage} alt="Athletes" className="register-image" />
        </div>
      </div>
      <div className="right-side">
        <h1 className="register-heading">ลงทะเบียน</h1>
        <div className="form-container">
          <form onSubmit={handleRegister}>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="อีเมล" required />
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="รหัสผ่าน" required />
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="ยืนยันรหัสผ่าน" required />

            <div className="name-container">
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="ชื่อ" required />
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="นามสกุล" required />
            </div>

            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">เพศ</option>
              <option value="male">ชาย</option>
              <option value="female">หญิง</option>
            </select>

            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="เบอร์โทรศัพท์" required />
            <input type="text" name="interestedSports" value={formData.interestedSports} onChange={handleChange} placeholder="กีฬาที่สนใจ" />

            <div className="location-container">
              <select name="province" value={formData.province} onChange={handleChange} required>
                <option value="">เลือกจังหวัด</option>
                {Object.keys(locationData).map((province) => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>

              <select name="district" value={formData.district} onChange={handleChange} required disabled={!districts.length}>
                <option value="">เลือกอำเภอ</option>
                {districts.map((district) => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>

              <select name="subdistrict" value={formData.subdistrict} onChange={handleChange} required disabled={!subdistricts.length}>
                <option value="">เลือกตำบล</option>
                {subdistricts.map((subdistrict) => (
                  <option key={subdistrict} value={subdistrict}>{subdistrict}</option>
                ))}
              </select>
              <input type="file" name="profileImage" onChange={handleChange} accept="image/*" required />
            </div>

            <button type="submit" className="register-button">ลงทะเบียน</button>
          </form>

          <p className="login-link" onClick={() => navigate('/login')}>
            กลับไปลงชื่อเข้าใช้
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterCustomer;
