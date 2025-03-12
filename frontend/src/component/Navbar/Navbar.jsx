import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png';
import { jwtDecode } from 'jwt-decode';
import ChatButton from "../ChatButton/ChatButton";

const Navbar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [decodedToken, setDecodedToken] = useState(null);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        setDecodedToken(decoded);
      } catch (error) {
        console.error("❌ Error decoding token:", error);
        setDecodedToken(null);
      }
    }
  }, []);

  const isLoggedIn = !!decodedToken;
  const userId = decodedToken?.id || null; // ✅ ดึง `userId` จาก Token
  const userType = decodedToken?.role?.toLowerCase() || null; // ✅ ดึง `userType` และแปลงเป็นตัวพิมพ์เล็ก

  console.log("📌 userId จาก Navbar:", userId);
  console.log("📌 userType จาก Navbar:", userType);
  const handleLogout = () => {
    setShowLogoutPopup(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setDecodedToken(null);
    setIsDropdownOpen(false);
    setShowLogoutPopup(false);
    navigate('/');
    window.location.reload();
  };

  return (
    <>
      <nav className="navbar-homepage">
        <div className="navbar-left">
          <button className="navbar-button-homepage" onClick={() => navigate('/promotion')}>
            โปรโมชั่น
          </button>
        </div>

        <div className="navbar-center">
          <img src={logo} alt="logo" className="navbar-logo-img-homepage" />
          <span className="navbar-title">MatchWeb</span>
        </div>

        <div className="navbar-right">
          {!isLoggedIn ? (
            <div className="navbar-links">

              <button className="navbar-link" onClick={() => navigate("/login")}>
                เข้าสู่ระบบ
              </button>
              <button className="navbar-button" onClick={() => navigate("/RegisterChoice")}>
                ลงทะเบียน
              </button>
            </div>
          ) : (
            <div className="dropdown">
              <button
                className="menu-icon"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className={`icon ${isDropdownOpen ? "rotate" : ""}`}>☰</span>
              </button>
              <div className={`dropdown-menu ${isDropdownOpen ? "open" : ""}`}>
                {decodedToken?.role === "customer" ? (
                  <>
                    <button onClick={() => navigate("/profile")}>บัญชี</button>
                    <button onClick={() => navigate("/historybooking")}>ประวัติการจอง</button>
                    <button onClick={() => navigate("/FavoritesList")}>รายการโปรด</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => navigate("/OwnerProfile")}>บัญชี</button>
                    <button onClick={() => navigate("/stadium-list")}>สนามของฉัน</button>
                    <button onClick={() => navigate(`/Ownerledger/${decodedToken?.id}`)}>บัญชีรายรับ</button>
                    <button onClick={() => navigate("/addPromotion")}>เพิ่มโปรโมชั่น</button>
                  </>
                )}
                <button onClick={handleLogout}>ลงชื่อออก</button>
              </div>
            </div>
          )}
        </div>
      </nav>

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

      {/* ✅ ตรวจสอบว่า ChatButton โหลดได้ถูกต้อง */}
      {isLoggedIn && userId && (userType === "customer" || userType === "owner") && (
        <ChatButton userId={userId} userType={userType} />
      )}
    </>
  );
};

export default Navbar;