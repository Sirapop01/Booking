import React, { useState } from "react";
import { Link } from "react-router-dom"; 
import "./Registeropera.css";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    idCard: "",
    firstName: "",
    lastName: "",
    dob: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // ล้าง error หากผู้ใช้เริ่มพิมพ์ข้อมูล
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value ? "" : prevErrors[name],
    }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.idCard) newErrors.idCard = "กรุณากรอกเลขบัตรประชาชน";
    if (!formData.firstName) newErrors.firstName = "กรุณากรอกชื่อจริง";
    if (!formData.lastName) newErrors.lastName = "กรุณากรอกนามสกุล";
    if (!formData.dob) newErrors.dob = "กรุณาระบุวันเกิด";
    if (!formData.phoneNumber) newErrors.phoneNumber = "กรุณากรอกเบอร์โทรศัพท์";
    if (!formData.email) newErrors.email = "กรุณากรอกอีเมล";
    if (!formData.password) newErrors.password = "กรุณากรอกรหัสผ่าน";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "รหัสผ่านไม่ตรงกัน";
    if (!formData.acceptTerms) newErrors.acceptTerms = "โปรดยอมรับเงื่อนไข";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form Data Submitted:", formData);
      alert("สมัครสมาชิกสำเร็จ!");
    }
  };

  return (
    <div className="registration-container">
      <header className="registration-header">
        <h1>MatchWeb</h1>
        <p>ระบบลงทะเบียนสำหรับผู้ประกอบการ</p>
      </header>
      <main className="registration-content">
        <h2>ยืนยันข้อมูลการสมัครสมาชิกสำหรับผู้ประกอบการ</h2>
        <p>กรุณากรอกข้อมูลและตรวจสอบข้อมูลให้ครบถ้วน</p>
        <form className="registration-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              เลขบัตรประชาชน *
              <input type="text" name="idCard" value={formData.idCard} onChange={handleChange} />
              {errors.idCard && <span className="error-message">{errors.idCard}</span>}
            </label>

            <label>
              ชื่อจริง *
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </label>

            <label>
              นามสกุล *
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </label>

            <label>
              วัน/เดือน/ปีเกิด *
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
              {errors.dob && <span className="error-message">{errors.dob}</span>}
            </label>
          </div>

          <div className="form-group">
            <label>
              เบอร์โทรศัพท์มือถือ *
              <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
              {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
            </label>

            <label>
              อีเมล *
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </label>

            <label>
              รหัสผ่าน *
              <input type="password" name="password" value={formData.password} onChange={handleChange} />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </label>

            <label>
              ยืนยันรหัสผ่าน *
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </label>
          </div>

          <div className="form-terms">
            <label>
              <input type="checkbox" name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange} />
              <span className="accept-text">ยอมรับ</span>
              <Link to="/OperaRequri" className="highlight-conditions"> ข้อกำหนดและเงื่อนไข</Link>
            </label>
            {errors.acceptTerms && <span className="error-message">{errors.acceptTerms}</span>}
          </div>

          <div className="submit-button-container">
            <button type="submit" className="submit-button">ดำเนินการต่อ</button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default RegistrationForm;
