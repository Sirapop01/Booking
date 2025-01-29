import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ นำเข้า useNavigate
import './StadiumList.css';
import logo from "../assets/logo.png";
import homeLogo from "../assets/logoalt.png";

function StadiumList() {
  const navigate = useNavigate(); // ✅ ใช้ navigate สำหรับเปลี่ยนหน้า

  // โหลดข้อมูลสนามจาก Local Storage ถ้ามี
  const loadStadiums = () => {
    const savedData = localStorage.getItem("stadiums");
    if (savedData) {
      return JSON.parse(savedData);
    }
    return [
      { id: 1, name: 'Wichai Arena', status: 'ยืนยัน', open: true },
      { id: 2, name: 'Sophia Arena', status: 'ยืนยัน', open: true },
      { id: 3, name: 'Arena Tepzaxx', status: 'ยืนยัน', open: true },
      { id: 4, name: 'Sophon Arena', status: 'ยืนยัน', open: true },
      { id: 5, name: 'Tety Arena', status: 'รอการยืนยัน', open: false },
    ];
  };

  // State สำหรับเก็บสนามที่ถูกเลือก และข้อมูลสนาม
  const [selectedStadium, setSelectedStadium] = useState(null);
  const [stadiums, setStadiums] = useState(loadStadiums);

  // บันทึกข้อมูลลง Local Storage ทุกครั้งที่มีการเปลี่ยนแปลง
  useEffect(() => {
    localStorage.setItem("stadiums", JSON.stringify(stadiums));
  }, [stadiums]);

  // ฟังก์ชันเลือกสนาม
  const handleRowClick = (id) => {
    setSelectedStadium(id === selectedStadium ? null : id); // คลิกซ้ำเพื่อยกเลิกการเลือก
  };

  // ฟังก์ชันเปิด/ปิดสนาม (และบันทึกลง Local Storage)
  const toggleStadium = (stadiumId, openState) => {
    setStadiums((prev) =>
      prev.map((st) =>
        st.id === stadiumId ? { ...st, open: openState } : st
      )
    );
  };

  return (
    <div className="stadium-page-container">
      {/* ปุ่มกลับไปยังหน้า Home */}
      <a href="/" className="home-button">
        <img src={homeLogo} alt="Home Logo" className="home-logo" />
      </a>

      {/* หัวข้อ + โลโก้ */}
      <h1 className="page-title">
        <img src={logo} alt="Logo" className="logo" />
        สนามของฉัน
      </h1>

      {/* ตารางสนาม */}
      <table className="stadium-table">
        <thead>
          <tr>
            <th style={{ width: '40%' }}>ชื่อสนาม</th>
            <th style={{ width: '20%' }}>สถานะ</th>
            <th style={{ width: '20%' }}>ตัวเลือก</th>
            <th style={{ width: '20%' }}>เปิด/ปิด</th>
          </tr>
        </thead>
        <tbody>
          {stadiums.map((stadium) => (
            <tr
              key={stadium.id}
              className={`table-row 
                ${selectedStadium === stadium.id ? 'selected' : ''} 
                ${!stadium.open || stadium.status === 'รอการยืนยัน' ? 'closed-row' : ''}`
              }
              onClick={() => handleRowClick(stadium.id)}
            >
              <td>{stadium.name}</td>
              <td>{stadium.status}</td>
              <td>
                {stadium.status === 'รอการยืนยัน' ? (
                  <button className="toggle-btn btn-disabled" disabled>
                    รอการยืนยัน
                  </button>
                ) : stadium.open ? (
                  <button className="toggle-btn btn-close" onClick={() => toggleStadium(stadium.id, false)}>
                    กดเพื่อปิดชั่วคราว
                  </button>
                ) : (
                  <button className="toggle-btn btn-open" onClick={() => toggleStadium(stadium.id, true)}>
                    กดเพื่อเปิด
                  </button>
                )}
              </td>
              <td>{stadium.open ? 'เปิด' : 'ปิด'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ปุ่มด้านล่าง */}
      <div className="bottom-buttons">
        <a href={selectedStadium ? `/edit/${selectedStadium}` : '#'} className={`btn ${selectedStadium ? '' : 'disabled'}`}>
          แก้ไข
        </a>
        <a href="/add_new_stadium" className="btn">เพิ่มสนามใหม่</a>
        <button className="btn" onClick={() => navigate("/manage-sub-stadium")}>
          จัดการสนามย่อย
        </button>
      </div>
    </div>
  );
}

export default StadiumList;
