import React from "react";
import { useNavigate } from "react-router-dom";
import homeLogo from "../assets/logoalt.png";
import logo from "../assets/logo.png";
import "./NavbarAdmin.css";

function NavbarAdmin() {
  const navigate = useNavigate();

  return (
    <div className="navbar-admin">
      <a href="/" className="navbar-home-button">
        <img src={homeLogo} alt="Home" className="navbar-home-logo" />
      </a>
      <h1 className="navbar-title">
        <img src={logo} alt="Logo" className="navbar-logo" />
        ระบบจัดการชำระเงิน
      </h1>
    </div>
  );
}

export default NavbarAdmin;
