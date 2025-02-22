import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ ใช้ useNavigate สำหรับเปลี่ยนหน้า
import "./Homepageopera.css"; // นำเข้าไฟล์ CSS
import Navbar from "../Navbar/Navbar";
import stadiumIcon from "../assets/icons/stadiumicon.png"; // ไอคอนสนาม
import moneyIcon from "../assets/icons/moneyregis.png"; // ไอคอนตรวจสอบบัญชี
import commentregisIcon from "../assets/icons/commentregisicon.png"; // ไอคอนรีวิวทั้งหมด

const Homepageopera = () => {
  const navigate = useNavigate(); // ✅ ใช้ Hook สำหรับเปลี่ยนหน้า

  return (
    <>
      {/* ✅ Navbar คงเดิมตามเงื่อนไข */}
      <Navbar />

      <div className="homepage-container77">
        {/* ส่วนหัว */}
        <h1 className="homepage-title77">เมนูการจัดการ</h1>

        {/* กล่องเมนู */}
        <div className="menu-container77">
          {/* การจัดการสนาม */}
          <div className="menu-box77">
            <img src={stadiumIcon} alt="สนามของฉัน" className="menu-icon77" />
            <button className="menu-button77" onClick={() => navigate("/stadium-list")}>
              สนามของฉัน
            </button>
          </div>

          {/* ตรวจสอบบัญชี */}
          <div className="menu-box77">
            <img src={moneyIcon} alt="ตรวจสอบบัญชี" className="menu-icon77" />
            <button className="menu-button77">ตรวจสอบบัญชี</button>
          </div>

          {/* รีวิวล่าสุด */}
          <div className="menu-box review-box77">
            <h2 className="review-title77">รีวิวล่าสุด</h2>
          </div>
        </div>

        {/* รีวิวทั้งหมด */}
        <div className="review-all77">
          <img src={commentregisIcon} alt="รีวิวทั้งหมด" className="chat-icon77" />
          <button className="review-text77">รีวิวทั้งหมด</button>
        </div>
      </div>
    </>
  );
};

export default Homepageopera;
