import React, { useState } from "react";
import "./Addpromotion.css";
import Navbar from "../Navbar/Navbar";
import uploadIcon from "../assets/icons/add.png";

const Addpromotion = () => {
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    stadiumName: "",
    type: "",
    discount: "",
    startDate: "",
    endDate: "",
    timeRange: "",
  });

  // อัปโหลดรูป
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  // ลบรูปภาพ
  const handleRemoveImage = () => {
    console.log("ลบรูปแล้ว"); // ตรวจสอบว่าฟังก์ชันทำงาน
    setImage(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting: ", formData);
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
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  hidden
                />
              </label>
            )}
          </div>
        </div>

        <form className="promotion-form" onSubmit={handleSubmit}>
          <h2>ข้อมูลโปรโมชั่น</h2>
          <div className="input-group">
            <label>ชื่่อสนาม: *</label>
            <input
              type="text"
              name="stadiumName"
              value={formData.stadiumName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>ประเภท: *</label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>ลดราคา (%): *</label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="date-group">
            <label>ระยะเวลา: *</label>
            <div className="date-inputs">
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
              <span>ถึง</span>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>ช่วงเวลา: *</label>
            <input
              type="text"
              name="timeRange"
              value={formData.timeRange}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-button">
            ยืนยันโปรโมชั่น
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addpromotion;
