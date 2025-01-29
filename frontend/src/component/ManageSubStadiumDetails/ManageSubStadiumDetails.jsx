import React, { useState } from "react";
import "./ManageSubStadiumDetails.css";
import homeLogo from "../assets/logoalt.png";

function ManageSubStadiumDetails() {
  const [courts, setCourts] = useState([
    { id: 1, name: "Court 1", status: "เปิด", owner: "Wichai Arena", phone: "0984230116", description: "", openTime: "13:00", closeTime: "19:00", price: "200 B" },
    { id: 2, name: "Court 2", status: "เปิด", owner: "Wichai Arena", phone: "0984230116", description: "", openTime: "13:00", closeTime: "19:00", price: "200 B" },
    { id: 3, name: "Court 3", status: "เปิด", owner: "Wichai Arena", phone: "0984230116", description: "", openTime: "13:00", closeTime: "19:00", price: "200 B" },
    { id: 4, name: "Court 4", status: "ปิด", owner: "Wichai Arena", phone: "0984230116", description: "", openTime: "13:00", closeTime: "19:00", price: "200 B" },
  ]);

  const [selectedCourt, setSelectedCourt] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editedCourt, setEditedCourt] = useState({
    id: null, name: "", status: "เปิด", owner: "", phone: "", description: "", openTime: "", closeTime: "", price: "",
  });

  const selectCourt = (court) => {
    setSelectedCourt(selectedCourt?.id === court.id ? null : court);
    setIsEditing(false);
    setIsAdding(false);
    setEditedCourt(court || {
      id: null, name: "", status: "เปิด", owner: "", phone: "", description: "", openTime: "", closeTime: "", price: "",
    });
  };

  const toggleCourtStatus = (courtId) => {
    setCourts((prevCourts) =>
      prevCourts.map((court) =>
        court.id === courtId ? { ...court, status: court.status === "เปิด" ? "ปิด" : "เปิด" } : court
      )
    );
  };

  const handleEditClick = () => {
    if (isEditing && selectedCourt) {
      setCourts((prevCourts) =>
        prevCourts.map((court) =>
          court.id === selectedCourt.id ? { ...court, ...editedCourt } : court
        )
      );
      setSelectedCourt(editedCourt);
    }
    setIsEditing(!isEditing);
  };

  const handleAddClick = () => {
    setIsAdding(true);
    setIsEditing(true);
    setSelectedCourt(null);
    setEditedCourt({
      id: courts.length + 1, name: "", status: "เปิด", owner: "New Owner", phone: "0000000000", description: "", openTime: "", closeTime: "", price: "",
    });
  };

  const handleSaveNewCourt = () => {
    setCourts([...courts, editedCourt]);
    setIsAdding(false);
    setIsEditing(false);
    setSelectedCourt(editedCourt);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(false);
    setSelectedCourt(null);
  };

  // ✅ ฟังก์ชันให้ช่องเบอร์โทรรับแค่ตัวเลข
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // ลบตัวอักษรที่ไม่ใช่ตัวเลข
    setEditedCourt({ ...editedCourt, phone: value });
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
                    {court.status === "เปิด" ? "กดเพื่อปิดชั่วคราว" : "กดเพื่อเปิด"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ ฝั่งขวา: รายละเอียดสนาม */}
      <div className="court-details">
        <h2>ข้อมูลสนาม</h2>
        <div className="stadium-info">
          <p><strong>ชื่อสนาม:</strong> 
            <input 
              type="text" 
              value={editedCourt.name} 
              onChange={(e) => setEditedCourt({ ...editedCourt, name: e.target.value })} 
              readOnly={!isEditing} 
            />
          </p>
          <p><strong>คำอธิบาย:</strong> <textarea value={editedCourt.description} onChange={(e) => setEditedCourt({ ...editedCourt, description: e.target.value })} readOnly={!isEditing} /></p>
          
          {/* ✅ ช่องเลือกเวลาเปิด-ปิด */}
          <p><strong>เวลาทำการ:</strong></p>
          <div className="time-picker">
            <label>เปิด: </label>
            <input type="time" value={editedCourt.openTime} onChange={(e) => setEditedCourt({ ...editedCourt, openTime: e.target.value })} readOnly={!isEditing} />
            <label> - ปิด: </label>
            <input type="time" value={editedCourt.closeTime} onChange={(e) => setEditedCourt({ ...editedCourt, closeTime: e.target.value })} readOnly={!isEditing} />
          </div>

          <p><strong>ราคาต่อชั่วโมง:</strong> <input type="text" value={editedCourt.price} onChange={(e) => setEditedCourt({ ...editedCourt, price: e.target.value })} readOnly={!isEditing} /></p>
        </div>

        <h2>เจ้าของสนาม</h2>
        <div className="owner-info">
          <p><strong>ชื่อเจ้าของ:</strong> <input type="text" value={editedCourt.owner} onChange={(e) => setEditedCourt({ ...editedCourt, owner: e.target.value })} readOnly={!isEditing} /></p>
          <p><strong>เบอร์โทรศัพท์:</strong> 
            <input 
              type="text" 
              value={editedCourt.phone} 
              onChange={handlePhoneChange} 
              readOnly={!isEditing} 
            />
          </p>
        </div>

        <div className="details-buttons">
          <button className="edit-btn" onClick={handleEditClick}>{isEditing ? "บันทึก" : "แก้ไขที่เลือก"}</button>
          <button className="cancel-btn" onClick={handleCancel}>{isAdding ? "ยกเลิก" : "เพิ่ม"}</button>
        </div>
      </div>
    </div>
  );
}

export default ManageSubStadiumDetails;
