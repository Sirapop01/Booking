import React, { useState } from "react";
import "./ManageSubStadiumDetails.css";
import homeLogo from "../assets/logoalt.png";

function ManageSubStadiumDetails() {
  const [courts, setCourts] = useState([
    { id: 1, name: "Court 1", status: "เปิด", owner: "Wichai Arena", phone: "098 4230 116", description: "", hours: "13:00 - 19:00", price: "200 B" },
    { id: 2, name: "Court 2", status: "เปิด", owner: "Wichai Arena", phone: "098 4230 116", description: "", hours: "13:00 - 19:00", price: "200 B" },
    { id: 3, name: "Court 3", status: "เปิด", owner: "Wichai Arena", phone: "098 4230 116", description: "", hours: "13:00 - 19:00", price: "200 B" },
    { id: 4, name: "Court 4", status: "ปิด", owner: "Wichai Arena", phone: "098 4230 116", description: "", hours: "13:00 - 19:00", price: "200 B" },
  ]);

  const [selectedCourt, setSelectedCourt] = useState(null);

  const selectCourt = (court) => {
    setSelectedCourt(selectedCourt?.id === court.id ? null : court);
  };

  const toggleCourtStatus = (courtId) => {
    setCourts((prevCourts) =>
      prevCourts.map((court) =>
        court.id === courtId ? { ...court, status: court.status === "เปิด" ? "ปิด" : "เปิด" } : court
      )
    );
  };

  return (
    <div className="manage-substadium-details">
      {/* ✅ ปุ่ม Home */}
      <a href="/" className="home-button">
        <img src={homeLogo} alt="Home" className="home-logo" />
      </a>

      {/* ✅ ฝั่งซ้าย: รายการสนาม */}
      <div className="courts-list">
        <h1 className="section-title">รายการสนาม</h1>
        <table>
          <thead>
            <tr>
              <th>ชื่อสนาม</th>
              <th className="status-header">สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {courts.map((court) => (
              <tr
                key={court.id}
                className={`table-row ${court.status === "ปิด" ? "closed-row" : ""} ${
                  selectedCourt?.id === court.id ? "selected" : ""
                }`}
                onClick={() => selectCourt(court)}
              >
                <td>{court.name}</td>
                <td className="status-cell">
                  <button
                    className={`toggle-btn ${court.status === "เปิด" ? "btn-close" : "btn-open"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCourtStatus(court.id);
                    }}
                  >
                    {court.status === "เปิด" ? "กดเพื่อปิด" : "กดเพื่อเปิด"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ ฝั่งขวา: รายละเอียดสนาม */}
      <div className="court-details">
        {selectedCourt ? (
          <>
            <h2>ข้อมูลสนาม</h2>
            <p><strong>ชื่อสนาม:</strong> {selectedCourt.name}</p>
            <p><strong>สนาม:</strong> <input type="text" defaultValue={selectedCourt.owner} /></p>
            <p><strong>เจ้าของ:</strong> <input type="text" defaultValue={selectedCourt.owner} /></p>
            <p><strong>เบอร์โทรศัพท์:</strong> <input type="text" defaultValue={selectedCourt.phone} /></p>
            <p><strong>คำอธิบาย:</strong> <textarea defaultValue={selectedCourt.description} /></p>
            <p><strong>เวลาทำการ:</strong> <input type="text" defaultValue={selectedCourt.hours} /></p>
            <p><strong>ราคาต่อชั่วโมง:</strong> <input type="text" defaultValue={selectedCourt.price} /></p>
            <p><strong>สถานะ:</strong> {selectedCourt.status}</p>
            <div className="details-buttons">
              <button className="edit-btn">แก้ไขที่เลือก</button>
              <button className="add-btn">เพิ่ม</button>
            </div>
          </>
        ) : (
          <p>กรุณาเลือกสนามเพื่อดูรายละเอียด</p>
        )}
      </div>
    </div>
  );
}

export default ManageSubStadiumDetails;
