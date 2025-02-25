import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./ManageSubStadium.css";
import logo from "../assets/logo.png";
import homeLogo from "../assets/logoalt.png";
import addIcon from "../assets/icons/add.png";

function ManageSubStadium() {
  const navigate = useNavigate();
  const { arenaId } = useParams();

  const [sports, setSports] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null); // ✅ เพิ่ม state สำหรับยืนยันการลบ
  const [newSport, setNewSport] = useState({ sportName: "", iconUrl: "", description: "" });

  console.log("🎯 arenaId:", arenaId);

  useEffect(() => {
    if (!arenaId) {
      console.error("❌ arenaId เป็น undefined หรือ null");
      navigate("/stadium-list");
    }
  }, [arenaId, navigate]);

  useEffect(() => {
    if (arenaId) {
      axios.get(`http://localhost:4000/api/sports/${arenaId}`)
        .then(response => setSports(response.data))
        .catch(error => console.error("Error fetching sports:", error));
    }
  }, [arenaId]);

  const togglePopup = () => setShowPopup(!showPopup);

  // 📌 เพิ่มประเภทกีฬาใหม่
  const addNewSport = () => {
    if (!arenaId) {
      console.error("❌ ไม่สามารถเพิ่มประเภทกีฬาได้ เพราะ arenaId เป็น undefined");
      return;
    }

    if (newSport.sportName && newSport.iconUrl) {
      console.log("🚀 กำลังส่งข้อมูลไป Backend:", { arenaId, ...newSport });

      axios.post("http://localhost:4000/api/sports", {
        arenaId,
        sportName: newSport.sportName,
        iconUrl: newSport.iconUrl,
        description: newSport.description
      })
      .then(response => {
        console.log("✅ บันทึกสำเร็จ:", response.data);
        setSports([...sports, response.data]);
        setNewSport({ sportName: "", iconUrl: "", description: "" });
        togglePopup();
      })
      .catch(error => console.error("❌ บันทึกไม่สำเร็จ:", error));
    } else {
      console.error("⚠️ ข้อมูลไม่ครบ sportName หรือ iconUrl");
    }
  };

  // 📌 ลบประเภทกีฬา
  const deleteSport = (sportId) => {
    console.log("🚀 กำลังลบประเภทกีฬา ID:", sportId);
    axios.delete(`http://localhost:4000/api/sports/${sportId}`)
      .then(() => {
        console.log("✅ ลบสำเร็จ");
        setSports(sports.filter(sport => sport._id !== sportId));
        setConfirmDelete(null);
      })
      .catch(error => console.error("❌ ลบไม่สำเร็จ:", error));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("image", file); // ✅ ส่งไฟล์ไป API ของคุณ
    formData.append("folder", "sports_icons"); // ✅ สามารถเปลี่ยนเป็นโฟลเดอร์อื่นได้
  
    try {
      const response = await axios.post("http://localhost:4000/api/upload/single", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
  
      const imageUrl = response.data.imageUrl;
      console.log("✅ รูปอัปโหลดสำเร็จ:", imageUrl);
  
      // ✅ อัปเดต URL รูปภาพใน state
      setNewSport({ ...newSport, iconUrl: imageUrl });
  
    } catch (error) {
      console.error("❌ อัปโหลดรูปไม่สำเร็จ:", error);
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
            <div key={sport._id} className="substadium-sport-card">
              {/* ✅ ป้องกันการเปิดหน้ารายละเอียดโดยไม่ได้ตั้งใจ */}
              <div className="sport-card-content" onClick={() => navigate("/manage-substadium-details", { state: { sport } })}>
                <img src={sport.iconUrl} alt={sport.sportName} className="substadium-sport-icon" />
                <p>{sport.sportName}</p>
              </div>
              {/* ✅ ปุ่มลบประเภทกีฬา */}
              <button className="substadium-delete-btn" onClick={() => setConfirmDelete(sport._id)}>ลบ</button>
            </div>
          ))}
          <div className="substadium-add-card" onClick={togglePopup}>
            <img src={addIcon} alt="เพิ่ม" className="substadium-sport-icon" />
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
              value={newSport.sportName}
              onChange={(e) => setNewSport({ ...newSport, sportName: e.target.value })}
            />
            <input
              type="text"
              placeholder="รายละเอียด"
              value={newSport.description}
              onChange={(e) => setNewSport({ ...newSport, description: e.target.value })}
            />
            <label className="substadium-image-upload">
              {newSport.iconUrl ? (
                <img src={newSport.iconUrl} alt="New Sport" className="substadium-uploaded-image" />
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

      {confirmDelete && (
        <div className="substadium-popup-overlay">
          <div className="substadium-popup-box">
            <h3>ยืนยันการลบ</h3>
            <p>คุณแน่ใจหรือไม่ว่าต้องการลบประเภทกีฬานี้?</p>
            <div className="substadium-popup-buttons">
              <button className="btn substadium-btn-save" onClick={() => deleteSport(confirmDelete)}>ยืนยัน</button>
              <button className="btn substadium-btn-cancel" onClick={() => setConfirmDelete(null)}>ยกเลิก</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ManageSubStadium;
