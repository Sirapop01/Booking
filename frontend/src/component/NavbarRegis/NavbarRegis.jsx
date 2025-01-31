import React from 'react';
import './NavbarRegis.css'; // นำเข้ารูปแบบ CSS
import logo from '../assets/logo.png';

const NavbarRegis = () => {
    return (
        <div className="navbar">
            <div className="navbar-container">
                <img src={logo} alt="MatchWeb Logo" className="navbar-logo" />
                <h1 className="navbar-title">MatchWeb</h1>
                <div className="navbar-divider"></div> {/* เส้นคั่นกลาง */}
                <p className="navbar-subtitle">การลงทะเบียนสำหรับผู้ประกอบการ</p>
            </div>
        </div>
    );
};

export default NavbarRegis;
