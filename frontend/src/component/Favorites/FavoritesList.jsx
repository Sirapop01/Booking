import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import Navbar from "../Navbar/Navbar";
import "./FavoriteList.css";

const FavoritePage = () => {
  const [decodedToken, setDecodedToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
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

  useEffect(() => {
    if (!decodedToken) return;

    const fetchFavorites = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/favoritearena?userId=${decodedToken.id}`
        );

        // ✅ ตั้งค่าให้ liked เป็น true สำหรับรายการโปรด
        const updatedFavorites = response.data.map((favorite) => ({
          ...favorite,
          liked: true, // ✅ หัวใจถูกกดไว้แล้ว
        }));

        setFavorites(updatedFavorites);
      } catch (error) {
        console.error("❌ ไม่สามารถดึงข้อมูลรายการโปรด:", error);
      }
    };

    fetchFavorites();
  }, [decodedToken]);

  const toggleFavorite = async (stadiumId) => {
    if (!decodedToken?.id) {
        alert("กรุณาเข้าสู่ระบบก่อนลบรายการโปรด");
        return;
    }

    if (!stadiumId) {
        console.error("❌ stadiumId is undefined!");
        return;
    }

    console.log("📌 Toggling favorite for stadiumId:", stadiumId);

    try {
        await axios.delete(`http://localhost:4000/api/favoritearena/${stadiumId}`, {
            data: { userId: decodedToken.id } // ✅ ส่ง userId ผ่าน body
        });

        // ✅ ลบออกจาก state
        setFavorites((prevFavorites) => prevFavorites.filter((item) => item.stadiumId._id !== stadiumId));
    } catch (error) {
        console.error("❌ ไม่สามารถลบรายการโปรด:", error);
    }
};



  if (loading) return <div>Loading...</div>;

  return (
    <div className="favorite-page">
      <Navbar />
      <h1 className="favorite-title">รายการโปรด</h1>
      <div className="favorite-list-container">
      {favorites.length > 0 ? (
  favorites.map((favorite) => (
    <div className="favorite-card" key={favorite._id}>
      <div className="favorite-details">
        <div className="left">
        <FaHeart
    className={`heart-icon ${favorite.liked ? "liked" : ""}`}
    onClick={() => {
        console.log("📌 Full favorite data:", favorite); // ✅ Debugging
        console.log("📌 stadiumId before sending:", favorite.stadiumId?._id); 
        toggleFavorite(favorite?.stadiumId?._id);
    }}
/>


          <h2>{favorite.stadiumId?.fieldName}</h2>
        </div>
        
        {/* ✅ ใช้รูปแรกของสนาม */}
        <div className="favorite-image">
          <img 
            src={favorite.stadiumImage || "https://via.placeholder.com/150"} 
            alt={favorite.stadiumId?.fieldName} 
          />
        </div>

        <p>
          <strong>วันที่เพิ่ม:</strong> {" "}
          {new Date(favorite.createdAt).toLocaleDateString()}
        </p>
        <button
          className="gofavorite-booking-button"
          onClick={() => navigate("/BookingArena")}
        >
          จองอีกครั้ง
        </button>
      </div>
    </div>
  ))
) : (
  <p className="no-favorites">ไม่มีรายการโปรดในขณะนี้</p>
)}
      </div>
      <button
        className="favorite-booking-button"
        onClick={() => navigate("/booking")}
      >
        ไปหน้าการจอง
      </button>
    </div>
  );
};

export default FavoritePage;
