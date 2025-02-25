import React from "react";
import { Link } from "react-router-dom";
import homeLogo from "../assets/logoalt.png";
import logo from "../assets/logo.png"; // ✅ เพิ่มโลโก้ของระบบ
import "./NavbarOwnerLedgerDetails.css"; // ✅ ใช้ไฟล์ CSS แยกกัน

const NavbarOwnerLedgerDetails = () => {
  return (
    <nav className="owner-ledger-navbar">
      {/* ✅ ปุ่ม Home (ด้านซ้าย) */}
      <Link to="/" className="ledger-home-button">
        <img src={homeLogo} alt="Home Logo" className="ledger-home-logo" />
      </Link>

      {/* ✅ โลโก้และชื่ออยู่ตรงกลาง */}
      <div className="ledger-navbar-center">
        <img src={logo} alt="Main Logo" className="ledger-main-logo" />
        <h1 className="ledger-navbar-title">บัญชีรายการรับ ของเจ้าของสนาม</h1>
      </div>
    </nav>
  );
};

export default NavbarOwnerLedgerDetails;
