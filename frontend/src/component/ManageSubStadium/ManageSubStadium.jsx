import React, { useState } from "react";
import "./ManageSubStadium.css";
import logo from "../assets/logo.png";
import homeLogo from "../assets/logoalt.png";
import { useNavigate } from "react-router-dom";

// ไอคอนกีฬา
import basketballIcon from "../assets/icons/basketball.png";
import footballIcon from "../assets/icons/football.png";
import badmintonIcon from "../assets/icons/badminton.png";
import tableTennisIcon from "../assets/icons/tabletennis.png";
import tennisIcon from "../assets/icons/tennis.png";
import golfIcon from "../assets/icons/golf.png";
import volleyballIcon from "../assets/icons/volleyball.png";
import addIcon from "../assets/icons/add.png";

function ManageSubStadium() {
  const navigate = useNavigate();
  const [sports, setSports] = useState([
    { id: 1, name: "บาสเกตบอล", icon: basketballIcon },
    { id: 2, name: "ฟุตบอล", icon: footballIcon },
    { id: 3, name: "แบดมินตัน", icon: badmintonIcon },
    { id: 4, name: "เทเบิล เทนนิส", icon: tableTennisIcon },
    { id: 5, name: "เทนนิส", icon: tennisIcon },
    { id: 6, name: "กอล์ฟ", icon: golfIcon },
    { id: 7, name: "วอลเลย์บอล", icon: volleyballIcon },
  ]);

  const [showPopup, setShowPopup] = useState(false);
  const [newSport, setNewSport] = useState({ name: "", icon: null });

  const togglePopup = () => setShowPopup(!showPopup);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewSport({ ...newSport, icon: URL.createObjectURL(file) });
    }
  };

  const addNewSport = () => {
    if (newSport.name && newSport.icon) {
      setSports([...sports, { id: sports.length + 1, ...newSport }]);
      setNewSport({ name: "", icon: null });
      togglePopup();
    }
  };

  return (
    <div className="manage-substadium-page">
      <div className="substadium-header">
        <a href="/" className="substadium-home-button">
          <img src={homeLogo} alt="Home" className="substadium-home-logo" />
        </a>
        <h1 className="substadium-title">
          <img src={logo} alt="Logo" className="substadium-logo" />
          จัดการสนามย่อย
        </h1>
      </div>

      <div className="substadium-content">
        <h2 className="substadium-subtitle">เลือกประเภทกีฬา</h2>
        <div className="substadium-sports">
          {sports.map((sport) => (
            <div key={sport.id} className="substadium-sport-card" onClick={() => navigate("/manage-substadium-details", { state: { sport } })}>
              <img src={sport.icon} alt={sport.name} className="substadium-sport-icon" />
              <p>{sport.name}</p>
            </div>
          ))}
          <div className="sport-card substadium-add-card" onClick={togglePopup}>
            <img src={addIcon} alt="เพิ่ม" className="sport-icon" />
          </div>
        </div>
        <button className="substadium-btn-back" onClick={() => navigate(-1)}>ย้อนกลับ</button>
      </div>

      {showPopup && (
        <div className="substadium-popup-overlay">
          <div className="substadium-popup-box">
            <h3>เพิ่มประเภทกีฬา</h3>
            <input
              type="text"
              placeholder="ชื่อประเภทกีฬา"
              value={newSport.name}
              onChange={(e) => setNewSport({ ...newSport, name: e.target.value })}
            />
            <label className="substadium-image-upload">
              {newSport.icon ? (
                <img src={newSport.icon} alt="New Sport" className="substadium-uploaded-image" />
              ) : (
                <span className="substadium-upload-placeholder">+</span>
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
            </label>
            <div className="substadium-popup-buttons">
              <button className="btn substadium-btn-save" onClick={addNewSport}>บันทึก</button>
              <button className="btn substadium-btn-cancel" onClick={togglePopup}>ยกเลิก</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageSubStadium;
