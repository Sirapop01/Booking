import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterCustomer.css';
import logo from '../assets/logo.png';
import axios from 'axios';

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
    birthdate: '',
    interestedSports: '',
    province: '',
    district: '',
    subdistrict: '',
    profileImage: null,
    role: 'customer',
  });

  const [errors, setErrors] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);

  // ✅ โหลดรายชื่อจังหวัดจาก API เมื่อ Component โหลด
  useEffect(() => {
    axios.get("http://localhost:4000/api/location/provinces")
      .then((res) => setProvinces(res.data))
      .catch((err) => console.error("❌ Error fetching provinces:", err));
  }, []);

  // ✅ โหลดรายชื่ออำเภอเมื่อเปลี่ยนจังหวัด
  const handleProvinceChange = async (e) => {
    const provinceName = e.target.value;
    setFormData({ ...formData, province: provinceName, district: "", subdistrict: "" });

    try {
      const res = await axios.get(`http://localhost:4000/api/location/districts/${encodeURIComponent(provinceName)}`);
      setDistricts(res.data);
      setSubdistricts([]); // รีเซ็ตตำบล
    } catch (error) {
      console.error("❌ Error fetching districts:", error);
    }
  };


  // ✅ โหลดรายชื่อตำบลเมื่อเปลี่ยนอำเภอ
  const handleDistrictChange = async (e) => {
    const districtId = e.target.value;
    setFormData({ ...formData, district: districtId, subdistrict: "" });

    try {
      const res = await axios.get(`http://localhost:4000/api/location/subdistricts/${formData.province}/${districtId}`);
      setSubdistricts(res.data);
    } catch (error) {
      console.error("❌ Error fetching subdistricts:", error);
    }
  };

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
    if (!formData.province || !formData.district || !formData.subdistrict) newErrors.location = "กรุณากรอกข้อมูลที่อยู่ให้ครบ";
    if (!formData.gender) newErrors.gender = "กรุณาเลือกเพศ";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "province") {
      setFormData({ ...formData, province: value, district: "", subdistrict: "" });
      setDistricts([]);
      setSubdistricts([]);

      try {
        const res = await axios.get(`http://localhost:4000/api/location/districts/${value}`);
        setDistricts(res.data);
      } catch (error) {
        console.error("❌ Error fetching districts:", error);
      }
    }

    if (name === "district") {
      setFormData({ ...formData, district: value, subdistrict: "" });
      setSubdistricts([]);

      try {
        const res = await axios.get(`http://localhost:4000/api/location/subdistricts/${formData.province}/${value}`);
        setSubdistricts(res.data);
      } catch (error) {
        console.error("❌ Error fetching subdistricts:", error);
      }
    }
  };


  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const submitFormData = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "confirmPassword") return;
        submitFormData.append(key, value);
      });

      await axios.post('http://localhost:4000/api/auth/register', submitFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('✅ สมัครสมาชิกสำเร็จ!');
      navigate('/login');
    } catch (err) {
      console.error('❌ Registration Error:', err);
      alert('❌ เกิดข้อผิดพลาด: ' + (err.response?.data?.message || 'ลองใหม่อีกครั้ง'));
    }
  };



  return (
    <div className="container1">
      <div className="right-side">
            <header className="register-header">
        <h1>
          <img src={logo} alt="MatchWeb Logo" className="register-logo" />
          <span>MatchWeb</span> {/* 🔹 ใส่ <span> เพื่อให้ขยับเฉพาะข้อความ */}
        </h1>
            <p>ระบบลงทะเบียนสำหรับผู้ใช้งาน</p>
            </header>

        <h2 className="register-heading">ยืนยันข้อมูลการสมัครสมาชิกสำหรับผู้ใช้งาน</h2>
        <p className="subtext">กรุณากรอกข้อมูลและตรวจสอบให้ครบถ้วน</p>
        <form onSubmit={handleRegister}>
          <div className="profile-gender-phone-container">
            <div className="profile-section">
              <label>รูปโปรไฟล์ *{errors.profileImage && <span className="error-message-register">{errors.profileImage}</span>}</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, profileImage: e.target.files[0] })}
              />
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

          <div className="form-container1414">
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
                <label>จังหวัด</label>
                <select name="province" value={formData.province} onChange={handleChange}>
                  <option value="">เลือกจังหวัด</option>
                  {provinces.map((province) => (
                    <option key={province.id} value={province.name_th}>{province.name_th}</option>
                  ))}
                </select>

                <label>อำเภอ</label>
                <select name="district" value={formData.district} onChange={handleChange} disabled={!districts.length}>
                  <option value="">เลือกอำเภอ</option>
                  {districts.map((district) => (
                    <option key={district.id} value={district.name_th}>{district.name_th}</option>
                  ))}
                </select>

                <label>ตำบล</label>
                <select name="subdistrict" value={formData.subdistrict} onChange={(e) => setFormData({ ...formData, subdistrict: e.target.value })} disabled={!subdistricts.length}>
                  <option value="">เลือกตำบล</option>
                  {subdistricts.map((subdistrict) => (
                    <option key={subdistrict.id} value={subdistrict.name_th}>{subdistrict.name_th}</option>
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
