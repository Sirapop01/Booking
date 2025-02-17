import React from "react";
import "./SuccessRegis.css"; // นำเข้า CSS
import logo from "../assets/logo.png"; // ตรวจสอบตำแหน่งโลโก้ให้ถูกต้อง
import NavbarRegis from "../NavbarRegis/NavbarRegis";
import { useNavigate } from "react-router-dom";

const RegistrationSuccess = () => {
    const navigate = useNavigate();
    const handleBack = () =>{
      navigate("/")
    }
  return (
    <>
      {/* ✅ เพิ่ม Navbar ที่สร้างไว้ */}
      <NavbarRegis /> 

      <div className="success-container">
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
          <button className="confirm-button" onClick={handleBack}>ตกลง</button>
        </div>
      </div>
    </>
  );
};

export default RegistrationSuccess;
