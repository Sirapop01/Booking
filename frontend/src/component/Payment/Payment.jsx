import React, { useState } from "react";
import "./Payment.css";
import qr from "./assets/qr.png"
import field from "./assets/field.jpg"
const Payment = () => {
    const [transferTime, setTransferTime] = useState("");
    const [amount, setAmount] = useState("");
    const [slipImage, setSlipImage] = useState(null);

    const handleFileUpload = (event) => {
        setSlipImage(URL.createObjectURL(event.target.files[0]));
    };

    return (
        <div className="payment-container">
            {/* 🔹 ส่วนบน: รายละเอียดสนาม */}
            <div className="payment-top">
                <div className="image-top">
                    <div className="arena-details">
                        <img src={field} alt="สนามกีฬา" className="arena-image" />
                    </div>
                </div>
                <div className="info-top">
                    <div className="arena-details">
                        <h2>เลขที่การจอง #123456</h2>
                        <p>📍 สนามฟุตบอล 1</p>
                        <p>🏟️ Bluelock</p>
                        <p>📅 วันที่: 10/01/2568</p>
                        <p>🕒 เวลา: 12.00 - 15.00 (3 ชั่วโมง)</p>
                        <p className="price">💰 ฿600</p>
                    </div>
                </div>


            </div>

            {/* 🔹 ส่วนล่าง: การชำระเงิน */}
            <div className="payment-bottom">
                {/* ✅ QR Code */}
                <div className="qr-section">
                    <h3>ช่องทางการชำระเงิน</h3>
                    <img src={qr} alt="QR Code" className="qr-code" />
                </div>

                {/* ✅ ข้อมูลธนาคาร */}
                <div className="bank-info">
                    <h3>ข้อมูลธนาคาร</h3>
                    <p>🏦 ธนาคาร: <strong>กสิกรไทย</strong></p>
                    <p>💳 เลขบัญชี: <strong>XXXXXXXXXX</strong></p>
                    <p>👤 ชื่อบัญชี: นาย XXXX XXXXXXX</p>
                    <p className="payment-timer">⏳ ชำระเงินภายใน 09:56</p>
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
