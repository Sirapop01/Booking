import React, { useState } from "react";
import "./ResetPassword.css"; // ไฟล์ CSS สำหรับสไตล์

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // ตรวจสอบเงื่อนไข เช่น รหัสผ่านต้องตรงกัน 
    if (newPassword !== confirmPassword) {
      alert("รหัสผ่านไม่ตรงกัน กรุณาลองใหม่");
      return;
    }
    // ถ้ารหัสผ่านทั้งสองช่องตรงกัน ก็ส่งไปยัง backend
    console.log("New Password:", newPassword);
    alert("เปลี่ยนรหัสผ่านสำเร็จ!");
    // อาจนำไปเรียก API เพื่ออัปเดตรหัสผ่านในระบบ
  };

  return (
    <div className="forgot-password-container">
      <h1 className="main-title">เปลี่ยนรหัสผ่านใหม่</h1>
      <div className="forgot-password-box">
        <h2>ลืมรหัสผ่าน</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="รหัสผ่านใหม่"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="ยืนยันรหัสผ่าน"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">เปลี่ยนรหัสผ่านใหม่</button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
