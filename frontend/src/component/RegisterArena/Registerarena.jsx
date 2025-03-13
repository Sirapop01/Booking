import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Registerarena.css";
import logo from '../assets/logo.png';
import { jwtDecode } from "jwt-decode";
import Mapping from "../Mapping/Mapping"; // ✅ นำเข้า Mapping
import TimePicker from "react-time-picker"; // ✅ นำเข้า Time Picker
import "react-time-picker/dist/TimePicker.css"; // ✅ นำเข้า CSS
import "react-clock/dist/Clock.css"; // ✅ นำเข้า Clock UI
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom"; // ✅ เพิ่มบรรทัดนี้
import Swal from "sweetalert2";
import background from "../assets/Blackground/Yahoo.png";

const DEFAULT_LOCATION = [13.736717, 100.523186]; // ✅ ค่าดีฟอลต์ (กรุงเทพฯ)


const MatchWebForm = () => {
  const [images, setImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [formErrors, setFormErrors] = useState('');
  const [mapLocation, setMapLocation] = useState(DEFAULT_LOCATION);
  const navigate = useNavigate();
  const { arenaId } = useParams();
  console.log("🧐 Retrieved arenaId from useParams():", arenaId);

  const [formData, setFormData] = useState({
    fieldName: '',
    ownerName: '',
    phone: '',
    startTime: '',
    endTime: '',
    location: DEFAULT_LOCATION,
    businessOwnerId: '',
    additionalInfo: '',
    amenities: [],
  });

  const getAmenityLabel = (key) => {
    const labels = {
      ที่จอดรถ: 'ที่จอดรถ',
      WiFi: 'WiFi',
      ล็อคเกอร์: 'ล็อคเกอร์',
      ห้องอาบน้ำ: 'ห้องอาบน้ำ',
      อุปกรณ์เช่า: 'อุปกรณ์เช่า',
      ร้านค้า: 'ร้านค้า',
      อื่นๆ: 'อื่นๆ',
    };
    return labels[key] || key;
  };

  useEffect(() => {
    console.log("🔥 useEffect Triggered! arenaId:", arenaId);

    const fetchData = async () => {
      try {
        const Token = localStorage.getItem('token') || sessionStorage.getItem('token');
        let userData = {};

        if (Token) {
          userData = jwtDecode(Token);
        } else {
          const registeredEmail = localStorage.getItem('registeredEmail');
          if (registeredEmail) {
            userData.email = registeredEmail;
          }
        }

        if (!userData.id && !userData.email) return;

        // ✅ โหลดข้อมูล Business Owner
        const businessOwnerResponse = await axios.get('http://localhost:4000/api/business/find-owner', {
          params: { id: userData.id, email: userData.email },
        });

        let ownerId = businessOwnerResponse.data?.businessOwnerId || "";
        console.log("📌 Fetched businessOwnerId:", ownerId);

        // ✅ ถ้าไม่มี arenaId ให้ตั้ง businessOwnerId ทันที (กรณีเพิ่มสนามใหม่)
        if (!arenaId) {
          setFormData((prevData) => ({
            ...prevData,
            businessOwnerId: ownerId,
          }));
          return;
        }

        // ✅ ถ้ามี arenaId → โหลดข้อมูลสนาม
        const arenaResponse = await axios.get(`http://localhost:4000/api/arena-manage/getArenaById/${arenaId}`);

        if (arenaResponse.data) {
          const arena = arenaResponse.data;
          let arenaCoordinates = arena.location?.coordinates || DEFAULT_LOCATION;

          if (!Array.isArray(arenaCoordinates) || arenaCoordinates.length !== 2) {
            console.error("❌ พิกัดสนามไม่ถูกต้อง:", arenaCoordinates);
            arenaCoordinates = DEFAULT_LOCATION;
          }

          console.log("📍 Loaded Arena Coordinates:", arenaCoordinates); // ✅ Debugging
          setFormData((prevData) => ({
            ...prevData,
            fieldName: arena.fieldName || '',
            ownerName: arena.ownerName || '',
            phone: arena.phone || '',
            startTime: arena.startTime || '',
            endTime: arena.endTime || '',
            location: arena.location?.coordinates || DEFAULT_LOCATION,
            businessOwnerId: arena.businessOwnerId || ownerId, // ✅ ใช้ ownerId ที่โหลดมา
            additionalInfo: arena.additionalInfo || '',
            amenities: arena.amenities || [],
          }));
          setMapLocation([arenaCoordinates[1], arenaCoordinates[0]]); // ✅ อัปเดตแผนที่ให้ตรง
        }

      } catch (error) {
        console.error('🚨 Error fetching data:', error);
      }
    };

    fetchData();
  }, [arenaId]); // ✅ โหลดใหม่เมื่อ arenaId เปลี่ยน




  // ✅ ฟังก์ชันเลือกไฟล์ -> เก็บไฟล์ไว้ใน state
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (images.length + files.length > 4) {
      setErrorMessage('สามารถใส่รูปได้สูงสุด 4 รูป');
      return;
    }
    setErrorMessage('');
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const fetchArenaData = async () => {
    try {
      console.log("🔄 Fetching arena data...");
      const response = await axios.get(`http://localhost:4000/api/arena-manage/getArenaById/${arenaId}`);

      if (response.data) {
        console.log("📢 Fetching Arena Data:", response.data);
        setFormData({
          fieldName: response.data.fieldName || '',
          ownerName: response.data.ownerName || '',
          phone: response.data.phone || '',
          startTime: response.data.startTime || '',
          endTime: response.data.endTime || '',
          location: response.data.location?.coordinates || DEFAULT_LOCATION,
          businessOwnerId: response.data.businessOwnerId || '',
          additionalInfo: response.data.additionalInfo || '',
          amenities: response.data.amenities || [],
        });

        setMapLocation(response.data.location?.coordinates || DEFAULT_LOCATION);
        setImages(response.data.images || []);
      }
    } catch (error) {
      console.error("❌ Error fetching updated data:", error);
    }
  };



  const handleSubmit = async () => {
    if (!validateForm()) return;

    Swal.fire({
      title: "กำลังอัปโหลด...",
      text: "กรุณารอสักครู่",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    console.log("📤 Form Data before submit:", formData);

    const submitFormData = new FormData();
    submitFormData.append("fieldName", formData.fieldName);
    submitFormData.append("ownerName", formData.ownerName);
    submitFormData.append("phone", formData.phone);
    submitFormData.append("startTime", formData.startTime);
    submitFormData.append("endTime", formData.endTime);
    submitFormData.append("businessOwnerId", formData.businessOwnerId);

    let formattedLocation = JSON.stringify({
      type: "Point",
      coordinates: [parseFloat(mapLocation[1]), parseFloat(mapLocation[0])],
    });

    submitFormData.append("location", formattedLocation);
    submitFormData.append("additionalInfo", formData.additionalInfo);
    submitFormData.append("amenities", JSON.stringify(formData.amenities));

    for (const file of images) {
      submitFormData.append("images", file);
    }

    try {
      let response;

      if (arenaId) {
        console.log("🛠 Updating Arena...");
        response = await axios.put(`http://localhost:4000/api/arena-manage/updateArena/${arenaId}`, submitFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("✅ Arena Updated:", response.data);

        // ✅ แสดง Alert สวยๆ แล้ว Reload หน้า
        Swal.fire({
          title: "🎉 อัปเดตข้อมูลสำเร็จ!",
          text: "ข้อมูลสนามได้รับการอัปเดตเรียบร้อย",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "ตกลง",
        }).then(() => {
          window.location.reload(); // ✅ รีโหลดหน้า
        });

      } else {
        console.log("➕ Creating New Arena...");
        response = await axios.post("http://localhost:4000/api/arenas/registerArena", submitFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("✅ Arena Created:", response.data);

        // ✅ แสดง Alert สวยๆ แล้วไปหน้า Information
        Swal.fire({
        title: "✅ เพิ่มสนามสำเร็จ!",
        text: "สนามของคุณถูกเพิ่มเรียบร้อยแล้ว",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "ไปที่หน้าข้อมูล",
      }).then(() => {
        navigate(`/Information?arenaId=${response.data.arena._id}`); // ✅ ส่ง arenaId ไปยัง Information
      });
     }
      
    } catch (error) {
      console.error("❌ Register Arena Failed:", error);

      // ✅ Alert แจ้งเตือนเมื่อมีข้อผิดพลาด
      Swal.fire({
        title: "❌ เกิดข้อผิดพลาด",
        text: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "ตกลง",
      });
      setFormErrors("เกิดข้อผิดพลาดในการส่งข้อมูล");
    }
  };




  useEffect(() => {
    if (arenaId) {
      console.log("🟢 Fetching arena data in useEffect...");
      fetchArenaData();
    }
  }, [arenaId]); // ✅ โหลดใหม่เมื่อ `arenaId` เปลี่ยนเท่านั้น

  const validateForm = () => {
    const { fieldName, ownerName, phone, startTime, endTime, location, businessOwnerId } = formData;
    if (!fieldName || !ownerName || !phone || !startTime || !endTime || !location || !businessOwnerId || images.length < 1) {
      setFormErrors('กรุณากรอกข้อมูลให้ครบถ้วน');
      return false;
    }
    setFormErrors('');
    return true;
  };

  const resetForm = () => {
    setFormData({
      fieldName: formData.fieldName || '',
      ownerName: formData.ownerName || '',
      phone: formData.phone || '',
      startTime: formData.startTime || '',
      endTime: formData.endTime || '',
      location: formData.location || DEFAULT_LOCATION,
      businessOwnerId: formData.businessOwnerId || '',
      additionalInfo: formData.additionalInfo || '',
      amenities: formData.amenities || [],
    });
    setImages([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      amenities: checked ? [...prevData.amenities, id] : prevData.amenities.filter((item) => item !== id),
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

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      location: {
        type: 'Point',
        coordinates: mapLocation,
      },
    }));
  }, [mapLocation]);

  return (
    <>
      {/* ✅ ส่วนหัวที่ครอบด้วยสีน้ำเงิน พร้อมโลโก้ */}
      <div className="form-header099">
        <div className="header099">
          <img src={logo} alt="MatchWeb Logo" className="logo099" />
          <h1 className="header-title">{arenaId ? "แก้ไขสนาม" : "เพิ่มสนามสำหรับผู้ประกอบการ"}</h1>
        </div>
      </div>

      {/* ✅ คอนเทนต์ของฟอร์ม */}
      <div className="containerRe" style={{ backgroundImage: `url(${background})` }}>
        <div className="form-container099">
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
                    <img
                      src={typeof image === "string" ? image : URL.createObjectURL(image)}
                      alt={`Uploaded ${index}`}
                      className="uploaded-image099"
                    />
                    <button className="remove-image-button099" onClick={() => handleRemoveImage(index)}>
                      ✖
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
                inputMode="numeric"
                maxLength="10"
                onChange={handleInputChange}
                placeholder="ระบุเบอร์โทรศัพท์"
              />

              <label>เวลาเปิด-ปิด:</label>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                {/* ✅ ช่องเลือกเวลาเริ่มต้น (Start Time) */}
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
                  className="time-input"
                />
                <span>-</span>
                {/* ✅ ช่องเลือกเวลาสิ้นสุด (End Time) */}
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
                  className="time-input"
                />
              </div>

              <label>ตำแหน่งที่ตั้ง:</label>
              <span style={{ marginLeft: "10px", fontWeight: "bold", color: "#007bff" }}>
                📍 {mapLocation[0]?.toFixed(5)}, {mapLocation[1]?.toFixed(5)}
              </span>
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
                      checked={formData.amenities ? formData.amenities.includes(amenity) : false}
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
            <button onClick={handleSubmit}>
              {arenaId ? "บันทึกการแก้ไข" : "ดำเนินการต่อ"}
            </button>
          </div>
        </div>
      </div>
    </>
  );



};

export default MatchWebForm;
