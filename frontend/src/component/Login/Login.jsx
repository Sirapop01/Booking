import React, { useState } from 'react';
import './Login.css';
import logo from '../assets/logo.png'; // แก้ไข path ของ logo 
import bgImage from '../assets/threeman.png'; // แก้ไข path ของรูปภาพพื้นหลัง

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // TODO: ตรวจสอบข้อมูล login กับ database (MongoDB)
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <div className="container">
      <div className="left-side">
        <img src={logo} alt="Logo" className="logo" />
        <p className="logo-text">MatchWeb</p> {/* แก้ไขข้อความ */}
        <img src={bgImage} alt="Background" className="bg-img" />
      </div>
      <div className="right-side">
        <div className="form-container">
          <h2 className="login-heading">ลงชื่อเข้าใช้</h2>
          <div className="input-group">
            <input
              type="email"
              id="email"
              placeholder="อีเมล"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              id="password"
              placeholder="รหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="login-button" onClick={handleLogin}>
            Login
          </button>
          <p className="forgot-password">
            <a href="/forgot-password">ลืมรหัสผ่าน?</a>
          </p>
          <p className="signup-link">
            Don't have an Account? <a href="/customer-register">Sign Up</a>
          </p> 
        </div>
      </div>
    </div>
  );
}

export default Login;