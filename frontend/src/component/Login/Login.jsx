import React, { useState, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; // Path ของโลโก้
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  // 📌 ตรวจสอบ token หากมีอยู่แล้วให้เข้า Dashboard ทันที
  useEffect(() => {
    const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (storedToken) {
      navigate("/");
    }
  }, [navigate]);

  // 📌 ตรวจสอบฟอร์มก่อน login
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

    setErrorMessage(""); // ล้างข้อความ error ถ้าทุกอย่างถูกต้อง
    return true;
  };

  // 📌 ฟังก์ชัน login
  const handleLogin = async () => {
    if (!validateForm()) {
      return; // หยุดการทำงานหากการตรวจสอบล้มเหลว
    }

    try {
      const response = await axios.post("http://localhost:4000/api/auth/login", {
        email,
        password,
      });

      if (response.data.token) {
        // ✅ Login สำเร็จ: เก็บ token และพาไปหน้า dashboard
        if (rememberMe) {
          localStorage.setItem("token", response.data.token);
        } else {
          sessionStorage.setItem("token", response.data.token);
        }
        navigate("/");
      }
    } catch (error) {
      if (error.response) {
        console.log("🔴 Error Response:", error.response.data); // Debug ตรวจสอบ API Response
    
        const errorData = error.response.data || {}; 
        const errorType = errorData.errorType || ""; 
        const errorMessage = errorData.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง"; 
    
        console.log("🟢 ตรวจสอบ errorType:", errorType);
    
        if (errorType === "blacklisted_account") {
          Swal.fire({
            title: "บัญชีถูกระงับ!",
            text: "บัญชีของคุณถูกระงับ ไม่สามารถเข้าสู่ระบบได้",
            icon: "error",
            confirmButtonColor: "#d33",
            confirmButtonText: "ตกลง",
          });
        } else if (errorType === "invalid_credentials" || errorType === "incorrect_password" || errorMessage.includes("เข้าสู่ระบบไม่สำเร็จ")) {
          console.log("✅ เงื่อนไข invalid_credentials / incorrect_password ทำงาน");
          Swal.fire({
            title: "เข้าสู่ระบบไม่สำเร็จ",
            text: "อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่",
            icon: "error",
            confirmButtonColor: "#d33",
            confirmButtonText: "ตกลง",
          });
        } else if (errorType === "user_not_found" || errorMessage.includes("ไม่พบบัญชีผู้ใช้")) {
          console.log("✅ เงื่อนไข user_not_found ทำงาน");
          Swal.fire({
            title: "เข้าสู่ระบบไม่สำเร็จ",
            text: "ไม่พบบัญชีผู้ใช้ กรุณาตรวจสอบอีเมลของคุณ",
            icon: "error",
            confirmButtonColor: "#d33",
            confirmButtonText: "ตกลง",
          });
        } else if (errorType === "account_not_verified") {
          console.log("✅ เงื่อนไข account_not_verified ทำงาน");
          Swal.fire({
            title: "บัญชียังไม่ได้รับการยืนยัน!",
            text: "กรุณายืนยันบัญชีของคุณผ่านอีเมลก่อนเข้าสู่ระบบ",
            icon: "warning",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "ตกลง",
          });
        } else if (errorMessage.includes("เกิดข้อผิดพลาดในระบบ")) {
          console.log("❌ เซิร์ฟเวอร์มีปัญหา");
          Swal.fire({
            title: "เกิดข้อผิดพลาด!",
            text: "เซิร์ฟเวอร์มีปัญหา กรุณาลองใหม่ภายหลัง",
            icon: "error",
            confirmButtonColor: "#d33",
            confirmButtonText: "ตกลง",
          });
        } else {
          console.log("❌ errorType ไม่ตรงกับเงื่อนไขที่กำหนด:", errorType);
          Swal.fire({
            title: "เกิดข้อผิดพลาด",
            text: errorMessage,
            icon: "error",
            confirmButtonColor: "#d33",
            confirmButtonText: "ตกลง",
          });
        }
      } else {
        console.log("❌ ไม่มี error.response จาก API");
        Swal.fire({
          title: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์",
          text: "กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตของคุณ",
          icon: "error",
          confirmButtonColor: "#d33",
          confirmButtonText: "ตกลง",
        });
      }
    }
    
    
    
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <img src={logo} alt="Logo" className="login-logo" />
        <p className="login-logo-text">MatchWeb</p>
      </div>

      <div className="login-right-side">
        <div className="login-form-container">
          <h2 className="login-heading">Login</h2>
          <div className="login-input-group">
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="login-input-group login-password-input">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" className="login-toggle-password" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <IoEyeSharp /> : <FaEyeSlash />}
            </button>
          </div>
          {errorMessage && <p className="login-error-message">{errorMessage}</p>}
          <div className="login-remember-me">
            <input type="checkbox" id="rememberMe" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
            <label htmlFor="rememberMe">remember me</label>
          </div>


          <button className="login-button" onClick={handleLogin}>
            Login
          </button>
          {/* Divider Section */}
          <div className="login-divider">
            <span className="login-divider-text">Or</span>
          </div>

          {/* Login Button */}
          

          <p className="login-forgot-password">
            <a href="/forgot-password">Forgot password?</a>
          </p>

          <p className="login-admin">
            <a href="/superadmin/login">Admin Login</a>
          </p>

          <p className="login-signup-link">
            Don't have an Account? <a href="/RegisterChoice">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
