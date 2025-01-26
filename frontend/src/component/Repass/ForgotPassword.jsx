import React, { useState } from "react";
import "./ForgotPassword.css"; // หรือจะเขียน Inline Style ก็ได้

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // ส่วนนี้จะเป็นการเรียกใช้งาน API เพื่อส่งอีเมลรีเซ็ตรหัสผ่าน
    console.log("Email for reset password:", email);
    alert("ระบบได้ส่งคำขอเปลี่ยนรหัสผ่านไปยังอีเมลของคุณแล้ว");
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
