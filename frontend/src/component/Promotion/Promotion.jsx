import React, { useState } from "react";
import "./Promotion.css";

const Promotion = () => {
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const coupons = [
    { id: 1, title: "จองครั้งแรก ลด 5%", description: "First time booking, 5% discount" },
    { id: 2, title: "จองครบ 300 บาท ลด 10%", description: "Book 300 baht and get a 10% discount" },
    { id: 3, title: "จองครบ 500 บาท ลด 15%", description: "Book 500 baht and get a 15% discount" },
  ];

  const handleSelect = (id) => {
    setSelectedCoupon(id);
  };

  return (
    <div className="promotion-container">
      <div className="image-section">
        <img src="/images/tom-briskey-basketball.jpg" alt="Basketball Hoop" className="promo-image" />
      </div>

      <div className="promotion-section">
        <h2 className="promotion-title" style={{ fontSize: "36px", color: "#000000" }}>🏷️ คูปอง</h2>

        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className={`promotion-card ${selectedCoupon === coupon.id ? "selected" : ""}`}
            onClick={() => handleSelect(coupon.id)}
          >
            <h3>{coupon.title}</h3>
            <p>{coupon.description}</p>
          </div>
        ))}

        <button className="confirm-button" disabled={!selectedCoupon}>
          ยืนยัน
        </button>
      </div>
    </div>
  );
};

export default Promotion;
