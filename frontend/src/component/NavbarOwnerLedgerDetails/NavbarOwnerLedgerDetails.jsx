import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ ดึงค่า token
import ChatButton from "../ChatButton/ChatButton"; // ✅ เพิ่ม ChatButton
import homeLogo from "../assets/logoalt.png";
import logo from "../assets/logo.png";
import "./NavbarOwnerLedgerDetails.css";

const NavbarOwnerLedgerDetails = () => {
  const [decodedToken, setDecodedToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("📌 Token Decoded:", decoded);
        setDecodedToken(decoded);
      } catch (error) {
        console.error("❌ Error decoding token:", error);
      }
    }
  }, []);

  return (
    <nav className="owner-ledger-navbar">
      {/* ✅ ปุ่ม Home (ด้านซ้าย) */}
      <Link to="/superadmin/dashboard" className="ledger-home-button">
        <img src={homeLogo} alt="Home Logo" className="ledger-home-logo" />
      </Link>

      {/* ✅ โลโก้และชื่ออยู่ตรงกลาง */}
      <div className="ledger-navbar-center">
        <img src={logo} alt="Main Logo" className="ledger-main-logo" />
        <h1 className="ledger-navbar-title">บัญชีรายการรับ ของเจ้าของสนาม</h1>
      </div>

      {/* ✅ เพิ่ม ChatButton */}
      {decodedToken?.id && decodedToken?.role && (
        <ChatButton userId={decodedToken.id} userType={decodedToken.role} />
      )}
    </nav>
  );
};

export default NavbarOwnerLedgerDetails;
