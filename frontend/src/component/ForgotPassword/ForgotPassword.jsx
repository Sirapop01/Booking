import React, { useState } from "react";
import axios from "axios";
import "./ForgotPassword.css"

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); 

    try {
      const response = await axios.post("http://localhost:4000/api/auth/forgot-password", { email });
      setMessage("✅ กรุณาตรวจสอบอีเมลของคุณ!");
    } catch (error) {
      console.error(error);
      setMessage("❌ ไม่พบอีเมลนี้");
    }
  };

  return (
    <div className="forgot-password-container">
      <h1 className="main-title">เปลี่ยนรหัสผ่านใหม่</h1>
      <div className="forgot-password-box">
        <h2>ลืมรหัสผ่าน</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter Your Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">ส่ง</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default ForgotPassword;
