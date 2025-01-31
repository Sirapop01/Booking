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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

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
    <>
     

      <div className="registration-container1">
        <header className="registration-header1">
          <h1>MatchWeb</h1>
          <p>ระบบลงทะเบียนสำหรับผู้ประกอบการ</p>
        </header>
        <main className="registration-content1">
          <h2>ยืนยันข้อมูลการสมัครสมาชิกสำหรับผู้ประกอบการ</h2>
          <p>กรุณากรอกข้อมูลและตรวจสอบข้อมูลให้ครบถ้วน</p>
          <form className="registration-form1" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                เลขบัตรประชาชน *  {errors.idCard && <span className="error-message">{errors.idCard}</span>}
                <input type="text" name="idCard" value={formData.idCard} onChange={handleChange} />
              </label>

              <label>
                ชื่อจริง * {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
              </label>

              <label>
                นามสกุล * {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
              </label>

              <label>
                วัน/เดือน/ปีเกิด * {errors.dob && <span className="error-message">{errors.dob}</span>}
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
              </label>
            </div>

            <div className="form-group">
              <label>
                เบอร์โทรศัพท์มือถือ * {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
                <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
              </label>

              <label>
                อีเมล * {errors.email && <span className="error-message">{errors.email}</span>}
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
              </label>

              {/* รหัสผ่าน */}
              <label className="password-label">
                รหัสผ่าน * {errors.password && <span className="error-message">{errors.password}</span>}
              </label>
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "ซ่อน" : "แสดง"}
                </button>
              </div>
              
              {/* ยืนยันรหัสผ่าน */}
              <label>
                ยืนยันรหัสผ่าน * {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
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
    </>
  );
};

export default RegistrationForm;
