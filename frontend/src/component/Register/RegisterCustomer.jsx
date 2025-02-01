import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RegisterCustomer.css';
import logo from '../assets/logo.png';

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
    phoneNumber: '',
    birthdate: '',
    interestedSports: '',
    province: '',
    district: '',
    subdistrict: '',
    profileImage: null,
  });

  const [errors, setErrors] = useState({});
  const [districts, setDistricts] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profileImage") {
      setFormData(prevState => ({ ...prevState, profileImage: files[0] }));
      return;
    }

    if (name === "province") {
      const selectedDistricts = Object.keys(locationData[value] || {});
      setDistricts(selectedDistricts);
      setSubdistricts([]); // Reset subdistricts when province changes
      setFormData(prevState => ({
        ...prevState,
        province: value,
        district: '',
        subdistrict: ''
      }));
      return;
    }

    if (name === "district") {
      const selectedSubdistricts = locationData[formData.province]?.[value] || [];
      setSubdistricts(selectedSubdistricts);
      setFormData(prevState => ({
        ...prevState,
        district: value,
        subdistrict: ''
      }));
      return;
    }

    setFormData(prevState => ({ ...prevState, [name]: value }));
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    let newErrors = {};

    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = "กรุณากรอกข้อมูล";
      }
    });

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "รหัสผ่านไม่ตรงกัน";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    alert("✅ สมัครสมาชิกสำเร็จ!");
    navigate("/login");
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
          <div className="form-row">
            <div>
              <label>รูปโปรไฟล์ *</label>
              <input type="file" name="profileImage" onChange={handleChange} accept="image/*" />
              {errors.profileImage && <p className="error-message">{errors.profileImage}</p>}

              <label>ชื่อจริง *</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
              {errors.firstName && <p className="error-message">{errors.firstName}</p>}

              <label>นามสกุล *</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
              {errors.lastName && <p className="error-message">{errors.lastName}</p>}

              <label>กีฬาที่สนใจ *</label>
              <input type="text" name="interestedSports" value={formData.interestedSports} onChange={handleChange} />
              {errors.interestedSports && <p className="error-message">{errors.interestedSports}</p>}

              <label>วัน/เดือน/ปีเกิด *</label>
              <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} />
              {errors.birthdate && <p className="error-message">{errors.birthdate}</p>}
            </div>

            <div>
              <label>เบอร์โทรศัพท์มือถือ *</label>
              <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
              {errors.phoneNumber && <p className="error-message">{errors.phoneNumber}</p>}

              <label>อีเมล *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
              {errors.email && <p className="error-message">{errors.email}</p>}

              <label>รหัสผ่าน *</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} />
              {errors.password && <p className="error-message">{errors.password}</p>}

              <label>ยืนยันรหัสผ่าน *</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
              {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}

              <label>จังหวัด / อำเภอ / ตำบล *</label>
              <div className="location-container">
                <select name="province" value={formData.province} onChange={handleChange}>
                  <option value="">จังหวัด</option>
                  {Object.keys(locationData).map((province) => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
                {errors.province && <p className="error-message">{errors.province}</p>}

                <select name="district" value={formData.district} onChange={handleChange} disabled={!districts.length}>
                  <option value="">อำเภอ</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
                {errors.district && <p className="error-message">{errors.district}</p>}

                <select name="subdistrict" value={formData.subdistrict} onChange={handleChange} disabled={!subdistricts.length}>
                  <option value="">ตำบล</option>
                  {subdistricts.map((subdistrict) => (
                    <option key={subdistrict} value={subdistrict}>{subdistrict}</option>
                  ))}
                </select>
                {errors.subdistrict && <p className="error-message">{errors.subdistrict}</p>}
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
