import React, { useState } from "react";
import "./Registerarena.css";
import logo from '../assets/logo.png';

const MatchWebForm = () => {
  const [images, setImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErrors] = useState("");

  const [formData, setFormData] = useState({
    fieldName: "",
    ownerName: "",
    phone: "",
    workingHours: "",
    location: "",
  });

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (images.length + files.length > 4) {
      setErrorMessage("สามารถใส่รูปได้สูงสุด 4 รูป");
      return;
    }
    setErrorMessage("");
    const newImages = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(newImages).then((results) => {
      setImages((prevImages) => [...prevImages, ...results]);
    });
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const { fieldName, ownerName, phone, workingHours, location } = formData;
    if (!fieldName || !ownerName || !phone || !workingHours || !location || images.length < 1) {
      setFormErrors("กรุณากรอกข้อมูลที่จำเป็น");
      return;
    }
    setFormErrors("");
    alert("ดำเนินการสำเร็จ!");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="form-container099">
      {/* ✅ ส่วนหัวที่ครอบด้วยสีน้ำเงิน พร้อมโลโก้ */}
      <div className="form-header099">
        <div className="header099">
          <img src={logo} alt="MatchWeb Logo" className="logo099" />
          <h1>MatchWeb</h1>
          <p>เพิ่มสนามสำหรับผู้ประกอบการ</p>
        </div>
      </div>

      <div className="form-content099">
        {/* ✅ ส่วนอัปโหลดรูปภาพ */}
        <div className="form-section099 image-section099">
          <div className="image-upload099">
            {images.length < 4 ? (
              <label htmlFor="imageInput">
                <span>เพิ่มรูป {images.length}/4</span>
              </label>
            ) : (
              <span className="complete-message">รูปภาพครบจำนวนแล้ว</span>
            )}
            <input
              type="file"
              id="imageInput"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
          </div>
          <div className="uploaded-images099">
            {images.map((image, index) => (
              <div key={index} className="uploaded-image-container">
                <img
                  src={image}
                  alt={`Uploaded ${index}`}
                  className="uploaded-image099"
                />
                <button
                  className="remove-image-button099"
                  onClick={() => handleRemoveImage(index)}
                >
                  -
                </button>
              </div>
            ))}
          </div>
          {errorMessage && <p className="error-message099">{errorMessage}</p>}
        </div>

        {/* ✅ ส่วนฟอร์มข้อมูลสนาม */}
        <div className="form-section099 field-section099">
          <label>ชื่อสนาม : *</label>
          <input
            type="text"
            name="fieldName"
            value={formData.fieldName}
            onChange={handleInputChange}
            placeholder="ระบุชื่อสนาม"
          />

          <label>เจ้าของ : *</label>
          <input
            type="text"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleInputChange}
            placeholder="ระบุชื่อเจ้าของ"
          />

          <label>เบอร์โทรศัพท์ : *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="ระบุเบอร์โทรศัพท์"
          />

          <label>เวลาทำการ : *</label>
          <input
            type="text"
            name="workingHours"
            value={formData.workingHours}
            onChange={handleInputChange}
            placeholder="ระบุเวลาทำการ"
          />

          <label>ตำแหน่งที่ตั้ง: *</label>
          <textarea
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="ระบุตำแหน่งที่ตั้ง"
          ></textarea>
        </div>

        {/* ✅ ส่วนเพิ่มเติม (สิ่งอำนวยความสะดวก + ข้อมูลเพิ่มเติม) */}
        <div className="form-section099 additional-section099">
          <label>สิ่งอำนวยความสะดวก:</label>
          <div className="checkbox-group099">
            <div>
              <input type="checkbox" id="parking" />
              <label htmlFor="parking">ที่จอดรถ</label>
            </div>
            <div>
              <input type="checkbox" id="wifi" />
              <label htmlFor="wifi">WiFi</label>
            </div>
            <div>
              <input type="checkbox" id="locker" />
              <label htmlFor="locker">ล็อคเกอร์</label>
            </div>
            <div>
              <input type="checkbox" id="shower" />
              <label htmlFor="shower">ห้องอาบน้ำ</label>
            </div>
            <div>
              <input type="checkbox" id="rent" />
              <label htmlFor="rent">อุปกรณ์เช่า</label>
            </div>
            <div>
              <input type="checkbox" id="shop" />
              <label htmlFor="shop">ร้านค้า</label>
            </div>
            <div>
              <input type="checkbox" id="other" />
              <label htmlFor="other">อื่นๆ</label>
            </div>
          </div>

          <label>ข้อมูลสนาม / เงื่อนไขการจอง :</label>
          <textarea
            className="large-textarea099"
            placeholder="ระบุข้อมูลเพิ่มเติม"
          ></textarea>
        </div>
      </div>

      {/* ✅ ฟุตเตอร์ฟอร์ม */}
      <div className="form-footer099">
        {formErrors && <p className="error-message">{formErrors}</p>}
        <button onClick={handleSubmit}>ดำเนินการต่อ</button>
      </div>
    </div>
  );
};

export default MatchWebForm;
