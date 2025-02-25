import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./ManageSubStadiumDetails.css";
import NavbarStadiumlist from "../NavbarStadiumlist/NavbarStadiumlist";

function ManageSubStadiumDetails() {
  const location = useLocation();
  const sport = location.state?.sport;
  const [courts, setCourts] = useState([
    { id: 1, name: "Court 1", status: "เปิด", owner: "Wichai Arena", phone: "0984230116", description: "", openTime: "13:00", closeTime: "19:00", price: "200 B", images: [] },
    { id: 2, name: "Court 2", status: "เปิด", owner: "Wichai Arena", phone: "0984230116", description: "", openTime: "13:00", closeTime: "19:00", price: "200 B", images: [] },
  ]);

  const [selectedCourt, setSelectedCourt] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editedCourt, setEditedCourt] = useState({
    id: null, name: "", status: "เปิด", owner: "", phone: "", description: "", openTime: "", closeTime: "", price: "", images: []
  });

  // State สำหรับ popup ลบ
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [courtToDelete, setCourtToDelete] = useState(null);

  // เลือกสนาม
  const selectCourt = (court) => {
    setSelectedCourt(selectedCourt?.id === court.id ? null : court);
    setIsEditing(false);
    setIsAdding(false);
    setEditedCourt(court || { id: null, name: "", status: "เปิด", owner: "", phone: "", description: "", openTime: "", closeTime: "", price: "", images: [] });
  };

  // กดปุ่ม "เพิ่มสนาม"
  const handleAddClick = () => {
    setIsAdding(true);
    setIsEditing(true);
    setEditedCourt({
      id: null, name: "", status: "เปิด", owner: "", phone: "", description: "", openTime: "", closeTime: "", price: "", images: []
    });
  };

  // กด "บันทึก" (เพิ่มหรือแก้ไข)
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

  // เปิด popup ลบ
  const handleDeleteCourt = (e, courtId) => {
    e.stopPropagation(); // ป้องกันการเลือกแถว
    setCourtToDelete(courtId);
    setIsDeletePopupOpen(true);
  };

  // ยืนยันการลบ
  const confirmDeleteCourt = () => {
    if (deleteConfirmText === "Delete") {
      setCourts(courts.filter(court => court.id !== courtToDelete));
      setIsDeletePopupOpen(false);
      setDeleteConfirmText("");
    }
  };

  const toggleStatus = (courtId) => {
    setCourts(
      courts.map((court) =>
        court.id === courtId
          ? { ...court, status: court.status === "เปิด" ? "ปิดชั่วคราว" : "เปิด" }
          : court
      )
    );
  };

  const handleImageUpload = (event) => {
    const files = event.target.files;
    if (!files.length) return;
  
    const newImages = [...editedCourt.images];
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newImages.push(e.target.result);
          setEditedCourt({ ...editedCourt, images: newImages });
        };
        reader.readAsDataURL(file);
      }
    }
  };
  
  const handleRemoveImage = (index) => {
    if (!isEditing) return; // ❌ ป้องกันการลบรูปหากไม่ได้กด "แก้ไข"
  
    const updatedImages = [...editedCourt.images];
    updatedImages.splice(index, 1);
    setEditedCourt({ ...editedCourt, images: updatedImages });
  };
  
  

  return (
    <div className="manage-substadium-details">
      <NavbarStadiumlist />

      <div className="content-container">
        {/* 🔹 ฝั่งซ้าย: รายการสนาม */}
        <div className="courts-list">
          <h1 className="section-title">
            รายการสนาม 
            <button className="add-court-btn" onClick={handleAddClick}>➕</button>
          </h1>
          <table>
            <thead>
              <tr>
                <th>ชื่อสนาม</th>
                <th>สถานะ</th>
                <th>ยกเลิกสนาม</th>
              </tr>
            </thead>
            <tbody>
              {courts.map((court) => (
                <tr key={court.id} className={selectedCourt?.id === court.id ? "selected" : ""} onClick={() => selectCourt(court)}>
                  <td>{court.name}</td>
                  <td>
                    <button 
                      className={court.status === "เปิด" ? "btn-open" : "btn-closed"} 
                      onClick={(e) => { e.stopPropagation(); toggleStatus(court.id); }}
                    >
                      {court.status}
                    </button>
                  </td>
                  <td>
                    <button className="delete-btn" onClick={(e) => handleDeleteCourt(e, court.id)}>❌</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✅ Popup ยืนยันการลบ */}
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

        {/* 🔹 ฝั่งขวา: ข้อมูลสนาม */}
        <div className="court-details">
            <h2>ข้อมูลสนาม</h2>

        {/* ✅ ส่วนอัปโหลดรูปภาพ */}
        <div className="image-upload-section">
            <h3>อัปโหลดรูปภาพ</h3>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={!isEditing}
            />
        </div>

        {/* ✅ แสดงรูปภาพที่อัปโหลด */}
        <div className="image-gallery">
          {editedCourt.images.map((image, index) => (
            <div key={index} className="image-wrapper">
              <img src={image} alt={`court-${index}`} className="stadium-image" />
                <button 
                  className="delete-image-btn" 
                  onClick={() => handleRemoveImage(index)}
                  disabled={!isEditing} // ❌ ปุ่มกดไม่ได้หากไม่ได้อยู่ในโหมด "แก้ไข"
                >
                  ❌
                  </button>
              </div>
          ))}
      </div>

            <p><strong>ชื่อสนาม:</strong> 
                  <input type="text" value={editedCourt.name} onChange={(e) => setEditedCourt({ ...editedCourt, name: e.target.value })} readOnly={!isEditing} />
            </p>
            <p><strong>คำอธิบาย:</strong> 
                <textarea value={editedCourt.description} onChange={(e) => setEditedCourt({ ...editedCourt, description: e.target.value })} readOnly={!isEditing} />
            </p>
            <p><strong>เวลาทำการ:</strong></p>
                <input type="time" value={editedCourt.openTime} onChange={(e) => setEditedCourt({ ...editedCourt, openTime: e.target.value })} readOnly={!isEditing} />
                <input type="time" value={editedCourt.closeTime} onChange={(e) => setEditedCourt({ ...editedCourt, closeTime: e.target.value })} readOnly={!isEditing} />
            <p><strong>ราคาต่อชั่วโมง:</strong> 
                <input type="text" value={editedCourt.price} onChange={(e) => setEditedCourt({ ...editedCourt, price: e.target.value })} readOnly={!isEditing} />
            </p>

        <h2>เจ้าของสนาม</h2>
            <p><strong>ชื่อเจ้าของ:</strong> 
                <input type="text" value={editedCourt.owner} onChange={(e) => setEditedCourt({ ...editedCourt, owner: e.target.value })} readOnly={!isEditing} />
            </p>
              <p><strong>เบอร์โทรศัพท์:</strong> 
                  <input type="text" value={editedCourt.phone} onChange={(e) => setEditedCourt({ ...editedCourt, phone: e.target.value })} readOnly={!isEditing} />
              </p>

            <div className="details-buttons">
                {isEditing ? (
            <>
                <button className="save-btn" onClick={handleSaveClick}>บันทึก</button>
                <button className="cancel-btn" onClick={() => { setIsEditing(false); setIsAdding(false); }}>ยกเลิก</button>
            </>
                ) : (
                  selectedCourt && <button className="edit-btn" onClick={() => setIsEditing(true)}>แก้ไข</button>
                )}
            </div>
        </div>


      </div>
    </div>
  );
}

export default ManageSubStadiumDetails;
