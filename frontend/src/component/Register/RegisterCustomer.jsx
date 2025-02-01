import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterCustomer.css';
import logo from '../assets/logo.png';

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

  const validateForm = () => {
    let newErrors = {};
    if (!formData.profileImage) newErrors.profileImage = "กรุณาอัปโหลดรูปโปรไฟล์";
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

  const handleRegister = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert("✅ สมัครสมาชิกสำเร็จ!");
      navigate("/login");
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
          <div className="form-row">
            <div>
              <label>
                รูปโปรไฟล์ * {errors.profileImage && <span className="error-message">{errors.profileImage}</span>}
              </label>
              <input type="file" name="profileImage" onChange={handleChange} />

              <label>
                ชื่อจริง * {errors.firstName && <span className="error-message">{errors.firstName}</span>}
              </label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />

              <label>
                นามสกุล * {errors.lastName && <span className="error-message">{errors.lastName}</span>}
              </label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />

              <label>
                กีฬาที่สนใจ * {errors.interestedSports && <span className="error-message">{errors.interestedSports}</span>}
              </label>
              <input type="text" name="interestedSports" value={formData.interestedSports} onChange={handleChange} />
            </div>

            <div>
              <label>
                เบอร์โทรศัพท์มือถือ * {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
              </label>
              <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />

              <label>
                อีเมล * {errors.email && <span className="error-message">{errors.email}</span>}
              </label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />

              <label>
                รหัสผ่าน * {errors.password && <span className="error-message">{errors.password}</span>}
              </label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} />

              <label>
                ยืนยันรหัสผ่าน * {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div>
              <label>
                วัน/เดือน/ปีเกิด * {errors.birthdate && <span className="error-message">{errors.birthdate}</span>}
              </label>
              <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} />
            </div>

            <div>
              <label>
                จังหวัด / อำเภอ / ตำบล * {errors.location && <span className="error-message">{errors.location}</span>}
              </label>
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
