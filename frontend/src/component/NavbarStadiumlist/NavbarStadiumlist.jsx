import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './NavbarStadiumlist.css';
import logo from '../assets/logo.png';
import { jwtDecode } from 'jwt-decode';

const NavbarStadiumlist = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [decodedToken, setDecodedToken] = useState(null);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  useEffect(() => {
    // ดึง Token จาก Local Storage หรือ Session Storage
    const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        setDecodedToken(decoded);
      } catch (error) {
        console.error("Error decoding token:", error);
        setDecodedToken(null);
      }
    }
  }, []);

  const isLoggedIn = !!decodedToken;

  // ฟังก์ชัน Logout: แสดง Popup ยืนยันการออกจากระบบ
  const handleLogout = () => {
    setShowLogoutPopup(true);
  };

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
        {/* มุมซ้าย: ปุ่ม Home */}
        <div className="navbar-left">
          <button className="navbar-button-homepage" onClick={() => navigate('/')}>
            Home
          </button>
        </div>

        {/* ตรงกลาง: โลโก้และข้อความ "สนามของฉัน" */}
        <div className="navbar-center">
          <img src={logo} alt="Logo" className="navbar-logo-img-homepage" />
          <span className="navbar-title">สนามของฉัน</span>
        </div>

        {/* มุมขวา: Dropdown Menu */}
        <div className="navbar-right">
          {isLoggedIn ? (
            <div className="dropdown">
              <button className="menu-icon" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                ☰
              </button>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <button onClick={() => navigate("/OwnerProfile")}>บัญชี</button>
                  <button onClick={() => navigate("/areana")}>สนามของฉัน</button>
                  <button onClick={() => navigate("/income")}>บัญชีรายรับ</button>
                  <button onClick={handleLogout}>ลงชื่อออก</button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar-links">
              <button className="navbar-button" onClick={() => navigate("/login")}>
                เข้าสู่ระบบ
              </button>
              <button className="navbar-link" onClick={() => navigate("/RegisterChoice")}>
                ลงทะเบียน
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Popup ยืนยันออกจากระบบ */}
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
    </>
  );
};

export default NavbarStadiumlist;
