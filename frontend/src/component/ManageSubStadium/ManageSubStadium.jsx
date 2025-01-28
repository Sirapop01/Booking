import React, { useState } from "react";
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
  const [sports, setSports] = useState([
    { id: 1, name: "บาสเกตบอล", icon: basketballIcon, link: "/substadium/basketball" },
    { id: 2, name: "ฟุตบอล", icon: footballIcon, link: "/substadium/football" },
    { id: 3, name: "แบดมินตัน", icon: badmintonIcon, link: "/substadium/badminton" },
    { id: 4, name: "เทเบิล เทนนิส", icon: tableTennisIcon, link: "/substadium/tabletennis" },
    { id: 5, name: "เทนนิส", icon: tennisIcon, link: "/substadium/tennis" },
    { id: 6, name: "กอล์ฟ", icon: golfIcon, link: "/substadium/golf" },
    { id: 7, name: "วอลเลย์บอล", icon: volleyballIcon, link: "/substadium/volleyball" },
  ]);

  // State สำหรับป็อปอัพ
  const [showPopup, setShowPopup] = useState(false);
  const [newSport, setNewSport] = useState({ name: "", icon: null, link: "" });

  // ฟังก์ชันเปิดปิดป็อปอัพ
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  // ฟังก์ชันอัปโหลดไอคอน
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewSport({ ...newSport, icon: URL.createObjectURL(file) });
    }
  };

  // ฟังก์ชันบันทึกประเภทกีฬา
  const addNewSport = () => {
    if (newSport.name && newSport.icon) {
      setSports([...sports, { id: sports.length + 1, ...newSport, link: `/substadium/${newSport.name}` }]);
      setNewSport({ name: "", icon: null, link: "" });
      togglePopup();
    }
  };

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
          <div key={sport.id} className="sport-card" onClick={() => navigate(sport.link)}>
            <img src={sport.icon} alt={sport.name} className="sport-icon" />
            <p>{sport.name}</p>
          </div>
        ))}

        {/* ปุ่มเพิ่มประเภทกีฬา */}
        <div className="sport-card add-card" onClick={togglePopup}>
          <img src={addIcon} alt="เพิ่ม" className="sport-icon" />
        </div>
      </div>

      {/* ปุ่มย้อนกลับ */}
      <button className="btn-back" onClick={() => navigate(-1)}>ย้อนกลับ</button>

      {/* ป็อปอัพเพิ่มประเภทกีฬา */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>เพิ่มประเภทกีฬา</h3>
            <input
              type="text"
              placeholder="ชื่อประเภทกีฬา"
              value={newSport.name}
              onChange={(e) => setNewSport({ ...newSport, name: e.target.value })}
            />
            <label className="image-upload">
              {newSport.icon ? (
                <img src={newSport.icon} alt="New Sport" className="uploaded-image" />
              ) : (
                <span className="upload-placeholder">+</span>
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
            </label>
            <div className="popup-buttons">
              <button className="btn btn-save" onClick={addNewSport}>บันทึก</button>
              <button className="btn btn-cancel" onClick={togglePopup}>ยกเลิก</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageSubStadium;
