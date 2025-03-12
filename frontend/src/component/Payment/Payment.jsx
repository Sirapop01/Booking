import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // ✅ นำเข้า SweetAlert2
import "./Payment.css";
import { useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom";
const Payment = () => {
    const [paymentData, setPaymentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [transferTime, setTransferTime] = useState("");
    const [amount, setAmount] = useState("");
    const [slipImage, setSlipImage] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const bookingData = location.state?.bookingData || null;

    useEffect(() => {
        const fetchPaymentDetails = async () => {
            try {
                const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
                console.log("📌 Token ที่ถูกดึงมา:", token);
                if (!token) {
                    console.log("❌ No token found in storage");
                    return;
                }
    
                let sessionId = bookingData?.sessionId;
                console.log("📌 sessionId ที่ส่งไป Backend:", sessionId);
    
                const response = await axios.get(
                    `http://localhost:4000/api/payments/pending?sessionId=${sessionId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
    
                console.log("✅ ข้อมูลที่ได้รับจาก API:", response.data);
                setPaymentData(response.data);
    
            } catch (error) {
                console.error("❌ Error fetching payment details:", error);
                if (error.response) {
                    console.error("❌ API Response Status:", error.response.status);
                    console.error("❌ API Response Data:", error.response.data);
                }
            } finally {
                setLoading(false);
            }
        };
    
        fetchPaymentDetails();
    }, [bookingData]);

    

    const handlePaymentSubmit = async () => {
        if (!transferTime || !amount || !slipImage) {
            Swal.fire({
                icon: "warning",
                title: "⚠️ ข้อมูลไม่ครบ!",
                text: "กรุณากรอกข้อมูลให้ครบถ้วนก่อนกดยืนยัน",
            });
            return;
        }

        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
            Swal.fire({
                icon: "error",
                title: "❌ กรุณาเข้าสู่ระบบ",
                text: "โปรดเข้าสู่ระบบก่อนทำการชำระเงิน",
            });
            return;
        }

        const formData = new FormData();
        formData.append("sessionId", paymentData.booking.sessionId);
        formData.append("amount", amount);
        formData.append("transferTime", transferTime);
        formData.append("slipImage", slipImage);

        try {
            const response = await axios.post("http://localhost:4000/api/payments/submit", formData, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
            });

            console.log("✅ Payment Success:", response.data);

            Swal.fire({
                icon: "success",
                title: "✅ บันทึกข้อมูลสำเร็จ!",
                text: "ข้อมูลการชำระเงินถูกบันทึกเรียบร้อย",
                confirmButtonText: "ตกลง",
            }).then(() => {
                navigate("/historybooking") // ✅ รีโหลดหน้าใหม่
            });

        } catch (error) {
            console.error("❌ Payment Error:", error);
            Swal.fire({
                icon: "error",
                title: "❌ เกิดข้อผิดพลาด!",
                text: "ไม่สามารถบันทึกการชำระเงินได้ กรุณาลองใหม่",
            });
        }
    };

    if (loading) {
        return <p>กำลังโหลดข้อมูล...</p>;
    }

    if (!paymentData) {
        return <p>❌ ไม่พบข้อมูลการจอง</p>;
    }

    const { arenaInfo, booking, stadiumInfo, bankInfo } = paymentData;
    return (
        <div className="payment-container">
            <div className="payment-top">
                <div className="image-top">
                <div className="arena-details">
                    <img src={arenaInfo?.images?.[0] || "https://via.placeholder.com/150"} alt="สนามกีฬา" className="arena-image" />
                </div>
                </div>
                <div className="info-top">
                    <div className="arena-details">
                        <h2>เลขที่การจอง #{booking?.sessionId || "N/A"}</h2>
                        <p>📍 สนามกีฬา: {arenaInfo?.fieldName || "ไม่พบข้อมูลสนาม"}</p>
                        <p>📍 สนามย่อยที่จอง: {bookingData?.details?.map((detail) => detail.name).join(", ") || "ไม่พบข้อมูลสนามย่อย"}</p>
                        <p>📅 วันที่: {new Date(paymentData?.details?.[0]?.bookingDate || new Date()).toLocaleDateString()}</p>
                        <p>🕒 เวลาที่จอง: </p>
                        <ul>
                            {bookingData?.details?.map((detail, index) => (
                                <li key={index}>
                                    {detail.name} : {detail.startTime} - {detail.endTime} ({detail.duration} ชั่วโมง)
                                </li>
                            ))}
                        </ul>
                        <p className="price">💰 ฿{booking?.totalPrice ?? "N/A"}</p>
                    </div>
                </div>
            </div>

            <div className="payment-bottom">
                <div className="qr-section">
                    <h3>ช่องทางการชำระเงิน</h3>
                    <img src={bankInfo?.images.qrCode} alt="QR Code" className="qr-code" />
                </div>

                <div className="bank-info">
                    <h3>ข้อมูลธนาคาร</h3>
                    <p>🏦 ธนาคาร: <strong>{bankInfo?.bank || "ไม่พบข้อมูล"}</strong></p>
                    <p>💳 เลขบัญชี: <strong>{bankInfo?.accountNumber || "N/A"}</strong></p>
                    <p>👤 ชื่อบัญชี: {bankInfo?.accountName || "ไม่พบข้อมูล"}</p>
                    <p className="payment-timer">⏳ ชำระเงินภายใน {new Date(booking?.expiresAt || new Date()).toLocaleTimeString()}</p>
                </div>

                <div className="slip-upload">
                    <h3>อัปโหลดหลักฐานการโอน</h3>
                    <label>⏳ เวลาที่โอนเงิน</label>
                    <input
                        type="time"
                        value={transferTime}
                        onChange={(e) => setTransferTime(e.target.value)}
                    />

                    <label>💰 จำนวนเงิน</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="จำนวนเงินที่โอน"
                    />

                    <label>📎 อัปโหลดสลิปโอนเงิน</label>
                    <input type="file" accept="image/*" onChange={(e) => setSlipImage(e.target.files[0])} />
                </div>

                <div className="payment-actions">
                    <button className="confirm-payment" onClick={handlePaymentSubmit}>ตรวจสอบการโอน</button>
                    <button className="cancel-booking">ยกเลิกการจอง</button>
                </div>
            </div>
        </div>
    );
};

export default Payment;
