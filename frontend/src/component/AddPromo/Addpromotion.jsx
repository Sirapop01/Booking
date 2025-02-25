import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Addpromotion.css";
import Navbar from "../Navbar/Navbar";
import uploadIcon from "../assets/icons/add.png";

const Addpromotion = () => {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [arenas, setArenas] = useState([]);
  const [formData, setFormData] = useState({
    promotionTitle: "",
    description: "",
    arenaId: "",
    type: "",
    discount: "",
    startDate: "",
    endDate: "",
    startHour: "",
    startMinute: "",
    endHour: "",
    endMinute: "",
  });

  // 📌 ดึงข้อมูลสนามจาก Arena API
  useEffect(() => {
    const fetchArenas = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:4000/api/arenas", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setArenas(response.data);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลสนาม:", error.response?.data || error.message);
      }
    };
    fetchArenas();
  }, []);

  // 📌 อัปโหลดรูป
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setFile(file);
    }
  };

  // 📌 ลบรูปภาพ
  const handleRemoveImage = () => {
    setImage(null);
    setFile(null);
  };

  // 📌 ตรวจสอบค่า input และไม่ให้ endDate น้อยกว่า startDate
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "endDate" && value < formData.startDate) {
      alert("วันที่สิ้นสุดต้องไม่ย้อนหลังกว่าวันที่เริ่มต้น");
      return;
    }

    if (name === "discount" && value < 0) {
      alert("ไม่สามารถใส่จำนวนติดลบได้");
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  // 📌 ตรวจสอบข้อมูลก่อนส่ง
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.promotionTitle || !formData.arenaId || !formData.type || !formData.discount || !formData.startDate || !formData.endDate || !formData.startHour || !formData.startMinute || !formData.endHour || !formData.endMinute || !file) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน และอัปโหลดรูปภาพ");
      return;
    }

    const timeRange = `${formData.startHour}:${formData.startMinute} - ${formData.endHour}:${formData.endMinute}`;

    const formDataToSend = new FormData();
    formDataToSend.append("promotionTitle", formData.promotionTitle);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("arenaId", formData.arenaId);
    formDataToSend.append("type", formData.type);
    formDataToSend.append("discount", formData.discount);
    formDataToSend.append("startDate", formData.startDate);
    formDataToSend.append("endDate", formData.endDate);
    formDataToSend.append("timeRange", timeRange);
    formDataToSend.append("promotionImage", file);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:4000/api/promotions", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });

      alert("✅ เพิ่มโปรโมชั่นสำเร็จ!");
      setFormData({
        promotionTitle: "",
        description: "",
        arenaId: "",
        type: "",
        discount: "",
        startDate: "",
        endDate: "",
        startHour: "",
        startMinute: "",
        endHour: "",
        endMinute: "",
      });
      setImage(null);
      setFile(null);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการเพิ่มโปรโมชั่น:", error.response?.data || error.message);
      alert("เกิดข้อผิดพลาดในการเพิ่มโปรโมชั่น");
    }
  };

  return (
    <div className="promotion-container">
      <Navbar />
      <h1 className="page-title">เพิ่มโปรโมชั่น สำหรับผู้ประกอบการ</h1>
      <div className="form-container">
        <div className="image-upload-section">
          <h2>เพิ่มรูปโปรโมชั่น</h2>
          <div className="image-box">
            {image ? (
              <div className="uploaded-container">
                <img src={image} alt="Uploaded" className="uploaded-image" />
                <button className="remove-image-button" onClick={handleRemoveImage}>
                  ลบรูป
                </button>
              </div>
            ) : (
              <label htmlFor="imageUpload" className="upload-label">
                <img src={uploadIcon} alt="Upload" className="upload-icon" />
                <input type="file" id="imageUpload" accept="image/*" onChange={handleImageUpload} hidden />
              </label>
            )}
          </div>
        </div>

        <form className="promotion-form" onSubmit={handleSubmit}>
          <h2>ข้อมูลโปรโมชั่น</h2>
          <div className="input-group">
            <label>ชื่อโปรโมชั่น : *</label>
            <input type="text" name="promotionTitle" value={formData.promotionTitle} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>รายละเอียดโปรโมชั่น :</label>
            <input name="description" value={formData.description} onChange={handleChange} rows="3"/>
          </div>

          <div className="input-group">
            <label>ชื่่อสนาม : *</label>
            <select name="arenaId" value={formData.arenaId} onChange={handleChange} required>
              <option value="">-- เลือกสนาม --</option>
              {arenas.map((arena) => (
                <option key={arena._id} value={arena._id}>{arena.fieldName}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>ประเภทสนาม: *</label>
            <input type="text" name="type" value={formData.type} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>ลดราคา(%) : *</label>
            <input type="number" name="discount" value={formData.discount} onChange={handleChange} required />
          </div>

          <div className="date-group">
            <label>ระยะเวลา : *</label>
            <label>เริ่มต้น</label>
            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
            <label>สิ้นสุด</label>
            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>ช่วงเวลา : *</label>
            <input type="time" name="startHour" value={formData.startHour} onChange={handleChange} required />
            <input type="time" name="endHour" value={formData.endHour} onChange={handleChange} required />
          </div>

          <button type="submit" className="submit-button">ยืนยันโปรโมชั่น</button>
        </form>
      </div>
    </div>
  );
};

export default Addpromotion;
