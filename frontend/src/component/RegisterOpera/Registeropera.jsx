import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link
import "./RegisterOpera.css";
/**/ 
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

  const [errorMessage, setErrorMessage] = useState(""); // State สำหรับข้อความแจ้งเตือน

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (name === "acceptTerms") {
      setErrorMessage(""); // ล้างข้อความแจ้งเตือนเมื่อ Checkbox ถูกติ๊ก
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.acceptTerms) {
      setErrorMessage("โปรดกด Checkbox ก่อน");
      return;
    }
    console.log("Form Data Submitted:", formData);
    setErrorMessage(""); // ล้างข้อความแจ้งเตือนหลังส่งฟอร์มสำเร็จ
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
            <div className="form-column">
              <label>
                เลขบัตรประชาชน *
                <input
                  type="text"
                  name="idCard"
                  value={formData.idCard}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                ชื่อจริง *
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                นามสกุล *
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                วัน/เดือน/ปีเกิด *
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div className="divider"></div>
            <div className="form-column">
              <label>
                เบอร์โทรศัพท์มือถือ *
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                อีเมล *
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                รหัสผ่าน *
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                ยืนยันรหัสผ่าน *
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
          </div>
          <div className="form-terms">
            <label className="terms-label">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
              />
              <span>
                ยอมรับ{" "}
                <Link to="/OperaRequri" className="highlight-conditions">
                  ข้อกำหนดและเงื่อนไข
                </Link>
              </span>
            </label>
          </div>
          {errorMessage && (
            <p className="error-message">{errorMessage}</p> // แสดงข้อความแจ้งเตือน
          )}
          <button
            type="submit"
            className="submit-button"
            disabled={!formData.acceptTerms} // ปุ่มจะถูกปิดใช้งานถ้า Checkbox ไม่ถูกติ๊ก
          >
            ดำเนินการต่อ
          </button>
        </form>
      </main>
    </div>
  );
};

export default RegistrationForm;