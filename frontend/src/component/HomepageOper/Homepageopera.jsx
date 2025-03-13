import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Homepageopera.css";
import Navbar from "../Navbar/Navbar";
import stadiumIcon from "../assets/icons/stadiumicon.png";
import moneyIcon from "../assets/icons/save-money.png";
import commentregisIcon from "../assets/icons/commentregisicon.png";
import { jwtDecode } from "jwt-decode"; // นำเข้า jwtDecode

const Homepageopera = () => {
  const navigate = useNavigate();
  const [ownerId, setOwnerId] = useState(null);

  useEffect(() => {
    // ดึง Token จาก LocalStorage หรือ SessionStorage
    const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        setOwnerId(decoded.id); // ดึงค่า ownerId จาก token
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handleNavigate = () => {
    navigate("/reviewowner");
  };

  return (
    <>
      <Navbar />

      {/* Wrapper ที่มีพื้นหลังสีขาวเฉพาะหน้านี้ */}
      <div className="homepage-wrapper">
        <div className="homepage-container77">
          {/* ส่วนหัว */}
          <h1 className="homepage-title77">เมนูการจัดการ</h1>

          {/* กล่องเมนู */}
          <div className="menu-container77">
            {/* การจัดการสนาม */}
            <div className="menu-box77" tabIndex="0">
              <img
                src={stadiumIcon}
                alt="สนามของฉัน"
                className="menu-icon77"
                aria-label="ไอคอนสนาม"
              />
              <Link to="/stadium-list">
                <button className="menu-text77" aria-label="ไปยังสนามของฉัน">
                  สนามของฉัน
                </button>
              </Link>
            </div>

            {/* ตรวจสอบบัญชี */}
            <div className="menu-box77" tabIndex="0">
              <img
                src={moneyIcon}
                alt="ตรวจสอบบัญชี"
                className="menu-icon77"
                aria-label="ไอคอนตรวจสอบบัญชี"
              />
              <button
                className="menu-text77"
                aria-label="ตรวจสอบบัญชี"
                onClick={() => {
                  if (ownerId) {
                    navigate(`/Ownerledger/${ownerId}`);
                  } else {
                    alert("กรุณาเข้าสู่ระบบ");
                  }
                }}
              >
                ตรวจสอบบัญชี
              </button>
            </div>

            {/* รีวิวล่าสุด */}
            <div className="menu-box77 review-box77" tabIndex="0">
              <h2 className="review-title77">รีวิวล่าสุด</h2>
            </div>
          </div>

          {/* รีวิวทั้งหมด */}
          <div className="review-all77" tabIndex="0">
            <img
              src={commentregisIcon}
              alt="รีวิวทั้งหมด"
              className="chat-icon77"
              aria-label="ไอคอนรีวิวทั้งหมด"
            />
          <button onClick={() => navigate(`/reviewowner/${ownerId}`)}>
      รีวิวทั้งหมด
    </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Homepageopera;
