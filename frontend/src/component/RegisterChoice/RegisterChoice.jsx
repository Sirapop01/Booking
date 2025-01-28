import React from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterChoice.css";
import logo from "../assets/logo.png";

function RegisterChoice() {
  const navigate = useNavigate();

  const handleCustomerRegister = () => {
    navigate("/customer-register"); // เส้นทางสำหรับผู้ใช้งาน
  };

  const handleOwnerRegister = () => {

    navigate("/RegisterOpera"); // เส้นทางสำหรับผู้ประกอบการ
  };

  return (
    <div className="container">
      <div className="content">
        <img src={logo} alt="Logo" className="logo" />
        <h1 className="welcome-text">Welcome To MatchWeb</h1>
        <p className="description-text">
          "ไม่ว่าคุณจะกำลังมองหาสนามที่สมบูรณ์แบบ หรืออยากเพิ่มโอกาสให้ธุรกิจสนามของคุณ ที่นี่คือจุดเริ่มต้นของคุณ!
          <br />
          จองสนามง่าย สะดวก และรวดเร็ว หรือเข้าร่วมกับเราเพื่อเพิ่มรายได้ให้ธุรกิจของคุณ"
        </p>
        <h2 className="choice-heading">รูปแบบบัญชีที่ต้องการลงทะเบียน</h2>
        <div className="button-group">
          <button className="customer-button" onClick={handleCustomerRegister}>
            ผู้ใช้งาน
          </button>
          <button className="owner-button" onClick={handleOwnerRegister}>
            ผู้ประกอบการ
          </button>
        </div>
        <div className="description-group">
          <p className="customer-description">
            ต้องการสมัครบัญชี
            <br />
            เพื่อใช้ในการจองสนาม
          </p>
          <p className="owner-description">
            ต้องการสมัครบัญชี
            <br />
            เพื่อใช้ในการเพิ่มสนามกีฬาของคุณ
          </p>
        </div>
      </div>
    </div>
  );
}




export default RegisterChoice;
