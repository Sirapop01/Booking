import React, { useState } from 'react';
import './Information.css';
import NavbarRegis from "../NavbarRegis/NavbarRegis"; // นำ NavbarRegis มาใช้ข้างนอก

const Information = () => {
    const [images, setImages] = useState({
        registration: null,
        idCard: null,
        idHolder: null,
        qrCode: null
    });

    const [formData, setFormData] = useState({
        accountName: '',
        bank: '',
        accountNumber: ''
    });

    const [errors, setErrors] = useState({}); // ✅ State สำหรับเก็บข้อความ error

    const handleImageChange = (event, type) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages(prev => ({ ...prev, [type]: reader.result }));
                setErrors(prev => ({ ...prev, [type]: '' })); // ✅ ล้าง error เมื่ออัปโหลดรูป
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' })); // ✅ ล้าง error เมื่อมีการกรอกข้อมูล
    };

    const validateForm = () => {
        let newErrors = {};

        if (!images.registration) newErrors.registration = 'กรุณาอัปโหลดรูป';
        if (!images.idCard) newErrors.idCard = 'กรุณาอัปโหลดรูป';
        if (!images.idHolder) newErrors.idHolder = 'กรุณาอัปโหลดรูป';
        if (!formData.accountName || !formData.bank || !formData.accountNumber) newErrors.dataTransfer = 'กรุณากรอกข้อมูลให้ครบ';
        if (!images.qrCode) newErrors.qrCode = 'กรุณาอัปโหลดรูป';

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0; // ✅ ถ้าไม่มี error return true
    };

    const handleSubmit = () => {
        if (validateForm()) {
            alert("✅ ส่งข้อมูลสำเร็จ!");
        }
    };

    return (
        <div className="information-container">
            <div className="information-section">
                {/* 🔹 รูปถ่ายหนังสือจดทะเบียน */}
                <div className="information-box">
                    <p className="information-label">
                        รูปถ่ายหนังสือจดทะเบียน *
                        {errors.registration && <span className="error-message-information"> {errors.registration}</span>}
                    </p>
                    <div className="information-upload large-upload">
                        <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'registration')} className="file-input" id="registration-upload" />
                        <label htmlFor="registration-upload" className="upload-label">
                            {images.registration ? (
                                <img src={images.registration} alt="Registration" className="uploaded-image" />
                            ) : (
                                <span className="information-add">+</span>
                            )}
                        </label>
                    </div>
                </div>

                {/* 🔹 รูปถ่ายบัตรประชาชน */}
                <div className="information-box">
                    <p className="information-label">
                        รูปถ่ายบัตรประชาชน *
                        {errors.idCard && <span className="error-message-information"> {errors.idCard}</span>}
                    </p>
                    <div className="information-upload">
                        <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'idCard')} className="file-input" id="idCard-upload" />
                        <label htmlFor="idCard-upload" className="upload-label">
                            {images.idCard ? (
                                <img src={images.idCard} alt="ID Card" className="uploaded-image" />
                            ) : (
                                <span className="information-add">+</span>
                            )}
                        </label>
                    </div>

                    <p className="information-label">
                        รูปถ่ายของผู้ถือบัตรประชาชน *
                        {errors.idHolder && <span className="error-message-information"> {errors.idHolder}</span>}
                    </p>
                    <div className="information-upload">
                        <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'idHolder')} className="file-input" id="idHolder-upload" />
                        <label htmlFor="idHolder-upload" className="upload-label">
                            {images.idHolder ? (
                                <img src={images.idHolder} alt="ID Holder" className="uploaded-image" />
                            ) : (
                                <span className="information-add">+</span>
                            )}
                        </label>
                    </div>
                </div>

                {/* 🔹 ข้อมูลการโอนเงิน */}
                <div className="information-box">
                    <p className="information-label">
                        ข้อมูลการโอนเงิน *
                        {errors.dataTransfer && <span className="error-message-information"> {errors.dataTransfer}</span>}
                    </p>

                    <p className="information-label">
                        รูป Qr Code : *
                        {errors.qrCode && <span className="error-message-information"> {errors.qrCode}</span>}
                    </p>
                    <div className="information-upload">
                        <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'qrCode')} className="file-input" id="qrCode-upload" />
                        <label htmlFor="qrCode-upload" className="upload-label">
                            {images.qrCode ? (
                                <img src={images.qrCode} alt="QR Code" className="uploaded-image" />
                            ) : (
                                <span className="information-add">+</span>
                            )}
                        </label>
                    </div>

                    <input type="text" name="accountName" placeholder="ชื่อบัญชี" className="information-input" onChange={handleInputChange} />
                    <input type="text" name="bank" placeholder="ธนาคาร" className="information-input" onChange={handleInputChange} />
                    <input type="text" name="accountNumber" placeholder="เลขบัญชี" className="information-input" onChange={handleInputChange} />
                </div>
            </div>

            <div className="information-buttons">
                <button className="information-cancel">ยกเลิก</button>
                <button className="information-next" onClick={handleSubmit}>ต่อไป</button>
            </div>
        </div>
    );
};

const InformationPage = () => {
    return (
        <>
            <NavbarRegis />
            <Information />
        </>
    );
};

export default InformationPage;
