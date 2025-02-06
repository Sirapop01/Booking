import React from 'react';
import './NavbarRegis.css';
import logo from '../assets/logo.png';
import homeLogo from '../assets/logoalt.png';

const NavbarRegis = () => {
    return (
        <div className="navbar111">
            {/* ✅ คอนเทนเนอร์หลัก */}
            <div className="navbar-container111">
                {/* ✅ ปุ่มกลับไปหน้า Home */}
                <a href="/" className="home-button111">
                    <img src={homeLogo} alt="Home Logo" className="home-logo111" />
                </a>

                {/* ✅ โลโก้ MatchWeb */}
                <div className="navbar-left111">
                    <img src={logo} alt="MatchWeb Logo" className="navbar-logo" />
                    <h1 className="navbar-title111">MatchWeb</h1>
                </div>
            </div>

            {/* ✅ เส้นคั่นกลางแนวนอน */}
            <div className="navbar11-divider"></div>

            {/* ✅ ข้อความด้านล่าง */}
            <div className="navbar-right111">
                <p className="navbar-subtitle111">เพิ่มสนาม สำหรับผู้ประกอบการ</p>
            </div>
        </div>
    );
};

export default NavbarRegis;
