import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Registerarena.css";
import logo from '../assets/logo.png';
import { jwtDecode } from "jwt-decode";
import Mapping from "../Mapping/Mapping"; // ✅ นำเข้า Mapping
import TimePicker from "react-time-picker"; // ✅ นำเข้า Time Picker
import "react-time-picker/dist/TimePicker.css"; // ✅ นำเข้า CSS
import "react-clock/dist/Clock.css"; // ✅ นำเข้า Clock UI

const DEFAULT_LOCATION = [13.736717, 100.523186]; // ✅ ค่าดีฟอลต์ (กรุงเทพฯ)

const MatchWebForm = () => {
  const [images, setImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErrors] = useState("");
  const [mapLocation, setMapLocation] = useState(DEFAULT_LOCATION); // ✅ state ใหม่สำหรับแผนที่

  const [formData, setFormData] = useState({
    fieldName: "",
    ownerName: "",
    phone: "",
    startTime: "",  // ✅ เปลี่ยนจาก workingHours เป็น startTime & endTime
    endTime: "",
    location: DEFAULT_LOCATION,
    businessOwnerId: "",
    additionalInfo: "",
    amenities: []
  });


  const getAmenityLabel = (key) => {
    const labels = {
      ที่จอดรถ: "ที่จอดรถ",
      WiFi: "WiFi",
      ล็อคเกอร์: "ล็อคเกอร์",
      ห้องอาบน้ำ: "ห้องอาบน้ำ",
      อุปกรณ์เช่า: "อุปกรณ์เช่า",
      ร้านค้า: "ร้านค้า",
      อื่นๆ: "อื่นๆ",
    };
    return labels[key] || key;
  };

  // ✅ ดึง Business Owner ID จาก Token หรือ Email ที่ลงทะเบียน
  useEffect(() => {
    const fetchBusinessOwner = async () => {
      try {
        const Token = localStorage.getItem("token") || sessionStorage.getItem("token");
        let userData = {};

        if (Token) {
          userData = jwtDecode(Token);
        } else {
          const registeredEmail = localStorage.getItem("registeredEmail");
          if (registeredEmail) {
            userData.email = registeredEmail;
          }
        }

        if (!userData.id && !userData.email) return;

        const response = await axios.get("http://localhost:4000/api/business/find-owner", {
          params: { id: userData.id, email: userData.email },
        });

        if (response.data && response.data.businessOwnerId) {
          setFormData((prevData) => ({
            ...prevData,
            businessOwnerId: response.data.businessOwnerId,
          }));

          console.log("✅ Business Owner Found:", response.data);
        }
      } catch (error) {
        console.error("🚨 Error fetching BusinessOwner:", error);
      }
    };

    fetchBusinessOwner();
  }, []);

  // ✅ ฟังก์ชันอัปโหลดรูปภาพไป Backend
  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (images.length + files.length > 4) {
      setErrorMessage("สามารถใส่รูปได้สูงสุด 4 รูป");
      return;
    }
    setErrorMessage("");

    const uploadedImages = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await axios.post("http://localhost:4000/api/upload/arena", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        uploadedImages.push(response.data.imageUrl);
      } catch (error) {
        console.error("❌ Upload failed:", error);
        setErrorMessage("เกิดข้อผิดพลาดในการอัปโหลดรูป");
      }
    }
    setImages((prevImages) => [...prevImages, ...uploadedImages]);
  };

  // ✅ ฟังก์ชันลบรูปภาพที่อัปโหลด
  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  // ✅ ฟังก์ชันส่งข้อมูลสนามกีฬาไปที่ Backend
  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    const arenaData = {
      ...formData,
      location: {
        type: "Point",
        coordinates: mapLocation // ✅ เปลี่ยนรูปแบบให้ตรงกับ Schema
      },
      amenities: formData.amenities,
      images,
    };
  
    console.log("📩 Data to be sent:", arenaData);
  
    try {
      const response = await axios.post("http://localhost:4000/api/arenas/register", arenaData);
      alert("✅ ดำเนินการสำเร็จ!");
      resetForm();
    } catch (error) {
      console.error("❌ Register Arena Failed:", error);
      setFormErrors("เกิดข้อผิดพลาดในการส่งข้อมูล");
    }
  };

  // ✅ ฟังก์ชันตรวจสอบว่าฟอร์มถูกต้องก่อนส่ง
  const validateForm = () => {
    const { fieldName, ownerName, phone, startTime, endTime, location, businessOwnerId } = formData;

    if (!fieldName || !ownerName || !phone || !startTime || !endTime || !location || !businessOwnerId || images.length < 1) {
      setFormErrors("กรุณากรอกข้อมูลให้ครบถ้วน");
      return false;
    }
    setFormErrors("");
    return true;
  };

  // ✅ ฟังก์ชัน Reset ฟอร์มหลังจาก Submit สำเร็จ
  const resetForm = () => {
    setFormData({
      fieldName: "",
      ownerName: "",
      phone: "",
      startTime: "",  // ✅ เปลี่ยนจาก workingHours เป็น startTime & endTime
      endTime: "",
      location: DEFAULT_LOCATION,
      businessOwnerId: "",
      additionalInfo: "",
      amenities: []
    });
    setImages([]);
  };

  // ✅ ฟังก์ชันเก็บค่าจาก input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // ✅ ฟังก์ชันสำหรับจัดการการเลือก checkbox
  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      amenities: checked
        ? [...(prevData.amenities || []), id]  // ✅ เพิ่มค่าเข้า array
        : (prevData.amenities || []).filter(item => item !== id) // ✅ ลบออกจาก array
    }));
  };


  // ✅ ฟังก์ชันเก็บค่าข้อมูลเพิ่มเติม
  const handleTextAreaChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      additionalInfo: value
    }));
  };

    // ✅ ฟังก์ชันจัดการการเปลี่ยนตำแหน่งแผนที่
    useEffect(() => {
      setFormData((prevData) => ({
        ...prevData,
        location: {
          type: "Point",
          coordinates: mapLocation // ✅ อัปเดตให้ตรงกับ Schema
        },
      }));
    }, [mapLocation]);
    

      // ✅ ฟังก์ชันจัดการการเปลี่ยนแปลงค่าเวลา
  const handleTimeChange = (time, type) => {
    setFormData((prevData) => ({
      ...prevData,
      [type]: time || "", // ถ้าไม่มีค่าจะให้เป็น "" ป้องกัน undefined
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

          {/* ✅ แสดงภาพที่อัปโหลด */}
          <div className="uploaded-images099">
            {images.map((image, index) => (
              <div key={index} className="uploaded-image-container099">
                <img src={image} alt={`Uploaded ${index}`} className="uploaded-image099" />
                <button className="remove-image-button099" onClick={() => handleRemoveImage(index)}>✖</button>
              </div>
            ))}
          </div>
          {errorMessage && <p className="error-message099">{errorMessage}</p>}
        </div>

        {/* ✅ ส่วนฟอร์มข้อมูลสนาม */}
        <div className="form-section099 field-section099">
          <label>ชื่อสนาม : *</label>
          <input type="text" name="fieldName" value={formData.fieldName} onChange={handleInputChange} placeholder="ระบุชื่อสนาม" />

          <label>เจ้าของ : *</label>
          <input type="text" name="ownerName" value={formData.ownerName} onChange={handleInputChange} placeholder="ระบุชื่อเจ้าของ" />

          <label>เบอร์โทรศัพท์ : *</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="ระบุเบอร์โทรศัพท์" />

          <label>เวลาเปิด-ปิด:</label>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {/* ✅ ช่องเลือกเวลาเริ่มต้น (Start Time) */}
            <TimePicker
              onChange={(time) => setFormData({ ...formData, startTime: time })} // ✅ ใช้ startTime
              value={formData.startTime}
              disableClock={true}
              format="H:mm"
              clearIcon={null}
              className="react-time-picker"
            />
            <span>-</span>
            {/* ✅ ช่องเลือกเวลาสิ้นสุด (End Time) */}
            <TimePicker
              onChange={(time) => setFormData({ ...formData, endTime: time })} // ✅ ใช้ endTime แทน
              value={formData.endTime}
              disableClock={true}
              format="H:mm"
              clearIcon={null}
              className="react-time-picker"
            />
          </div>


          <label>ตำแหน่งที่ตั้ง:
            <span style={{ marginLeft: "10px", fontWeight: "bold", color: "#007bff" }}>
              📍 {mapLocation[0].toFixed(5)}, {mapLocation[1].toFixed(5)}
            </span>
          </label>
          <Mapping location={mapLocation || DEFAULT_LOCATION} setLocation={setMapLocation} />
        </div>

        {/* ✅ ส่วนเพิ่มเติม (สิ่งอำนวยความสะดวก + ข้อมูลเพิ่มเติม) */}
        <div className="form-section099 additional-section099">
          <label>สิ่งอำนวยความสะดวก:</label>
          <div className="checkbox-group099">
            {["parking", "wifi", "locker", "shower", "rent", "shop", "other"].map((amenity) => (
              <div key={amenity}>
                <input
                  type="checkbox"
                  id={amenity}
                  checked={(formData.amenities || []).includes(amenity)} // ✅ ป้องกัน undefined error
                  onChange={handleCheckboxChange}
                />
                <label htmlFor={amenity}>{getAmenityLabel(amenity)}</label>
              </div>
            ))}
          </div>
          <label>ข้อมูลสนาม / เงื่อนไขการจอง :</label>
          <textarea
            className="large-textarea099"
            value={formData.additionalInfo}
            onChange={handleTextAreaChange}
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
