import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Payment.css";


const Payment = () => {
    const [paymentData, setPaymentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [transferTime, setTransferTime] = useState("");
    const [amount, setAmount] = useState("");
    const [slipImage, setSlipImage] = useState(null);

    useEffect(() => {
        const fetchPaymentDetails = async () => {
            try {
                const token = localStorage.getItem("token") || sessionStorage.getItem("token");
                if (!token) {
                    console.log("❌ No token found");
                    return;
                }

                const response = await axios.get("http://localhost:4000/api/payments/pending", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setPaymentData(response.data);
                console.log("✅ Payment Data:", response.data);
            } catch (error) {
                console.error("❌ Error fetching payment details:", error);
            } finally {
                setLoading(false); // ตั้งค่าสถานะโหลดเสร็จแล้ว
            }
        };

        fetchPaymentDetails();
    }, []);

    const handleFileUpload = (event) => {
        setSlipImage(URL.createObjectURL(event.target.files[0]));
    };

    if (loading) {
        return <p>กำลังโหลดข้อมูล...</p>;
    }

    if (!paymentData || !paymentData.booking) {
        return <p>❌ ไม่พบข้อมูลการจอง</p>;
    }

    const { arenaInfo, booking, stadiumInfo, bankInfo } = paymentData;


    return (
        <div className="payment-container">
            {/* 🔹 ส่วนบน: รายละเอียดสนาม */}
            <div className="payment-top">
                <div className="image-top">
                    <div className="arena-details">
                        <img src={arenaInfo?.[0].images?.[0]} alt="สนามกีฬา" className="arena-image" />
                    </div>
                </div>
                <div className="info-top">
                    <div className="arena-details">
                        <h2>เลขที่การจอง #{booking?.sessionId || "N/A"}</h2>
                        <p>📍 {arenaInfo?.[0]?.fieldName || "ไม่พบข้อมูลสนาม"}</p>
                        <p>📍 {stadiumInfo?.map((stadium) => stadium.name).join(", ") || "ไม่พบข้อมูลสนาม"}</p>
                        <p>📅 วันที่: {new Date(booking?.details?.[0]?.bookingDate || new Date()).toLocaleDateString()}</p>
                        {/* ✅ วนลูปแสดงเวลาทุกช่วงที่จอง */}
                        <div>
                            <p>🕒 เวลาที่จอง:</p>
                            <ul>
                                {booking?.details?.map((detail, index) => {
                                    // 🔍 ค้นหา substadium ตาม subStadiumId
                                    const matchedStadium = stadiumInfo?.find(stadium =>
                                        stadium._id.toString() === detail.subStadiumId.toString()
                                    );

                                    return (
                                        <li key={index}>
                                            <strong>{matchedStadium?.name || "ไม่พบชื่อสนาม"}</strong>:
                                            {detail.startTime} - {detail.endTime} ({detail.duration} ชั่วโมง)
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                        <p className="price">💰 ฿{booking?.totalPrice || "N/A"}</p>
                    </div>
                </div>
            </div>

            {/* 🔹 ส่วนล่าง: การชำระเงิน */}
            <div className="payment-bottom">
                {/* ✅ QR Code */}
                <div className="qr-section">
                    <h3>ช่องทางการชำระเงิน</h3>
                    <img src={bankInfo?.images.qrCode} alt="QR Code" className="qr-code" />
                </div>

                {/* ✅ ข้อมูลธนาคาร */}
                <div className="bank-info">
                    <h3>ข้อมูลธนาคาร</h3>
                    <p>🏦 ธนาคาร: <strong>{bankInfo?.bank || "ไม่พบข้อมูล"}</strong></p>
                    <p>💳 เลขบัญชี: <strong>{bankInfo?.accountNumber || "N/A"}</strong></p>
                    <p>👤 ชื่อบัญชี: {bankInfo?.accountName || "ไม่พบข้อมูล"}</p>
                    <p className="payment-timer">⏳ ชำระเงินภายใน {new Date(booking?.expiresAt || new Date()).toLocaleTimeString()}</p>
                </div>

                {/* ✅ อัปโหลดสลิปโอนเงิน */}
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
                    <input type="file" accept="image/*" onChange={handleFileUpload} />

                    {slipImage && <img src={slipImage} alt="Slip Preview" className="slip-preview" />}
                </div>

                {/* 🔘 ปุ่มกดยืนยัน / ยกเลิก */}
                <div className="payment-actions">
                    <button className="confirm-payment">ตรวจสอบการโอน</button>
                    <button className="cancel-booking">ยกเลิกการจอง</button>
                </div>
            </div>
        </div>
    );
};

export default Payment;
