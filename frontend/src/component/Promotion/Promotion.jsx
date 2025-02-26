import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "./Promotion.css";
import soccerPromo from "./assets/soccer-promo.png";
import badmintonPromo from "./assets/badminton-promo.png";
import boxingPromo from "./assets/boxing-promo.png";
import homeLogo from "../assets/logoalt.png";
import Promoowner from "../Promotionowner/Promoowner"; // นำเข้า Promoowner

const PromotionPage = () => {
  const [decodedToken, setDecodedToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        setDecodedToken(decoded);
      } catch (error) {
        console.error("⚠️ Error decoding token:", error);
      }
    }
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;

  // ✅ ถ้า role ไม่ใช่ "customer" ให้แสดง Promoowner แทน
  if (decodedToken && decodedToken.role !== "customer") {
    return <Promoowner />;
  }

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

      <button className="promotion-booking-button" onClick={() => navigate("/booking")}>
        ไปหน้าการจอง
      </button>
    </div>
  );
};

export default PromotionPage;
