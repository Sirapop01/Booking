import React from "react";
import "./Promoowner.css";


const PromotionList = () => {
  return (
    <div className="promotion-container">
      <h1 className="promotion-title">โปรโมชั่น</h1>
      <div className="promotion-list">
        {/* ✅ การ์ดแสดงโปรโมชั่น */}
        <div className="promotion-card">
          
          <div className="promotion-details">
            <h2>The Blue Arena</h2>
            <p>สนามแบบเปิด</p>
            <p className="discount">ลดราคา 20%</p>
            <button className="cancel-button">ยกเลิกโปรโมชั่น</button>
          </div>
        </div>
      </div>
      {/* ✅ ปุ่มเพิ่มโปรโมชั่น */}
      <button className="add-promotion-button">เพิ่มโปรโมชั่น</button>
    </div>
  );
};

export default PromotionList;
