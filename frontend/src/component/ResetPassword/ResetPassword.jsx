import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ResetPassword.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../assets/lago.png";

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
    <div className="new-reset-password-container">
      <div className="new-reset-password-box">
        <img src={logo} alt="Logo" className="reset-logo" />
        <h1>รีเซ็ตรหัสผ่าน</h1>
        <p>กรุณากรอกรหัสผ่านใหม่ของคุณด้านล่าง</p>
        <form onSubmit={handleReset}>
        <div className="new-input-group-reset">
          <label htmlFor="new-password">รหัสผ่านใหม่</label>
          <input
            id="new-password"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

          <div className="new-input-group-reset">
            <label htmlFor="confirm-password">ยืนยันรหัสผ่าน</label>
            <input
              id="confirm-password"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="new-reset-button">Confirm</button>
        </form>
        {message && <p className="new-message">{message}</p>}
      </div>
    </div>
  );

}

export default ResetPassword;
