import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // ✅ ใช้ axios ดึงข้อมูล
import './StadiumList.css';
import logo from "../assets/logo.png";
import homeLogo from "../assets/logoalt.png";

function StadiumList() {
  const navigate = useNavigate();
  const [stadiums, setStadiums] = useState([]);
  const [selectedStadium, setSelectedStadium] = useState(null);
  const ownerId = "65f7b7d9f9a1aef9b1c12345"; // ✅ เปลี่ยนเป็น owner_id ที่ได้จากระบบล็อกอิน

  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/Stadium?owner_id=${ownerId}`);
        setStadiums(response.data);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการโหลดข้อมูลสนาม:", error);
      }
    };
  
    fetchStadiums();
  }, []);

  // ✅ ฟังก์ชันเลือกสนาม
  const handleRowClick = (id) => {
    setSelectedStadium(id === selectedStadium ? null : id);
  };

  // ✅ ฟังก์ชันเปิด/ปิดสนาม
  const toggleStadium = async (stadiumId, openState) => {
    try {
      await axios.put(`http://localhost:4000/api/Stadium/${stadiumId}`, { open: openState });
      setStadiums((prev) =>
        prev.map((st) => (st._id === stadiumId ? { ...st, open: openState } : st))
      );
    } catch (error) {
      console.error("ไม่สามารถเปลี่ยนสถานะสนาม:", error);
    }
  };

  return (
    <div className="stadium-page-container">
      {/* ✅ ปุ่มกลับไปยังหน้า Home */}
      <a href="/" className="home-button">
        <img src={homeLogo} alt="Home Logo" className="home-logo" />
      </a>

      {/* ✅ หัวข้อ + โลโก้ */}
      <h1 className="page-title">
        <img src={logo} alt="Logo" className="logo" />
        สนามของฉัน
      </h1>

      {/* ✅ ตารางสนาม */}
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
              key={stadium._id}
              className={`table-row 
                ${selectedStadium === stadium._id ? 'selected' : ''} 
                ${!stadium.open || stadium.status === 'รอการยืนยัน' ? 'closed-row' : ''}`
              }
              onClick={() => handleRowClick(stadium._id)}
            >
              <td>{stadium.name}</td>
              <td>{stadium.status}</td>
              <td>
                {stadium.status === 'รอการยืนยัน' ? (
                  <button className="toggle-btn btn-disabled" disabled>
                    รอการยืนยัน
                  </button>
                ) : stadium.open ? (
                  <button className="toggle-btn btn-close" onClick={() => toggleStadium(stadium._id, false)}>
                    กดเพื่อปิดชั่วคราว
                  </button>
                ) : (
                  <button className="toggle-btn btn-open" onClick={() => toggleStadium(stadium._id, true)}>
                    กดเพื่อเปิด
                  </button>
                )}
              </td>
              <td>{stadium.open ? 'เปิด' : 'ปิด'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ ปุ่มด้านล่าง */}
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
