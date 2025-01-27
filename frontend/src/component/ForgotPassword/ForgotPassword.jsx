import React, { useState } from "react";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // เรียกไปยัง API ที่ฝั่ง Backend
      const response = await axios.post("http://localhost:4000/api/send-email", { email });
      alert("ส่งอีเมลสำเร็จ!");
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการส่งอีเมล");
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
      </div>
    </div>
  );
}

export default ForgotPassword;
