import React, { useState } from "react";
import "./ManageStadium.css";
import logo from "../assets/logo.png"; // โลโก้ด้านบน
import homeLogo from "../assets/logoalt.png"; // โลโก้ปุ่ม Home

function ManageStadium() {
  const [stadiumData, setStadiumData] = useState({
    name: "",
    owner: "",
    phone: "",
    openingHours: "",
    location: "",
    amenities: [],
    bookingInfo: "",
    image: null,
  });

  // อัปโหลดรูปภาพ
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setStadiumData({ ...stadiumData, image: URL.createObjectURL(file) });
    }
  };

  // อัปเดตค่าฟอร์ม
  const handleChange = (event) => {
    const { name, value } = event.target;
    setStadiumData({ ...stadiumData, [name]: value });
  };

  // อัปเดตสิ่งอำนวยความสะดวก
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    let updatedAmenities = [...stadiumData.amenities];

    if (checked) {
      updatedAmenities.push(name);
    } else {
      updatedAmenities = updatedAmenities.filter((item) => item !== name);
    }

    setStadiumData({ ...stadiumData, amenities: updatedAmenities });
  };

  return (
    <div className="manage-stadium-container">
      {/* ปุ่มกลับหน้าแรก */}
      <a href="/" className="home-button">
        <img src={homeLogo} alt="Home" className="home-logo" />
      </a>

      {/* หัวข้อ */}
      <h1 className="page-title">
        <img src={logo} alt="Logo" className="logo" />
        จัดการสนาม
      </h1>

      <div className="form-container">
        {/* อัปโหลดรูปสนาม */}
        <div className="image-upload-section">
          <p>รูปภาพสนาม</p>
          <label className="image-upload">
            {stadiumData.image ? (
              <img src={stadiumData.image} alt="Stadium" className="uploaded-image" />
            ) : (
              <span className="upload-placeholder">+</span>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
          </label>
        </div>

        {/* ฟอร์มข้อมูลสนาม */}
        <div className="stadium-info">
          <p>ข้อมูลของสนาม</p>
          <label>ชื่อสนาม: *</label>
          <input type="text" name="name" value={stadiumData.name} onChange={handleChange} required />

          <label>เจ้าของ: *</label>
          <input type="text" name="owner" value={stadiumData.owner} onChange={handleChange} required />

          <label>เบอร์โทรศัพท์: *</label>
          <input type="tel" name="phone" value={stadiumData.phone} onChange={handleChange} required />

          <label>เวลาทำการ: *</label>
          <input type="text" name="openingHours" value={stadiumData.openingHours} onChange={handleChange} required />

          <label>ตำแหน่งที่ตั้ง: *</label>
          <textarea name="location" value={stadiumData.location} onChange={handleChange} required />
        </div>

        {/* ข้อมูลเพิ่มเติม */}
        <div className="additional-info">
          <p>ข้อมูลเพิ่มเติม</p>
          <div className="amenities-box" style={{ padding: "15px", maxWidth: "300px" }}> {/* ลดขนาดของกรอบ */}
            <label>สิ่งอำนวยความสะดวก: *</label>
            <div className="amenities">
              {["ห้องน้ำ", "อุปกรณ์เช่า", "WIFI", "ที่จอดรถ", "เครื่องปรับอากาศ", "ร้านค้า"].map((item) => (
                <label key={item}>
                  <input type="checkbox" name={item} checked={stadiumData.amenities.includes(item)} onChange={handleCheckboxChange} />
                  {item}
                </label>
              ))}
            </div>
          </div>
          <label>ข้อมูลสนาม / เงื่อนไขการจอง: *</label>
          <textarea name="bookingInfo" value={stadiumData.bookingInfo} onChange={handleChange} required />
        </div>
      </div>

      {/* ปุ่มบันทึก / ยกเลิก */}
      <div className="bottom-buttons">
        <button className="btn btn-save">บันทึก</button>
        <button className="btn btn-cancel">ยกเลิก</button>
      </div>
    </div>
  );
}

export default ManageStadium;
