import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterCustomer.css';
import logo from '../assets/logo.png';
import axios from 'axios';

function RegisterCustomer() {
  const navigate = useNavigate();

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

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '', // ❌ ไม่ต้องเก็บใน DB แต่ใช้เช็คค่าที่กรอก
    firstName: '',
    lastName: '',
    gender: '', // ✅ เพิ่ม gender ให้ตรงกับ Schema
    phoneNumber: '',
    birthdate: '', // ✅ เปลี่ยนจาก `dob` เป็น `birthdate`
    interestedSports: '',
    province: '',
    district: '',
    subdistrict: '',
    profileImage: null,
    role: 'user', // ✅ เพิ่ม role (กำหนดค่าเริ่มต้นเป็น "user")
    gender: '',
  });

  const [errors, setErrors] = useState({});
  const [districts, setDistricts] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);

  const validateForm = () => {
    let newErrors = {};
    if (!formData.profileImage) newErrors.profileImage = "กรุณาใส่รูปโปรไฟล์";
    if (!formData.firstName) newErrors.firstName = "กรุณากรอกชื่อจริง";
    if (!formData.lastName) newErrors.lastName = "กรุณากรอกนามสกุล";
    if (!formData.email) newErrors.email = "กรุณากรอกอีเมล";
    if (!formData.phoneNumber) newErrors.phoneNumber = "กรุณากรอกเบอร์โทรศัพท์";
    if (!formData.password) newErrors.password = "กรุณากรอกรหัสผ่าน";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "รหัสผ่านไม่ตรงกัน";
    if (!formData.birthdate) newErrors.birthdate = "กรุณาเลือกวัน/เดือน/ปีเกิด";
    if (!formData.interestedSports) newErrors.interestedSports = "กรุณากรอกกีฬาที่สนใจ";
    if (!formData.province || !formData.district || !formData.subdistrict) {
      newErrors.location = "กรุณากรอกข้อมูลให้ครบ";
    }
    if (!formData.gender) newErrors.gender = "กรุณาเลือกเพศ";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prevState => {
      let updatedData = { ...prevState, [name]: files ? files[0] : value };

      if (name === "province") {
        const selectedDistricts = Object.keys(locationData[value] || {});
        setDistricts(selectedDistricts);
        setSubdistricts([]);
        updatedData = { ...updatedData, district: '', subdistrict: '' };
      }

      if (name === "district") {
        const selectedSubdistricts = locationData[formData.province]?.[value] || [];
        setSubdistricts(selectedSubdistricts);
        updatedData = { ...updatedData, subdistrict: '' };
      }

      return updatedData;
    });
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: value ? "" : prevErrors[name]
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      let userData = { ...formData }; // ✅ เก็บข้อมูลทั้งหมดในรูปแบบ JSON
      let uploadedImageUrl = null;

      if (formData.profileImage) {
        let imageData = new FormData();
        imageData.append("profileImage", formData.profileImage);

        console.log("📤 Uploading Image...");
        const uploadResponse = await axios.post("http://localhost:4000/api/upload/uploadProfile", imageData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("✅ Uploaded Image:", uploadResponse.data);
        uploadedImageUrl = uploadResponse.data.imageUrl; // ✅ เก็บค่ารูปที่อัปโหลด
        userData.profileImage = uploadedImageUrl; // ✅ อัปเดตรูปภาพใน JSON
      }

      // ✅ Debug JSON ก่อนส่งไป Backend
      console.log("📤 Register Request JSON:", JSON.stringify(userData, null, 2));

      // ✅ ส่งข้อมูลไป Backend ในรูปแบบ JSON
      const response = await axios.post("http://localhost:4000/api/auth/register", userData, {
        headers: { "Content-Type": "application/json" }, // ✅ ใช้ JSON แทน multipart/form-data
      });

      alert("✅ สมัครสมาชิกสำเร็จ!");
      navigate("/login");

    } catch (err) {
      console.error("❌ Registration Error:", err);
      alert("❌ เกิดข้อผิดพลาด: " + (err.response?.data?.message || "ลองใหม่อีกครั้ง"));
    }

  };




  return (
    <div className="container1">
      <header className="header">
        <img src={logo} alt="MatchWeb Logo" />
        <h1>MatchWeb</h1>
        <p>ระบบลงทะเบียนสำหรับผู้ใช้งาน</p>
      </header>
      <div className="right-side">
        <h2 className="register-heading">ยืนยันข้อมูลการสมัครสมาชิกสำหรับผู้ใช้งาน</h2>
        <p className="subtext">กรุณากรอกข้อมูลและตรวจสอบให้ครบถ้วน</p>
        <form onSubmit={handleRegister}>
          <div className="profile-gender-phone-container">
            <div className="profile-section">
              <label>รูปโปรไฟล์ *{errors.profileImage && <span className="error-message-register">{errors.profileImage}</span>}</label>
              <input type="file" name="profileImage" onChange={handleChange} />
            </div>
            <div className="gender-section">
              <label>เพศ *{errors.gender && <span className="error-message-register">{errors.gender}</span>}</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">เลือกเพศ</option>
                <option value="male">ชาย</option>
                <option value="female">หญิง</option>
                <option value="other">อื่นๆ</option>
              </select>
            </div>
            <div className="phone-section">
              <label>เบอร์โทรศัพท์มือถือ *{errors.phoneNumber && <span className="error-message-register">{errors.phoneNumber}</span>}</label>
              <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
            </div>
          </div>

          <div className="form-container">
            <div className="form-column">
              <label>ชื่อจริง *{errors.firstName && <span className="error-message-register">{errors.firstName}</span>}</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
              <label>นามสกุล *{errors.lastName && <span className="error-message-register">{errors.lastName}</span>}</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
              <label>กีฬาที่สนใจ *{errors.interestedSports && <span className="error-message-register">{errors.interestedSports}</span>}</label>
              <input type="text" name="interestedSports" value={formData.interestedSports} onChange={handleChange} />
              <label>วัน/เดือน/ปีเกิด *{errors.birthdate && <span className="error-message-register">{errors.birthdate}</span>}</label>
              <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} />
            </div>

            <div className="form-column">
              <label>อีเมล *{errors.email && <span className="error-message-register">{errors.email}</span>}</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
              <label>รหัสผ่าน *{errors.password && <span className="error-message-register">{errors.password}</span>}</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} />
              <label>ยืนยันรหัสผ่าน *{errors.confirmPassword && <span className="error-message-register">{errors.confirmPassword}</span>}</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
              <label>จังหวัด / อำเภอ / ตำบล *{errors.location && <span className="error-message-register">{errors.location}</span>}</label>
              <div className="location-container">
                <select name="province" value={formData.province} onChange={handleChange}>
                  <option value="">จังหวัด</option>
                  {Object.keys(locationData).map((province) => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
                <select name="district" value={formData.district} onChange={handleChange} disabled={!districts.length}>
                  <option value="">อำเภอ</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
                <select name="subdistrict" value={formData.subdistrict} onChange={handleChange} disabled={!subdistricts.length}>
                  <option value="">ตำบล</option>
                  {subdistricts.map((subdistrict) => (
                    <option key={subdistrict} value={subdistrict}>{subdistrict}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="button-container">
            <button type="submit" className="register-button">ลงทะเบียน</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterCustomer;
