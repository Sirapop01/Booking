import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; 
import Swal from "sweetalert2";
import "./Promoowner.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

const PromotionList = () => {
  const [promotions, setPromotions] = useState([]);
  const [arenas, setArenas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      alert("Session หมดอายุ! กรุณาเข้าสู่ระบบใหม่");
      window.location.href = "/login";
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const ownerId = decoded.id;

      if (!ownerId) {
        console.error("⚠️ ไม่พบ ID ใน Token");
        return;
      }

      // ✅ ฟังก์ชันโหลดสนามกีฬาของเจ้าของธุรกิจ
      const fetchArenas = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/api/stadium/getArenas?owner_id=${ownerId}`);
          if (response.data.length > 0) {
            setArenas(response.data);
            fetchPromotions(ownerId, response.data.map(arena => arena._id)); // ✅ โหลดโปรโมชั่นของสนามทั้งหมด
          } else {
            setArenas([]);
            setPromotions([]); // ✅ ถ้าไม่มีสนาม ให้ล้างโปรโมชั่นด้วย
          }
        } catch (error) {
          console.error("⚠️ ไม่สามารถโหลดข้อมูลสนาม:", error);
        }
      };

      fetchArenas();
    } catch (error) {
      console.error("⚠️ ไม่สามารถถอดรหัส Token:", error);
      alert("Session ไม่ถูกต้อง กรุณาเข้าสู่ระบบใหม่");
      window.location.href = "/login";
    }
  }, []);

  // ✅ โหลดโปรโมชั่นที่ตรงกับ ownerId และ stadiumId
  const fetchPromotions = async (ownerId, stadiumIds) => {
    try {
      const response = await axios.get("http://localhost:4000/api/promotions", {
        params: { ownerId, stadiumIds: stadiumIds.join(",") }
      });

      setPromotions(response.data);
    } catch (error) {
      console.error("❌ ไม่สามารถดึงข้อมูลโปรโมชั่น:", error);
    }
  };

  // ✅ ฟังก์ชันลบโปรโมชั่น
  const handleDeletePromotion = async (promotionId) => {
    const confirmDelete = await Swal.fire({
      title: "ยืนยันการลบ",
      text: "คุณแน่ใจหรือไม่ว่าต้องการยกเลิกโปรโมชั่นนี้",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "red",
      confirmButtonText: "ยืนยันการลบ",
      cancelButtonText: "ยกเลิก",
    });

    if (confirmDelete.isConfirmed) {
      try {
        await axios.delete(`http://localhost:4000/api/promotions/${promotionId}`);
        setPromotions(promotions.filter((promo) => promo._id !== promotionId)); // ✅ อัปเดตรายการ
        Swal.fire("ลบสำเร็จ!", "โปรโมชั่นถูกลบออกจากระบบแล้ว", "success");
      } catch (error) {
        console.error("❌ ไม่สามารถลบโปรโมชั่น:", error);
        Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถลบโปรโมชั่นได้", "error");
      }
    }
  };

  return (
    <div className="promotion-container66">
      <Navbar />
      <h1 className="promotion-title66">โปรโมชั่นของฉัน</h1>
      <div className="promotion-list66">
        {/*แสดงรายการโปรโมชั่นที่ดึงมาจากฐานข้อมูล */}
        {promotions.length > 0 ? (
          promotions.map((promo) => (
            <div className="promotion-card66" key={promo._id}>
              <img src={promo.promotionImageUrl} alt={promo.promotionTitle} className="promotion-image66" />
              <div className="promotion-details66">
                <h2>{promo.promotionTitle}</h2>
                <p><strong>สนาม:</strong> {promo.stadiumId?.fieldName || "ไม่ระบุ"}</p>
                <p><strong>ประเภทกีฬา:</strong> {promo.sportName || "ไม่ระบุ"}</p>
                <p><strong>เริ่ม:</strong> {promo.startDate.substring(0, 10) || "ไม่ระบุ"}</p>
                <p><strong>สิ้นสุด:</strong> {promo.endDate.substring(0, 10) || "ไม่ระบุ"}</p>
                <p><strong>ช่วงเวลา:</strong> {promo.timeRange || "ไม่ระบุ"}</p>
                <p className="discount66">ลดราคา {promo.discount}%</p>
                <div className="cancel-button-container66">
                   <button className="cancel-button66" onClick={() => handleDeletePromotion(promo._id)}>
                     ยกเลิกโปรโมชั่น
                   </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-promotions">ไม่มีโปรโมชั่นในขณะนี้</p>
        )}
      </div>
      {/*ปุ่มเพิ่มโปรโมชั่น */}
      <button className="add-promotion-button66" onClick={() => navigate("/Addpromotion")}>
        เพิ่มโปรโมชั่น
      </button>
    </div>
  );
};

export default PromotionList;
