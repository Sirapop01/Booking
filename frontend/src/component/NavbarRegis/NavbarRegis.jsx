import React from 'react';
import './NavbarRegis.css'; // นำเข้ารูปแบบ CSS
import logo from '../assets/logo.png';

const NavbarRegis = () => {
    return (
        <div className="navbar111">
            <div className="navbar-container111">
                <div className="navbar-left111">
                    <img src={logo} alt="MatchWeb Logo" className="navbar-logo" />
                    <h1 className="navbar-title111">MatchWeb</h1>
                </div>
                
                <div className="navbar-right111">
                    <p className="navbar-subtitle111">ระบบลงทะเบียนสำหรับผู้ประกอบการ</p>
                </div>
            </div>

            {/* เส้นคั่นกลางแนวนอน */}
            <div className="navbar11-divider"></div>
        </div>
    );
};

export default NavbarRegis;
