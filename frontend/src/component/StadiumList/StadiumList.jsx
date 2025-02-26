import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./StadiumList.css";
import NavbarStadiumlist from "../NavbarStadiumlist/NavbarStadiumlist";

function StadiumList() {
  const navigate = useNavigate();
  const [stadiums, setStadiums] = useState([]);
  const [selectedStadium, setSelectedStadium] = useState(null);
  const ownerId = localStorage.getItem("ownerId") || sessionStorage.getItem("ownerId");

  const handleEditStadium = () => {
    if (selectedStadium) {
        navigate(`/Registerarena/${selectedStadium}`); // นำทางไปยัง RegisterArena.jsx พร้อม arenaId
    }
  };

  const handleAddNewStadium = () => {
    navigate("/Registerarena"); // 📌 ไปที่ Registerarena โดยไม่มี ownerId
};

  
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      alert("Session หมดอายุ! กรุณาเข้าสู่ระบบใหม่");
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const ownerId = decoded.id;

      if (!ownerId) {
        console.error("⚠️ ไม่พบ ID ใน Token");
        return;
      }

      const fetchStadiums = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/api/stadium/getArenas?owner_id=${ownerId}`);
          setStadiums(response.data);
        } catch (error) {
          console.error("⚠️ ไม่สามารถโหลดข้อมูลสนาม:", error);
        }
      };

      fetchStadiums();
    } catch (error) {
      console.error("⚠️ ไม่สามารถถอดรหัส Token:", error);
      alert("Session ไม่ถูกต้อง กรุณาเข้าสู่ระบบใหม่");
      navigate("/login");
    }
  }, [navigate]);

  // ✅ เลือกแถวของสนาม
  const handleRowClick = (id) => {
    setSelectedStadium(id === selectedStadium ? null : id);
  };

  // ✅ เปิด/ปิดสถานะสนาม
  const toggleStadium = async (stadiumId, openState) => {
    try {
      // อัพเดทสถานะใน UI ทันที
      setStadiums((prev) =>
        prev.map((st) => (st._id === stadiumId ? { ...st, open: openState } : st))
      );

      // ส่งคำขอไปยัง Backend
      await axios.post(`http://localhost:4000/api/stadium/toggleStadium`, {
        stadiumId,
        open: openState,
      });
    } catch (error) {
      console.error("⚠️ ไม่สามารถเปลี่ยนสถานะสนาม:", error);
    }
  };

  return (
    <div className="stadium-page-container">
      <NavbarStadiumlist />

      {/* ✅ ตารางสนาม */}
      <table className="stadium-table-stadiumlist">
        <thead>
          <tr>
            <th style={{ width: "25%" }}>ชื่อสนาม</th>
            <th style={{ width: "20%" }}>สถานะ</th>
            <th style={{ width: "20%" }}>เปิด/ปิด</th>
            <th style={{ width: "25%" }}>ตัวเลือก</th>
          </tr>
        </thead>
        <tbody>
          {stadiums.length > 0 ? (
            stadiums.map((stadium) => {
              const isSelected = selectedStadium === stadium._id;
              return (
                <tr
                  key={stadium._id}
                  className={`table-row-stadiumlist ${isSelected ? "selected" : ""}`}
                  onClick={() => handleRowClick(stadium._id)}
                >
                  {/* ✅ คอลัมน์ 1: ชื่อสนาม */}
                  <td className="stadium-name-stadiumlist">{stadium.fieldName ?? "ไม่ระบุชื่อ"}</td>

                  {/* ✅ คอลัมน์ 2: สถานะ (ตามค่าจริงจาก Backend) */}
                  <td className="status-stadiumlist">
                    {stadium.open ? "✅ เปิดใช้งาน" : "❌ ปิด"}
                  </td>

                  {/* ✅ คอลัมน์ 3: เปิด / ปิด (จัดเรียงเป็นคอลัมน์) */}
                  <td className="status-toggle-stadiumlist">
                    <span>{stadium.open ? "✅ เปิด" : "❌ ปิด"}</span>
                  </td>

                  {/* ✅ คอลัมน์ 4: ปุ่มเปิด/ปิดสนาม */}
                  <td className="action-buttons-stadiumlist">
                    <button
                      className={`toggle-btn-stadiumlist ${stadium.open ? "btn-close-stadiumlist" : "btn-open-stadiumlist"}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStadium(stadium._id, !stadium.open);
                      }}
                    >
                      {stadium.open ? "❌ ปิดสนาม" : "✅ เปิดสนาม"}
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="4" className="no-data-stadiumlist">⚠️ ไม่มีสนามที่ลงทะเบียน</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✅ ปุ่มด้านล่าง */}
      <div className="bottom-buttons-stadiumlist">
            <button 
                className={`btn-stadiumlist ${selectedStadium ? "" : "disabled"}`} 
                onClick={handleEditStadium} 
                disabled={!selectedStadium}>
                แก้ไข
            </button>
            <button onClick={handleAddNewStadium} className="btn-stadiumlist">
                เพิ่มสนามใหม่
            </button>
            <button 
                className={`btn-stadiumlist ${selectedStadium ? "" : "disabled"}`} 
                onClick={() => navigate(`/manage-sub-stadium/${selectedStadium}`)} 
                disabled={!selectedStadium}>
                จัดการสนามย่อย
            </button>
        </div>
    </div>
  );
}

export default StadiumList;
