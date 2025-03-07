import React, { useState, useEffect } from 'react';
import './Information.css';
import NavbarRegis from "../NavbarRegis/NavbarRegis"; // นำ NavbarRegis มาใช้ข้างนอก
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom'



const Information = () => {
    const [uploadedImages, setUploadedImages] = useState({});
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
        accountNumber: '',
        businessOwnerId: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchBusinessOwner = async () => {
            try {
                const Token = localStorage.getItem("token") || sessionStorage.getItem("token");
                if (!Token) {
                    console.error("❌ No Token Found");
                    return;
                }
    
                const userData = jwtDecode(Token);
                if (!userData.id) {
                    console.error("❌ Missing user ID in Token");
                    return;
                }
    
                const response = await axios.get("http://localhost:4000/api/business/find-owner", {
                    params: { id: userData.id },
                });
    
                if (response.data && response.data.businessOwnerId) {
                    setFormData(prevData => ({
                        ...prevData,
                        businessOwnerId: response.data.businessOwnerId,
                    }));
                    console.log("✅ Business Owner Found:", response.data.businessOwnerId);
                } else {
                    console.error("❌ Business Owner ID Not Found in Response");
                }
            } catch (error) {
                console.error("🚨 Error fetching BusinessOwner:", error.response?.data || error.message);
            }
        };
    
        fetchBusinessOwner();
    }, []);
    

    const handleImageChange = async (event, type) => {
        const file = event.target.files[0];
    
        if (file) {
            setImages(prev => ({ ...prev, [type]: URL.createObjectURL(file) }));
            setErrors(prev => ({ ...prev, [type]: '' }));
    
            const formData = new FormData();
            formData.append('image', file);
            formData.append('folder', 'business-info');
    
            setIsUploading(true); // ✅ เริ่มอัปโหลด
    
            try {
                const response = await axios.post('http://localhost:4000/api/upload/single', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
    
                setUploadedImages(prev => {
                    const updated = { ...prev, [type]: response.data.imageUrl };
                    setErrors(errors => ({ ...errors, [type]: '' })); // ✅ เคลียร์ error
                    return updated;
                });
    
                console.log(`✅ Uploaded ${type}:`, response.data.imageUrl);
            } catch (error) {
                console.error(`❌ Upload ${type} failed:`, error);
                setErrorMessage('เกิดข้อผิดพลาดในการอัปโหลดรูป');
            } finally {
                setIsUploading(false); // ✅ จบการอัปโหลด
            }
        }
    };
    

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        let newErrors = {};
        ['registration', 'idCard', 'idHolder', 'qrCode'].forEach(type => {
            if (!uploadedImages[type]) newErrors[type] = `กรุณาอัปโหลดรูป ${type}`;
        });

        if (!formData.accountName || !formData.bank || !formData.accountNumber) {
            newErrors.dataTransfer = 'กรุณากรอกข้อมูลให้ครบถ้วน';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (isUploading) {
            alert('กรุณารอให้อัปโหลดรูปภาพเสร็จก่อน');
            return;
        }
    
        if (!validateForm()) return;
    
        try {
            const submissionData = {
                ...formData,
                images: uploadedImages
            };
    
            const response = await axios.post('http://localhost:4000/api/business-info-requests/submit', submissionData);
            alert(`✅ ${response.data.message}`);
            navigate("/SuccessRegis");
        } catch (error) {
            console.error('❌ Submission failed:', error);
            setErrorMessage('เกิดข้อผิดพลาดในการส่งข้อมูล');
        }
    };
    

    return (
        <div className = "information-background">
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
