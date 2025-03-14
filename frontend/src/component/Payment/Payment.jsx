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
    const [timeLeft, setTimeLeft] = useState(60); // ✅ นับเวลาถอยหลังเริ่มที่ 5 นาที

    useEffect(() => {
        const fetchPaymentDetails = async () => {
            try {
                const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
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
    
                // ✅ อัปเดต `expiresAt` ที่ได้จาก Backend
                let expiresAt = new Date(response.data.booking.expiresAt).getTime();
                localStorage.setItem("expiresAt", expiresAt);
                updateCountdown(expiresAt);
            } catch (error) {
                console.error("❌ Error fetching payment details:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchPaymentDetails();
    }, [bookingData]);
    

    // ✅ ฟังก์ชันอัปเดตเวลาที่เหลือ
    const updateCountdown = (expiresAt) => {
        const now = new Date().getTime();
        const remainingTime = Math.max((expiresAt - now) / 1000, 0); // แปลง ms เป็นวินาที
        setTimeLeft(remainingTime);
    };

    // ✅ ตั้งค่าให้จับเวลาลดลงโดยไม่รีเซ็ตเมื่อรีเฟรช
    useEffect(() => {
        let expiresAt = localStorage.getItem("expiresAt");
        
        if (expiresAt) {
            expiresAt = parseInt(expiresAt, 10);
            updateCountdown(expiresAt);
        }
    
        const timer = setInterval(() => {
            let storedExpiresAt = localStorage.getItem("expiresAt");
            if (storedExpiresAt) {
                updateCountdown(parseInt(storedExpiresAt, 10));
            }
        }, 1000);
    
        return () => clearInterval(timer);
    }, []);
    

    useEffect(() => {
        if (timeLeft <= 0) {
            Swal.fire({
                icon: "error",
                title: "⏳ หมดเวลาชำระเงิน!",
                text: "ระบบจะพาคุณกลับไปยังหน้าเลือกสนาม",
                confirmButtonText: "ตกลง"
            }).then(() => {
                localStorage.removeItem("expiresAt"); // ลบค่าเมื่อหมดเวลา
                navigate("/"); // กลับไปหน้าเลือกสนาม
            });
        }
    }, [timeLeft, navigate]);

    const cancelBooking = async (sessionId) => {
        try {
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");
            if (!token) {
                Swal.fire("เกิดข้อผิดพลาด", "กรุณาเข้าสู่ระบบก่อน!", "error");
                return;
            }

            const result = await Swal.fire({
                title: "ยืนยันการยกเลิก?",
                text: "คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการจองนี้?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "ใช่, ยกเลิกเลย!",
                cancelButtonText: "ไม่"
            });

            if (!result.isConfirmed) return;

            console.log("🔹 Sending sessionId:", sessionId); // ✅ ตรวจสอบค่าที่ถูกส่ง

            const response = await axios.put(
                "http://localhost:4000/api/payments/cancel-booking",
                { sessionId },  // ✅ ส่ง sessionId ไป backend
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("✅ Response from server:", response.data); // ✅ ตรวจสอบค่าที่ backend ส่งกลับ

            Swal.fire("ยกเลิกสำเร็จ!", "การจองของคุณถูกยกเลิกแล้ว", "success");
            localStorage.removeItem("expiresAt"); // ✅ ลบค่าเมื่อหมดเวลา
            navigate("/");
        } catch (error) {
            console.error("❌ Error canceling booking:", error);
            Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถยกเลิกการจองได้", "error");
        }
    };


    const handlePaymentSubmit = async () => {
        if (timeLeft <= 0) {
            Swal.fire({
                icon: "error",
                title: "❌ เลยกำหนดเวลาชำระเงิน",
                text: "กรุณาจองใหม่อีกครั้ง",
            }).then(() => {
                navigate("/BookingArena");
            });
            return;
        }

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
                navigate("/"); 
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
                    <img src={arenaInfo?.images?.[0] || "https://via.placeholder.com/350x250"} alt="สนามกีฬา" className="arena-image" />
                </div>
                <div className="info-top">
                    <div className="arena-details">
                        <h2>เลขที่การจอง #{booking?.sessionId || "N/A"}</h2>
                        <p>📍 สนามกีฬา: {arenaInfo?.fieldName || "ไม่พบข้อมูลสนาม"}</p>
                        <p>📍 สนามย่อยที่จอง: {bookingData?.details?.map((detail) => detail.name).join(", ") || "ไม่พบข้อมูลสนามย่อย"}</p>
                        <p>📅 วันที่:</p>
                            <ul>
                            {Object.entries(
                                bookingData?.details?.reduce((acc, detail) => {
                                const stadiumName = detail.name; // ✅ ใช้ชื่อสนามเป็น Key
                                if (!acc[stadiumName]) acc[stadiumName] = [];
                                acc[stadiumName].push(detail.bookingDate);
                                return acc;
                                }, {})
                            ).map(([stadiumName, dates], index) => (
                                <li key={index}>
                                <span>{stadiumName} :</span> {new Date(dates[0]).toLocaleDateString()}
                                </li>
                            ))}
                            </ul>
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
                    <p>👤 ชื่อบัญชี: <strong>{bankInfo?.accountName || "ไม่พบข้อมูล"}</strong></p>
                    <p className="payment-timer">
                        ⏳ เหลือเวลาชำระเงิน: <strong>{Math.floor(timeLeft / 60)} นาที {Math.floor(timeLeft % 60)} วินาที</strong>
                    </p>
                </div>

                <div className="slip-upload">
                    <h3>อัปโหลดหลักฐานการโอน</h3>
                    <label>⏳ เวลาที่โอนเงิน</label>
                    <input type="time" value={transferTime} onChange={(e) => setTransferTime(e.target.value)} />

                    <label>💰 จำนวนเงิน</label>
                    <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="จำนวนเงินที่โอน" />

                    <label>📎 อัปโหลดสลิปโอนเงิน</label>
                    <input type="file" accept="image/*" onChange={(e) => setSlipImage(e.target.files[0])} />
                </div>
            </div>

            <div className="payment-actions">
                <button className="confirm-payment" onClick={handlePaymentSubmit} disabled={timeLeft <= 0}>
                    ตรวจสอบการโอน
                </button>
                <button className="cancel-booking"onClick={() => cancelBooking(booking.sessionId)}>
                    ยกเลิกการจอง
                </button>


            </div>
        </div>
    );

};

export default Payment;
