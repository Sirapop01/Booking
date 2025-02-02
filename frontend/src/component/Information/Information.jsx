import React, { useState } from 'react';
import './Information.css';
import logo from '../assets/logo.png';

const Navbar = () => {
    return (
        <nav className="information-navbar">
            <div className="information-navbar-content">
                <img src={logo} alt="Logo" className="information-logo" />
                <h1 className="information-title">เพิ่มสนามใหม่</h1>
            </div>
        </nav>
    );
};

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
        <div className="information-wrapper">
            <Navbar />
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
                                    <button className="information-add">+</button>
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
                                    <button className="information-add">+</button>
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
                                    <button className="information-add">+</button>
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
                                    <button className="information-add">+</button>
                                )}
                            </label>
                        </div>
                        <input type="text" placeholder="ชื่อบัญชี" className="information-input" />
                        <input type="text" placeholder="ธนาคาร" className="information-input" />
                        <input type="text" placeholder="เลขบัญชี" className="information-input" />
                    </div>
                </div>
                <div className="information-buttons">
                    <button className="information-next">ต่อไป</button>
                    <button className="information-cancel">ยกเลิก</button>
                </div>
            </div>
        </div>
    );
};

export default Information;
