import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [decodedToken, setDecodedToken] = useState(null);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);


  useEffect(() => {
    // ดึง Token จาก Local Storage
    const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (storedToken) {
      try {
        // ถอดรหัส JWT Token
        const decoded = jwtDecode(storedToken);
        console.log("✅ Token Decoded:", decoded);
        setDecodedToken(decoded);
      } catch (error) {
        console.error("❌ Error decoding token:", error);
        setDecodedToken(null);
      }
    }
  }, []);

  const isLoggedIn = !!decodedToken;




  // ฟังก์ชัน Logout พร้อมป๊อปอัปยืนยัน
  const handleLogout = () => {
    setShowLogoutPopup(true); // แสดงป๊อปอัปยืนยัน

  };

  const confirmLogout = () => {
    localStorage.removeItem('token'); // ลบ Token ออกจาก LocalStorage
    sessionStorage.removeItem('token');
    setDecodedToken(null); // รีเซ็ต Token ใน State
    setIsDropdownOpen(false); // ปิด Dropdown
    setShowLogoutPopup(false); // ปิดป๊อปอัป
    navigate('/'); // Redirect ไปหน้าแรก
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
          ) : decodedToken?.role === "customer" ? (
            <div className="dropdown">
              <button className="menu-icon" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                ☰
              </button>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <button onClick={() => navigate("/profile")}>บัญชี</button>
                  <button onClick={() => navigate("/history")}>ประวัติการจอง</button>
                  <button onClick={() => navigate("/favorites")}>รายการโปรด</button>
                  <button onClick={handleLogout}>ลงชื่อออก</button>
                </div>
              )}
            </div>
          ) : (
            <div className="dropdown">
              <button className="menu-icon" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                ☰
              </button>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <button onClick={() => navigate("/OwnerProfile")}>บัญชี</button>
                  <button onClick={() => navigate("/stadium-list")}>สนามของฉัน</button>
                  <button onClick={() => navigate("/Ownerledger")}>บัญชีรายรับ</button>
                  <button onClick={handleLogout}>ลงชื่อออก</button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* ✅ Popup Logout กลางจอ */}
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

export default Navbar;
