import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterCustomer.css';
import registerImage from '../assets/threeman.png'; // ภาพนักกีฬา PNG
import logo from '../assets/logo.png'; // โลโก้

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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRegister = () => {
    console.log('Registration data:', formData);
  };

  const handleGoBack = () => {
    navigate('/login');
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
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="อีเมล"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="รหัสผ่าน"
          />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="ยืนยันรหัสผ่าน"
          />
          <div className="name-container">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="ชื่อ"
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="นามสกุล"
            />
          </div>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">เพศ</option>
            <option value="male">ชาย</option>
            <option value="female">หญิง</option>
          </select>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="เบอร์โทรศัพท์"
          />
          <input
            type="text"
            name="interestedSports"
            value={formData.interestedSports}
            onChange={handleChange}
            placeholder="กีฬาที่สนใจ"
          />
          <div className="location-container">
            <select
              name="province"
              value={formData.province}
              onChange={handleChange}
            >
              <option value="">จังหวัด</option>
            </select>
            <select
              name="district"
              value={formData.district}
              onChange={handleChange}
            >
              <option value="">อำเภอ</option>
            </select>
            <select
              name="subdistrict"
              value={formData.subdistrict}
              onChange={handleChange}
            >
              <option value="">ตำบล</option>
            </select>
          </div>
          <button className="register-button" onClick={handleRegister}>
            ลงทะเบียน
          </button>
          <p className="login-link" onClick={handleGoBack}>
            กลับไปลงชื่อเข้าใช้
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterCustomer;
