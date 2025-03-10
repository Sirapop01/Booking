import React, { useState } from "react";
import axios from "axios";
import "./ForgotPassword.css";
import logo from '../assets/lago.png';

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.post("http://localhost:4000/api/auth/forgot-password", { email });
      setMessage("✅ กรุณาตรวจสอบอีเมลของคุณ!");
    } catch (error) {
      console.error(error);
      setMessage("❌ ไม่พบอีเมลนี้");
    }
  };

  return (
    <div className="new-forgot-password-container">
      <div className="new-forgot-password-box">
        <img src={logo} alt="Matchweb Logo" className="new-logo" />
        <h1>ลืมรหัสผ่าน</h1>
        <p>กรุณาป้อนที่อยู่อีเมลที่คุณต้องการให้ส่งข้อมูลการรีเซ็ตรหัสผ่านของคุณไป</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className="new-label">ป้อนที่อยู่อีเมล</label>
          <input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="new-input"
          />
          <button type="submit" className="new-reset-button">ส่งคำขอ</button>
        </form>
        {message && <p className="new-message">{message}</p>}
        <a href="/login" className="new-back-to-login">กลับไปเข้าสู่ระบบ</a>
      </div>
    </div>
  );
}

export default ForgotPassword;