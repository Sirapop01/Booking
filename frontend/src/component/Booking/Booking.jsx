import React from "react";
import "./Booking.css";

const Booking = () => {
  return (
    <div className="booking-container">
      <div className="booking-card">
        <img
          src="/table-tennis.jpg" // เปลี่ยนเป็น path ของรูปที่ต้องการ
          alt="Table Tennis"
          className="booking-image"
        />
        <div className="booking-details">
          <h2>โต๊ะปิงปอง 1, โต๊ะปิงปอง 2</h2>
          <ul className="booking-rules">
            <li>ผู้ใช้มีใบอนุญาตจองสนามอย่างถูกต้องหรือ</li>
            <li>อุปกรณ์ป้องกันที่เหมาะสมสำหรับป้องกันอุบัติเหตุ</li>
            <li>กรุณาใช้อุปกรณ์ของสนามอย่างเหมาะสม</li>
            <li>ห้ามส่งเสียงดังรบกวนผู้อื่นในสนาม</li>
            <li>คืนสภาพสนามให้สะอาดเหมือนเดิมหลังใช้งาน</li>
            <li>หากมีปัญหาแจ้งเจ้าหน้าที่ทันที</li>
            <li>หากเกินเวลากำหนด ระบบจะไม่คืนเงินค่าจอง</li>
            <li>ทางสนามขอปรับเปลี่ยนกฎโดยไม่ต้องแจ้งล่วงหน้า</li>
          </ul>
          <div className="booking-form">
            <label>รายละเอียด</label>
            <input type="text" placeholder="ปิงปอง" disabled />
            <input type="text" placeholder="xx/xx/xxxx" />
            <input type="text" placeholder="xx:xx-xx:xx" />
            <p className="booking-price">ราคา ( ตามเวลาที่จอง / ชั่วโมง )</p>
            <p className="booking-cost">฿ 600</p>
            <button className="booking-button">ยืนยันการจอง</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;