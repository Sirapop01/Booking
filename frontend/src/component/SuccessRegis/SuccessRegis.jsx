import React from "react";
import "./SuccessRegis.css"; // นำเข้า CSS
import logo from "../assets/logo.png"; // ตรวจสอบตำแหน่งโลโก้ให้ถูกต้อง

const RegistrationSuccess = () => {
  return (
    <div className="success-container">
      {/* Header Section */}
      <header className="success-header1">
        <div className="logo-container">
          {/* Logo Image */}
          <img src={logo} alt="MatchWeb Logo" className="logo1" />
          {/* Logo Text */}
          <h1 className="title1">MatchWeb</h1>
        </div>
        {/* Divider */}
        <div className="divider1"></div>
        {/* Subtitle */}
        <p className="subtitle1">ระบบลงทะเบียนสำหรับผู้ประกอบการ</p>
      </header>

      {/* Success Card */}
      <div className="success-box">
        <div className="success-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="success-title">การลงทะเบียนเสร็จสมบูรณ์</h2>
        <p className="success-message">
          การสมัครสำหรับบัญชีผู้ใช้ผู้ประกอบการของท่านได้ถูกส่งเรียบร้อยแล้ว
        </p>
        <button className="confirm-button">ตกลง</button>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
