import React from "react";
import { Link } from "react-router-dom";
import homeLogo from "../assets/logoalt.png";
import logo from "../assets/logo.png"; // ✅ เพิ่มโลโก้
import "./NavbarAdminLedger.css"; // ✅ ใช้ CSS ใหม่

const NavbarAdminLedger = () => {
  return (
    <nav className="navbar-admin-ledger">
      {/* ✅ ปุ่ม Home (ด้านซ้าย) */}
      <Link to="/" className="ledger-home-button">
        <img src={homeLogo} alt="Home Logo" className="ledger-home-logo" />
      </Link>

      {/* ✅ โลโก้และชื่ออยู่ตรงกลาง */}
      <div className="ledger-navbar-center">
        <img src={logo} alt="Main Logo" className="ledger-main-logo" />
        <h1 className="ledger-navbar-title">จัดการสนามย่อย</h1>
      </div>
    </nav>
  );
};

export default NavbarAdminLedger;
