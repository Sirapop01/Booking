import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <button className="navbar-button">โปรโมชั่น</button>
      <div className="navbar-logo">MatchWeb</div>
      <div className="navbar-links">
        <span className="navbar-link">เข้าสู่ระบบ</span>
        <button className="navbar-button">ลงทะเบียน</button>
      </div>
    </nav>
  );
};

export default Navbar;
