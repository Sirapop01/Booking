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

    const handleImageChange = (event, type) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages(prev => ({ ...prev, [type]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="information-container">
            <div className="information-section">
                <div className="information-box">
                    <p className="information-label">รูปถ่ายหนังสือจดทะเบียน *</p>
                    <div className="information-upload large-box">
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
                <div className="information-box">
                    <p className="information-label">รูปถ่ายบัตรประชาชน *</p>
                    <div className="information-upload medium-box">
                        <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'idCard')} className="file-input" id="idCard-upload" />
                        <label htmlFor="idCard-upload" className="upload-label">
                            {images.idCard ? (
                                <img src={images.idCard} alt="ID Card" className="uploaded-image" />
                            ) : (
                                <span className="information-add">+</span>
                            )}
                        </label>
                    </div>
                    <p className="information-label">รูปถ่ายของผู้ถือบัตรประชาชน *</p>
                    <div className="information-upload medium-box">
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
                <div className="information-box">
                    <p className="information-label">ข้อมูลการโอนเงิน *</p>
                    <p className="information-label">รูป Qr Code : *</p>
                    <div className="information-upload medium-box">
                        <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'qrCode')} className="file-input" id="qrCode-upload" />
                        <label htmlFor="qrCode-upload" className="upload-label">
                            {images.qrCode ? (
                                <img src={images.qrCode} alt="QR Code" className="uploaded-image" />
                            ) : (
                                <span className="information-add">+</span>
                            )}
                        </label>
                    </div>
                    <input type="text" placeholder="ชื่อบัญชี" className="information-input" />
                    <input type="text" placeholder="ธนาคาร" className="information-input" />
                    <input type="text" placeholder="เลขบัญชี" className="information-input" />
                </div>
            </div>
            <div className="information-buttons">
                <button className="information-cancel">ยกเลิก</button>
                <button className="information-next">ต่อไป</button>
            </div>
        </div>
    );
};

// นำ NavbarRegis ออกมานอก Information และใช้ร่วมกัน
const InformationPage = () => {
    return (
        <>
            <NavbarRegis />
            <Information />
        </>
    );
};

export default InformationPage;
