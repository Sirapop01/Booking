import React from "react";
import { Link } from "react-router-dom";
import "./NavbarSub.css"; // สร้างไฟล์ CSS แยกให้ navbar
import homeLogo from "../assets/logoalt.png";
import logo from "../assets/logo.png";

function SubStadiumNavbar() {
  return (
    <div className="substadium-header">
      <Link to="/" className="substadium-home-button">
        <img src={homeLogo} alt="Home" className="substadium-home-logo" />
      </Link>
      <h1 className="substadium-title">
        <img src={logo} alt="Logo" className="substadium-logo" />
        จัดการสนามย่อย
      </h1>
    </div>
  );
}

export default SubStadiumNavbar;
