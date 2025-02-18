import React, { useState, useEffect } from 'react';
import './Information.css';
import NavbarRegis from "../NavbarRegis/NavbarRegis"; // นำ NavbarRegis มาใช้ข้างนอก
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom'
const Information = () => {
    const [uploadedImages, setUploadedImages] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const navigate = useNavigate();
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

    const handleImageChange = async (event, type) => {
        const file = event.target.files[0];

        if (file) {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('type', type);

            setImages((prev) => ({
                ...prev,
                [type]: URL.createObjectURL(file),  // แสดงภาพตัวอย่างใน UI
            }));

            setErrors((prev) => ({ ...prev, [type]: '' }));

            try {
                const response = await axios.post('http://localhost:4000/api/upload/images', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                console.log(`✅ Uploaded ${type}:`, response.data.imageUrl);

                // บันทึก URL ลงใน uploadedImages โดยอัปเดตหรือเพิ่มข้อมูลใหม่
                setUploadedImages((prev) => {
                    const updatedImages = prev.filter(img => img.type !== type);
                    return [...updatedImages, { type, url: response.data.imageUrl }];
                });

            } catch (error) {
                console.error('❌ Upload failed:', error);
                setErrorMessage('เกิดข้อผิดพลาดในการอัปโหลดรูป');
            }
        }
    };





    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' })); // ✅ ล้าง error เมื่อมีการกรอกข้อมูล
    };

    const validateForm = () => {
        let newErrors = {};

        if (!images.registration) newErrors.registration = 'กรุณาอัปโหลดรูปหนังสือจดทะเบียน';
        if (!images.idCard) newErrors.idCard = 'กรุณาอัปโหลดรูปบัตรประชาชน';
        if (!images.idHolder) newErrors.idHolder = 'กรุณาอัปโหลดรูปผู้ถือบัตรประชาชน';
        if (!images.qrCode) newErrors.qrCode = 'กรุณาอัปโหลดรูป QR Code';
        if (!formData.accountName || !formData.bank || !formData.accountNumber) newErrors.dataTransfer = 'กรุณากรอกข้อมูลให้ครบถ้วน';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;  // คืนค่า true ถ้าไม่มี error
    };


    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                const Token = localStorage.getItem("token") || sessionStorage.getItem("token");
                const userData = Token ? jwtDecode(Token) : {};

                const getImageUrl = (type) => {
                    const imageObj = uploadedImages.find(img => img.type === type);
                    return imageObj ? imageObj.url : null;
                };

                const submissionData = {
                    accountName: formData.accountName,
                    bank: formData.bank,
                    accountNumber: formData.accountNumber,
                    businessOwnerId: formData.businessOwnerId || userData.id,
                    images: {
                        registration: getImageUrl('registration'),
                        idCard: getImageUrl('idCard'),
                        idHolder: getImageUrl('idHolder'),
                        qrCode: getImageUrl('qrCode'),
                    }
                };

                console.log('🔎 Submitting Data:', submissionData);

                if (!submissionData.images.registration || !submissionData.images.idCard ||
                    !submissionData.images.idHolder || !submissionData.images.qrCode) {
                    setErrorMessage('กรุณาอัปโหลดรูปภาพให้ครบถ้วน');
                    return;
                }

                const response = await axios.post('http://localhost:4000/api/business-info/submit', submissionData);
                alert(`✅ ${response.data.message}`);

                // รีเซตฟอร์ม
                setFormData({
                    accountName: '',
                    bank: '',
                    accountNumber: ''
                });

                setImages({
                    registration: null,
                    idCard: null,
                    idHolder: null,
                    qrCode: null
                });

                setUploadedImages([]);
                setErrors({});
                setErrorMessage('');
                navigate("/SuccessRegis");
            } catch (error) {
                console.error('❌ Submission failed:', error.response ? error.response.data : error.message);
                if (error.response && error.response.status === 400) {
                    alert(error.response.data.message); // << ใช้ alert ตรงนี้ได้!
                } else {
                    setErrorMessage('เกิดข้อผิดพลาดในการส่งข้อมูล');
                }
            }
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

                    <input type="text" name="accountName" placeholder="ชื่อบัญชี" className="information-input" value={formData.accountName} onChange={handleInputChange} />
                    <input type="text" name="bank" placeholder="ธนาคาร" className="information-input" value={formData.bank} onChange={handleInputChange} />
                    <input type="text" name="accountNumber" placeholder="เลขบัญชี" className="information-input" value={formData.accountNumber} onChange={handleInputChange} />


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
