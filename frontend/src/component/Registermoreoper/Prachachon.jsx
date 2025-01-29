import React, { useState } from "react";
import "./Prachachon.css";

const Pracha = () => {
  const [images, setImages] = useState({
    registration: null,
    idCard: null,
    idCardWithPerson: null,
    qrCode: null,
  });
  const [formErrors, setFormErrors] = useState("");

  const [formData, setFormData] = useState({
    accountName: "",
    bankName: "",
    accountNumber: "",
  });

  const handleImageUpload = (event, field) => {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImages((prevImages) => ({
        ...prevImages,
        [field]: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const { accountName, bankName, accountNumber } = formData;

    if (
      !images.registration ||
      !images.idCard ||
      !images.idCardWithPerson ||
      !images.qrCode ||
      !accountName ||
      !bankName ||
      !accountNumber
    ) {
      setFormErrors("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setFormErrors(""); // ล้างข้อความข้อผิดพลาด
    alert("ข้อมูลถูกส่งเรียบร้อยแล้ว!");
  };

  return (
    <div className="form-container">
      <header className="header">
        <h1>MatchWeb</h1>
        <p>เพิ่มสนาม สำหรับผู้ประกอบการ</p>
      </header>

      <div className="form-content">
        <div className="form-section">
          <h3>รูปถ่ายหนังสือจดทะเบียน</h3>
          <div className="image-upload">
            <label htmlFor="registration">
              {images.registration ? (
                <img
                  src={images.registration}
                  alt="Registration"
                  className="uploaded-image"
                />
              ) : (
                <span>+</span>
              )}
            </label>
            <input
              type="file"
              id="registration"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "registration")}
              style={{ display: "none" }}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>รูปถ่ายบัตรประชาชน</h3>
          <div>
            <label className="upload-label">รูปถ่ายบัตรประชาชน : *</label>
            <div className="image-upload">
              <label htmlFor="idCard">
                {images.idCard ? (
                  <img
                    src={images.idCard}
                    alt="ID Card"
                    className="uploaded-image"
                  />
                ) : (
                  <span>+</span>
                )}
              </label>
              <input
                type="file"
                id="idCard"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "idCard")}
                style={{ display: "none" }}
              />
            </div>
          </div>
          <div>
            <label className="upload-label">
              รูปถ่ายตัวเองคู่กับบัตรประชาชน : *
            </label>
            <div className="image-upload">
              <label htmlFor="idCardWithPerson">
                {images.idCardWithPerson ? (
                  <img
                    src={images.idCardWithPerson}
                    alt="ID Card with Person"
                    className="uploaded-image"
                  />
                ) : (
                  <span>+</span>
                )}
              </label>
              <input
                type="file"
                id="idCardWithPerson"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "idCardWithPerson")}
                style={{ display: "none" }}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>ข้อมูลการโอนเงิน</h3>
          <label className="upload-label">รูป QR Code หรือ Promptpay : *</label>
          <div className="image-upload">
            <label htmlFor="qrCode">
              {images.qrCode ? (
                <img src={images.qrCode} alt="QR Code" className="uploaded-image" />
              ) : (
                <span>+</span>
              )}
            </label>
            <input
              type="file"
              id="qrCode"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "qrCode")}
              style={{ display: "none" }}
            />
          </div>
          <label className="upload-label">ชื่อบัญชี : *</label>
          <input
            type="text"
            name="accountName"
            value={formData.accountName}
            onChange={handleInputChange}
            placeholder="ชื่อบัญชี"
          />
          <label className="upload-label">ธนาคาร : *</label>
          <input
            type="text"
            name="bankName"
            value={formData.bankName}
            onChange={handleInputChange}
            placeholder="ธนาคาร *"
          />
          <label className="upload-label">เลขบัญชี : *</label>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleInputChange}
            placeholder="เลขบัญชี"
          />
        </div>
      </div>

      <div className="form-footer">
        {formErrors && <p className="error-message">{formErrors}</p>}
        <button onClick={handleSubmit}>ยืนยันการลงทะเบียน</button>
      </div>
    </div>
  );
};

export default Pracha;
