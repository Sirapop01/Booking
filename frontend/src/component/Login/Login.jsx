import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // Path ของโลโก้
import bgImage from '../assets/threeman.png'; // Path ของรูปพื้นหลัง
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";

import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = () => {
    if (!email) {
      setErrorMessage("กรุณากรอกอีเมล");
      return false;
    }
  
    // ตรวจสอบรูปแบบอีเมล
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("กรุณากรอกอีเมลให้ถูกต้อง");
      return false;
    }
  
    if (!password) {
      setErrorMessage("กรุณากรอกรหัสผ่าน");
      return false;
    }
  
    setErrorMessage(''); // ลบข้อความ error ถ้าทุกอย่างถูกต้อง
    return true;
  };
  


  const handleLogin = async () => {
  if (!validateForm()) {
    return; // หยุดการทำงานหากการตรวจสอบล้มเหลว
  }

  let members = {
    email,
    password 
  }

  try {
    const response = await axios.post("http://localhost:4000/api/auth/login", members);
    
    if (response.data.message === "เข้าสู่ระบบสำเร็จ") {
      if (rememberMe) {
        localStorage.setItem('token', response.data.token);
      } else {
        sessionStorage.setItem('token', response.data.token);
      }
      navigate("/");
    } else {
      setErrorMessage("อีเมลหรือรหัสผ่านไม่ถูกต้อง");  // แสดงข้อความเมื่อเข้าสู่ระบบไม่สำเร็จ
    }

    console.log(response.data.message);
  } catch (err) {
    console.log(err);
    alert("เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง");  // จัดการข้อผิดพลาดทั่วไป เช่น เซิร์ฟเวอร์ล่ม
  }
};

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setErrorMessage(''); // ลบข้อความ error เมื่อผู้ใช้พิมพ์ใหม่
  };


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-left-side">
        <img src={logo} alt="Logo" className="login-logo" />
        <p className="login-logo-text">MatchWeb</p>
        <img src={bgImage} alt="Background" className="login-bg-img" />
      </div>
      <div className="login-right-side">
        <div className="login-form-container">
          <h2 className="login-heading">ลงชื่อเข้าใช้</h2>
          <div className="login-input-group">
            <input
              type="email"
              id="email"
              placeholder="อีเมล"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="login-input-group login-password-input">
            <input
              type={showPassword ? 'text' : 'password'} // เปลี่ยน type ระหว่าง text และ password
              id="password"
              placeholder="รหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="login-toggle-password"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <IoEyeSharp /> : <FaEyeSlash />}
            </button>
          </div>
          {errorMessage && <p className="login-error-message">{errorMessage}</p>}
          <div className="login-remember-me">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe">จดจำฉัน</label>
          </div>

          {/* Divider Section */}
          <div className="login-divider">
            <span className="login-divider-text">Or</span>
          </div>

          {/* Login Button */}
          <button className="login-button" onClick={handleLogin}>
            Login
          </button>

          <p className="login-forgot-password">
            <a href="/forgot-password">ลืมรหัสผ่าน ?</a>
          </p>
          <p className="login-signup-link">
            Don't have an Account? <a href="/customer-register">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
