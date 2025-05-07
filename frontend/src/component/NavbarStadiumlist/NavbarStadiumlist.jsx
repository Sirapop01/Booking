import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './NavbarStadiumlist.css';
import logo from '../assets/logo.png';
import homeLogo from '../assets/logoalt.png';
import { jwtDecode } from 'jwt-decode';
import ChatButton from "../ChatButton/ChatButton"; // ✅ เพิ่ม ChatButton

const NavbarStadiumlist = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [decodedToken, setDecodedToken] = useState(null);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null);

  // ✅ ดึง Token และ decode
useEffect(() => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token) {
      try {
          const decoded = jwtDecode(token);
          setDecodedToken(decoded);
      } catch (error) {
          console.error("Error decoding token:", error);
          setDecodedToken(null);
      }
  }
}, []);

  // ✅ ฟังก์ชัน Logout
  const handleLogout = () => setShowLogoutPopup(true);
  const confirmLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setDecodedToken(null);
    setIsDropdownOpen(false);
    setShowLogoutPopup(false);
    navigate("/");
    window.location.reload();
  };

  return (
    <>
        <nav className="navbar-homepage">
            {/* ปุ่ม Home */}
            <div className="navbar-left">
                <a href="/" className="home-button">
                    <img src={homeLogo} alt="Home Logo" className="home-logo" />
                </a>
            </div>

            {/* ตรงกลาง: โลโก้ */}
            <div className="navbar-center">
                <img src={logo} alt="Logo" className="navbar-logo-img-homepage" />
                <span className="navbar-title">สนามของฉัน</span>
            </div>
        </nav>

      {/* 🔹 Popup Logout */}
      {showLogoutPopup && (
        <div className="logout-popup-overlay" onClick={() => setShowLogoutPopup(false)}>
          <div className="logout-popup" onClick={(e) => e.stopPropagation()}>
            <p>คุณต้องการออกจากระบบหรือไม่?</p>
            <div className="logout-buttons">
              <button className="confirm-btn" onClick={confirmLogout}>ยืนยัน</button>
              <button className="cancel-btn" onClick={() => setShowLogoutPopup(false)}>ยกเลิก</button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ เพิ่ม ChatButton ที่นี่ */}
      {decodedToken?.id && decodedToken?.role && (
            <ChatButton userId={decodedToken.id} userType={decodedToken.role} />
        )}
    </>
  );
};

export default NavbarStadiumlist;
