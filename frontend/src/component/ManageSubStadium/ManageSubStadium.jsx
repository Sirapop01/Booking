import React from "react";
import "./ManageSubStadium.css";
import logo from "../assets/logo.png"; // โลโก้ด้านบน
import homeLogo from "../assets/logoalt.png"; // โลโก้ปุ่ม Home
import { useNavigate } from "react-router-dom";

// ไอคอนกีฬา
import basketballIcon from "../assets/icons/basketball.png";
import footballIcon from "../assets/icons/football.png";
import badmintonIcon from "../assets/icons/badminton.png";
import tableTennisIcon from "../assets/icons/tabletennis.png";
import tennisIcon from "../assets/icons/tennis.png";
import golfIcon from "../assets/icons/golf.png";
import volleyballIcon from "../assets/icons/volleyball.png";
import addIcon from "../assets/icons/add.png"; // ปุ่มเพิ่ม

function ManageSubStadium() {
  const navigate = useNavigate();

  // ข้อมูลประเภทกีฬา
  const sports = [
    { id: 1, name: "บาสเกตบอล", icon: basketballIcon },
    { id: 2, name: "ฟุตบอล", icon: footballIcon },
    { id: 3, name: "แบดมินตัน", icon: badmintonIcon },
    { id: 4, name: "เทเบิล เทนนิส", icon: tableTennisIcon },
    { id: 5, name: "เทนนิส", icon: tennisIcon },
    { id: 6, name: "กอล์ฟ", icon: golfIcon },
    { id: 7, name: "วอลเลย์บอล", icon: volleyballIcon },
  ];

  return (
    <div className="manage-substadium-container">
      {/* ปุ่มกลับหน้าแรก */}
      <a href="/" className="home-button">
        <img src={homeLogo} alt="Home" className="home-logo" />
      </a>

      {/* หัวข้อ */}
      <h1 className="page-title">
        <img src={logo} alt="Logo" className="logo" />
        จัดการสนามย่อย
      </h1>

      <h2 className="subtitle">เลือกประเภทกีฬา</h2>

      {/* กรอบเลือกประเภทกีฬา */}
      <div className="sports-container">
        {sports.map((sport) => (
          <div key={sport.id} className="sport-card">
            <img src={sport.icon} alt={sport.name} className="sport-icon" />
            <p>{sport.name}</p>
          </div>
        ))}

        {/* ปุ่มเพิ่มประเภทกีฬา */}
        <div className="sport-card add-card">
          <img src={addIcon} alt="เพิ่ม" className="sport-icon" />
        </div>
      </div>

      {/* ปุ่มย้อนกลับ */}
      <button className="btn-back" onClick={() => navigate(-1)}>ย้อนกลับ</button>
    </div>
  );
}

export default ManageSubStadium;
