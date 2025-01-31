/*jsx managesubstadiumdetail*/
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ManageSubStadiumDetails.css";
import homeLogo from "../assets/logoalt.png";

function ManageSubStadiumDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const sport = location.state?.sport;
  const [courts, setCourts] = useState([
    { id: 1, name: "Court 1", status: "เปิด", owner: "Wichai Arena", phone: "0984230116", description: "", openTime: "13:00", closeTime: "19:00", price: "200 B", image: null },
    { id: 2, name: "Court 2", status: "เปิด", owner: "Wichai Arena", phone: "0984230116", description: "", openTime: "13:00", closeTime: "19:00", price: "200 B", image: null },
    { id: 3, name: "Court 3", status: "เปิด", owner: "Wichai Arena", phone: "0984230116", description: "", openTime: "13:00", closeTime: "19:00", price: "200 B", image: null },
    { id: 4, name: "Court 4", status: "ปิด", owner: "Wichai Arena", phone: "0984230116", description: "", openTime: "13:00", closeTime: "19:00", price: "200 B", image: null },
  ]);

  const [selectedCourt, setSelectedCourt] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editedCourt, setEditedCourt] = useState({
    id: null, name: "", status: "เปิด", owner: "", phone: "", description: "", openTime: "", closeTime: "", price: "", image: null,
  });

  const selectCourt = (court) => {
    setSelectedCourt(selectedCourt?.id === court.id ? null : court);
    setIsEditing(false);
    setIsAdding(false);
    setEditedCourt(court || {
      id: null, name: "", status: "เปิด", owner: "", phone: "", description: "", openTime: "", closeTime: "", price: "", image: null,
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
    if (selectedCourt) {
        setIsEditing(true);
        setEditedCourt(selectedCourt);
    }
};

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);

    setEditedCourt((prevCourt) => ({
        ...prevCourt,
        images: [...(prevCourt.images || []), ...files] // ✅ เก็บไฟล์จริง
    }));
};

const handleRemoveImage = (index) => {
    setEditedCourt((prevCourt) => ({
        ...prevCourt,
        images: prevCourt.images.filter((_, i) => i !== index) // ✅ ลบรูปที่เลือก
    }));
};

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(false);
    setSelectedCourt(null);
  };

  const handleAddClick = () => {
    setIsAdding(true);
    setIsEditing(true);
    setEditedCourt({
        id: null, name: "", status: "เปิด", owner: "", phone: "", description: "", openTime: "", closeTime: "", price: "", images: []
    });
};

const handleSaveClick = () => {
  if (isAdding) {
      const newCourt = { ...editedCourt, id: courts.length + 1 };
      setCourts([...courts, newCourt]);
  } else {
      setCourts(courts.map(court => court.id === selectedCourt.id ? editedCourt : court));
  }

  setIsEditing(false);
  setIsAdding(false);
  setSelectedCourt(null);
};

const handleDeleteCourt = (event, courtId) => {
  event.stopPropagation(); // ป้องกันการเลือกสนามโดยไม่ได้ตั้งใจ
  setCourtToDelete(courtId);
  setIsDeletePopupOpen(true);
  setDeleteConfirmText(""); // รีเซ็ตค่าช่องพิมพ์
};

const confirmDeleteCourt = () => {
  setCourts((prevCourts) => prevCourts.filter((court) => court.id !== courtToDelete));

  // รีเซ็ตค่า
  setIsDeletePopupOpen(false);
  setCourtToDelete(null);
  setSelectedCourt(null);
  setIsEditing(false);
};

const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
const [deleteConfirmText, setDeleteConfirmText] = useState("");
const [courtToDelete, setCourtToDelete] = useState(null);



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
                <td className="delete-cell">
                  <button className="delete-btn" onClick={(e) => handleDeleteCourt(e, court.id)}>
                    ❌
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isDeletePopupOpen && (
          <div className="overlay">
              <div className="delete-popup">
                  <button className="close-btn" onClick={() => setIsDeletePopupOpen(false)}>✖</button>
                  <h2>ลบสนามย่อยนี้</h2>
                  <p>โปรดพิมพ์ <strong>"Delete"</strong> เพื่อยืนยัน</p>
                  <input 
                      type="text" 
                      value={deleteConfirmText} 
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="พิมพ์ Delete ที่นี่"
                  />
                  <button 
                      className="confirm-delete-btn" 
                      onClick={confirmDeleteCourt} 
                      disabled={deleteConfirmText !== "Delete"}
                  >
                      ลบ
                  </button>
              </div>
          </div>
      )}


      {/* ✅ ฝั่งขวา: รายละเอียดสนาม */}
      <div className="court-details">
        <h2>ข้อมูลสนาม</h2>
        <div className="stadium-info">
            <div className="image-gallery">
            {/* ✅ แสดงภาพที่อัปโหลด */}
            {editedCourt.images && editedCourt.images.length > 0 ? (
              editedCourt.images.map((file, index) => (
                <div key={index} className="image-wrapper">
                  <img src={URL.createObjectURL(file)} alt={`สนามกีฬา ${index + 1}`} className="stadium-image" />
                  {isEditing && (
                    <button className="remove-image-btn" onClick={() => handleRemoveImage(index)}>✖</button>
                  )}
                </div>
              ))
            ) : (
              <div className="image-placeholder">ไม่มีรูปภาพ</div>
            )}

            {/* ✅ ปุ่มเพิ่มรูป */}
            {isEditing && (
              <label className="image-upload-box">
                <span className="plus-icon">+</span>
                <input
                  type="file"
                  accept="image/*"
                  className="file-input-hidden"
                  onChange={handleImageChange}
                  multiple
                />
              </label>
            )}
          </div>

          <p><strong>ชื่อสนาม:</strong> 
            <input 
              type="text" 
              value={editedCourt.name} 
              onChange={(e) => setEditedCourt({ ...editedCourt, name: e.target.value })} 
              readOnly={!isEditing} 
            />
          </p>
          <p><strong>คำอธิบาย:</strong> <textarea value={editedCourt.description} onChange={(e) => setEditedCourt({ ...editedCourt, description: e.target.value })} readOnly={!isEditing} /></p>
        </div>

         {/* ✅ ช่องเลือกเวลาเปิด-ปิด */}
         <p><strong>เวลาทำการ:</strong></p>
          <div className="time-picker">
            <label>เปิด: </label>
            <input type="time" value={editedCourt.openTime} onChange={(e) => setEditedCourt({ ...editedCourt, openTime: e.target.value })} readOnly={!isEditing} />
            <label> - ปิด: </label>
            <input type="time" value={editedCourt.closeTime} onChange={(e) => setEditedCourt({ ...editedCourt, closeTime: e.target.value })} readOnly={!isEditing} />
          </div>

          <p><strong>ราคาต่อชั่วโมง:</strong> <input type="text" value={editedCourt.price} onChange={(e) => setEditedCourt({ ...editedCourt, price: e.target.value })} readOnly={!isEditing} /></p>
        


        <h2>เจ้าของสนาม</h2>
        <div className="owner-info">
          <p><strong>ชื่อเจ้าของ:</strong> <input type="text" value={editedCourt.owner} onChange={(e) => setEditedCourt({ ...editedCourt, owner: e.target.value })} readOnly={!isEditing} /></p>
          <p><strong>เบอร์โทรศัพท์:</strong> 
            <input 
              type="text" 
              value={editedCourt.phone} 
              onChange={(e) => setEditedCourt({ ...editedCourt, phone: e.target.value })} 
              readOnly={!isEditing} 
            />
          </p>
        </div>

          <div className="details-buttons">
            {!isEditing && !isAdding && selectedCourt && (
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                    แก้ไขที่เลือก
                </button>
            )}

            {isEditing && (
                <button className="save-btn" onClick={handleSaveClick}>
                    บันทึก
                </button>
            )}

            {!isEditing && !isAdding && (
                <button className="add-btn" onClick={handleAddClick}>
                    เพิ่ม
                </button>
            )}

            {(isEditing || isAdding) && (
                <button className="cancel-btn" onClick={handleCancel}>
                    ยกเลิก
                </button>
            )}
        </div>
      </div>
      </div>
  );
}

export default ManageSubStadiumDetails;
