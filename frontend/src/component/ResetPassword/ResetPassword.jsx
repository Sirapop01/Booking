import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ResetPassword.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("❌ รหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      await axios.post(`http://localhost:4000/api/auth/reset-password/${token}`, { newPassword });
      setMessage("✅ เปลี่ยนรหัสผ่านสำเร็จ! กำลังไปหน้า Login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error(error);
      setMessage("❌ ลิงก์หมดอายุหรือไม่ถูกต้อง");
    }
  };

  return (
    <div className="reset-password-container">
      <h1 className="main-title">เปลี่ยนรหัสผ่านใหม่</h1>
      <div className="reset-password-box">
        <h2>รีเซ็ตรหัสผ่าน</h2>
        <form onSubmit={handleReset}>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="กรอกรหัสผ่านใหม่"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="input-group">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="ยืนยันรหัสผ่านใหม่"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit">ยืนยัน</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default ResetPassword;
