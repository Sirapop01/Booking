import axios from "axios"; // ⬅️ เพิ่ม axios
import { useParams } from "react-router-dom"; // ⬅️ ใช้ useParams() แทน useLocation()
import { useEffect } from "react"; // ⬅️ ใช้ useEffect()
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./ManageSubStadiumDetails.css";
import NavbarStadiumlist from "../NavbarStadiumlist/NavbarStadiumlist";

function ManageSubStadiumDetails() {
  const location = useLocation();
  const { arenaId, sportId } = useParams();
  console.log("arenaId:", arenaId, "sportId:", sportId);
  const [courts, setCourts] = useState([]);

useEffect(() => {
  axios.get(`http://localhost:4000/api/substadiums/${arenaId}/${sportId}`)
    .then(response => {
      setCourts(response.data);
    })
    .catch(error => console.error("❌ Error fetching substadiums:", error));
}, [arenaId, sportId]);


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

  const handleAddClick = () => {
    setIsAdding(true);
    setIsEditing(true);
  
    const newCourt = {
      id: null, // จะถูกแทนที่หลังจากบันทึกลงฐานข้อมูล
      name: "",
      status: "เปิด",
      owner: "",
      phone: "",
      description: "",
      openTime: "",
      closeTime: "",
      price: "",
      images: []
    };
  
    setEditedCourt(newCourt);
    setSelectedCourt(newCourt); // ✅ เลือกสนามใหม่อัตโนมัติ
  };
  

  const handleSaveClick = () => {
    if (isAdding) {
      axios.post("http://localhost:4000/api/substadiums", {
        arenaId,
        sportId,
        ...editedCourt
      })
      .then(response => {
        setCourts([...courts, response.data]); // อัปเดต UI
        setIsAdding(false);
        setIsEditing(false);
        window.location.reload(); // ✅ รีเฟรชหน้าใหม่
      })
      .catch(error => console.error("❌ Failed to save substadium:", error));
    } else {
      axios.put(`http://localhost:4000/api/substadiums/${selectedCourt._id}`, editedCourt)
      .then(response => {
        setCourts(courts.map(court => court._id === selectedCourt._id ? response.data : court));
        setIsEditing(false);
        window.location.reload(); // ✅ รีเฟรชหน้าใหม่
      })
      .catch(error => console.error("❌ Failed to update substadium:", error));
    }
  };
  
  
  // เปิด popup ลบ
  const handleDeleteCourt = (e, courtId) => {
    e.stopPropagation();
  
    console.log("🗑️ กำลังเตรียมลบสนามย่อย ID:", courtId); // ✅ เช็คค่า ID ที่ได้
    if (!courtId) {
      alert("❌ ไม่พบ ID ของสนาม กรุณารีเฟรชหน้าแล้วลองใหม่");
      return;
    }
  
    setCourtToDelete(courtId);
    setIsDeletePopupOpen(true);
  };
  
  

// ✅ ฟังก์ชันยืนยันการลบสนาม
const confirmDeleteCourt = async () => {
  if (deleteConfirmText !== "Delete") return;
  if (!courtToDelete) {
    alert("❌ ไม่พบ ID ของสนาม กรุณารีเฟรชหน้าแล้วลองใหม่");
    return;
  }

  try {
    console.log("🗑️ กำลังลบสนามย่อย ID:", courtToDelete); // ✅ ตรวจสอบค่า ID ที่จะลบ

    await axios.delete(`http://localhost:4000/api/substadiums/${courtToDelete}`);

    setCourts((prevCourts) => prevCourts.filter((court) => court._id !== courtToDelete));
    
    // ✅ ปิดป็อปอัพอัตโนมัติ
    setIsDeletePopupOpen(false);
    setDeleteConfirmText("");
    setCourtToDelete(null);

    // ✅ แจ้งเตือนว่าลบสำเร็จ
    alert("✅ ลบสนามย่อยสำเร็จ!");

    // ✅ รีเฟรชหน้าหลังจาก 1 วินาที เพื่อให้เห็นผลชัดเจน
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (error) {
    console.error("❌ Failed to delete substadium:", error);
    alert("เกิดข้อผิดพลาดในการลบสนามย่อย");
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

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", "substadium-images"); // ✅ กำหนด folder เพื่ออัปโหลดไปยัง Cloudinary
  
    try {
      const response = await axios.post("http://localhost:4000/api/upload/single", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      // ✅ บันทึกลิงก์ของรูปภาพที่อัปโหลดสำเร็จลงใน state
      setEditedCourt({ ...editedCourt, images: [...editedCourt.images, response.data.imageUrl] });
    } catch (error) {
      console.error("❌ Image upload failed:", error);
    }
  };
  
  const handleRemoveImage = async (index) => {
    if (!isEditing) return;
  
    const imageUrl = editedCourt.images[index];
  
    try {
      await axios.post("http://localhost:4000/api/delete-image", { imageUrl });
  
      const updatedImages = [...editedCourt.images];
      updatedImages.splice(index, 1);
      setEditedCourt({ ...editedCourt, images: updatedImages });
    } catch (error) {
      console.error("❌ Failed to delete image:", error);
    }
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
                  <tr key={court._id} className={selectedCourt?._id === court._id ? "selected" : ""} onClick={() => selectCourt(court)}>
                    <td>{court.name}</td>
                    <td>
                      <button 
                        className={court.status === "เปิด" ? "btn-open" : "btn-closed"} 
                        onClick={(e) => { e.stopPropagation(); toggleStatus(court._id); }} // ✅ ใช้ `_id` แทน `id`
                      >
                        {court.status}
                      </button>
                    </td>
                    <td>
                      <button 
                        className="delete-btn" 
                        onClick={(e) => handleDeleteCourt(e, court._id)} // ✅ ใช้ `_id` แทน `id`
                      >
                        ❌
                      </button>
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
          {editedCourt?.images?.map((image, index) => (
            <div key={image} className="image-wrapper"> {/* ✅ ใช้ image เป็น key */}
              <img src={image} alt={`court-image-${index}`} className="stadium-image" />
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
