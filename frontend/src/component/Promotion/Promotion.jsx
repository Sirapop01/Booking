import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ Import axios เพื่อดึงข้อมูล
import "./Promotion.css";
import homeLogo from "../assets/logoalt.png";
import Promoowner from "../Promotionowner/Promoowner"; // นำเข้า Promoowner
import Navbar from "../Navbar/Navbar";

const PromotionPage = () => {
  const [decodedToken, setDecodedToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [promotions, setPromotions] = useState([]); // ✅ สร้าง state เก็บโปรโมชั่นทั้งหมด
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

  // ✅ โหลดโปรโมชั่นทั้งหมดจาก API
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/promotions"); // 🔹 เรียก API
        setPromotions(response.data); // 🔹 เก็บข้อมูลใน state
      } catch (error) {
        console.error("❌ ไม่สามารถดึงข้อมูลโปรโมชั่น:", error);
      }
    };

    fetchPromotions();
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
  {/* ✅ แสดงเฉพาะโปรโมชั่นที่มีข้อมูลสนาม */}
  {promotions.filter(promo => promo.stadiumId?.fieldName).length > 0 ? (
    promotions
      .filter(promo => promo.stadiumId?.fieldName) // ✅ กรองเฉพาะที่มีสนาม
      .map((promo) => (
        <div className="promotion-card" key={promo._id}>
          <img src={promo.promotionImageUrl} alt={promo.promotionTitle} className="promotion-card-image" />
          <div className="promotion-details">
            <h2>{promo.promotionTitle}</h2>
            <p><strong>สนาม:</strong> {promo.stadiumId?.fieldName}</p>
            <p><strong>ประเภทกีฬา:</strong> {promo.sportName}</p>
            <p><strong>ส่วนลด:</strong> {promo.discount}%</p>
            <p><strong>ช่วงเวลา:</strong> {promo.timeRange}</p>
            <p><strong>วันที่:</strong> {promo.startDate.substring(0, 10).split("-").reverse().join("-")} ถึง {promo.endDate.substring(0, 10).split("-").reverse().join("-")}</p>
          </div>
        </div>
      ))
  ) : (
    <p className="no-promotions">ไม่มีโปรโมชั่นในขณะนี้</p>
  )}
</div>


      <button className="promotion-booking-button" onClick={() => navigate("/")}>
        กลับหน้าหลัก
      </button>
    </div>
  );
};

export default PromotionPage;
