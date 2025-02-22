import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // ✅ ใช้ named export
import "./StadiumList.css";
import NavbarStadiumlist from "../NavbarStadiumlist/NavbarStadiumlist";

function StadiumList() {
  const navigate = useNavigate();
  const [stadiums, setStadiums] = useState([]);
  const [selectedStadium, setSelectedStadium] = useState(null);
  const [ownerId, setOwnerId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("⚠️ ไม่พบ Token ใน localStorage");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      console.log("📌 Token Decoded:", decoded);

      if (!decoded.id) {
        console.error("⚠️ ไม่พบ ID ใน Token");
        return;
      }

      setOwnerId(decoded.id);

      // ✅ ดึงข้อมูลสนามของเจ้าของ
      const fetchStadiums = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/api/arenas/getArenas?owner_id=${decoded.id}`);
          console.log("📌 API Response:", response.data);
          setStadiums(response.data);
        } catch (error) {
          console.error("⚠️ ไม่สามารถโหลดข้อมูลสนาม:", error);
        }
      };

      fetchStadiums();
    } catch (error) {
      console.error("⚠️ ไม่สามารถถอดรหัส Token:", error);
    }
  }, []);

  // ✅ เลือกสนาม
  const handleRowClick = (id) => {
    setSelectedStadium(id === selectedStadium ? null : id);
  };

  // ✅ เปิด/ปิดสนาม
  const toggleStadium = async (stadiumId, openState) => {
    try {
      await axios.put(`http://localhost:4000/api/arenas/updateArena/${stadiumId}`, { open: openState });

      setStadiums((prev) =>
        prev.map((st) => (st._id === stadiumId ? { ...st, open: openState } : st))
      );
    } catch (error) {
      console.error("⚠️ ไม่สามารถเปลี่ยนสถานะสนาม:", error);
    }
  };

  return (
    <div className="stadium-page-container">
      {/* ✅ ปุ่มกลับไปยังหน้า Home */}
      <NavbarStadiumlist />

      {/* ✅ ตารางสนาม */}
      <table className="stadium-table">
        <thead>
          <tr>
            <th style={{ width: "40%" }}>ชื่อสนาม</th>
            <th style={{ width: "20%" }}>สถานะ</th>
            <th style={{ width: "20%" }}>เปิด/ปิด</th>
            <th style={{ width: "20%" }}>ตัวเลือก</th>
          </tr>
        </thead>
        <tbody>
          {stadiums.length > 0 ? (
            stadiums.map((stadium) => (
              <tr
                key={stadium._id}
                className={`table-row 
                  ${selectedStadium === stadium._id ? "selected" : ""} 
                  ${!stadium.open || stadium.status === "รอการยืนยัน" ? "closed-row" : ""}`}
                onClick={() => handleRowClick(stadium._id)}
              >
                <td>{stadium.fieldName}</td>
                <td className={stadium.status === "รอการยืนยัน" ? "pending-status" : ""}>
                  {stadium.status}
                </td>
                <td className={stadium.open ? "status-open" : "status-closed"}>
                  {stadium.open ? "✅ เปิด" : "❌ ปิด"}
                </td>
                <td>
                  {stadium.status === "รอการยืนยัน" ? (
                    <button className="toggle-btn btn-disabled" disabled>
                      รอการยืนยัน
                    </button>
                  ) : stadium.open ? (
                    <button className="toggle-btn btn-close" onClick={() => toggleStadium(stadium._id, false)}>
                      ปิดสนาม
                    </button>
                  ) : (
                    <button className="toggle-btn btn-open" onClick={() => toggleStadium(stadium._id, true)}>
                      เปิดสนาม
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-data">⚠️ ไม่มีสนามที่ลงทะเบียน</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✅ ปุ่มด้านล่าง */}
      <div className="bottom-buttons">
        <a href={selectedStadium ? `/edit/${selectedStadium}` : "#"} className={`btn ${selectedStadium ? "" : "disabled"}`}>
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
