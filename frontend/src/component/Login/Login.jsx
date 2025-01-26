import React, { useState } from 'react';
import './Login.css';
import logo from '../assets/logo.png'; // Path ของโลโก้
import bgImage from '../assets/threeman.png'; // Path ของรูปพื้นหลัง

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // State สำหรับ "จดจำฉัน"
  const [showPassword, setShowPassword] = useState(false); // State สำหรับแสดง/ซ่อนรหัสผ่าน

  const handleLogin = () => {
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Remember Me:', rememberMe);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="logincontainer">
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
              {showPassword ? '👁️' : '👁️‍🗨️'} {/* แสดงไอคอน */}
            </button>
          </div>
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
