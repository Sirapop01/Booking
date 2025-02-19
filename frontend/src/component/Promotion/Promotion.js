import React from 'react';
import './Promotion.css';
import soccerPromo from './assets/soccer-promo.png';
import badmintonPromo from './assets/badminton-promo.png';
import boxingPromo from './assets/boxing-promo.png';
import homeLogo from '../assets/logoalt.png'; // สมมติว่าโลโก้ home อยู่ path นี้

const PromotionPage = () => {
  return (
    <div className="promotion-page">
      {/* ปุ่มกลับหน้าโฮม */}
      <a href="/" className="home-button111">
        <img src={homeLogo} alt="Home Logo" className="home-logo111" />
      </a>

      <h1 className="promotion-title">PROMOTION</h1>

      <div className="promotion-card-container">
        <div className="promotion-card">
          <img src={soccerPromo} alt="Soccer Promotion" className="promotion-card-image" />
          <div className="promotion-pin">📍</div>
        </div>
        <div className="promotion-card">
          <img src={badmintonPromo} alt="Badminton Promotion" className="promotion-card-image" />
          <div className="promotion-pin">📍</div>
        </div>
        <div className="promotion-card">
          <img src={boxingPromo} alt="Boxing Promotion" className="promotion-card-image" />
          <div className="promotion-pin">📍</div>
        </div>
      </div>

      <button className="promotion-booking-button">ไปหน้าการจอง</button>
    </div>
  );
};

export default PromotionPage;
