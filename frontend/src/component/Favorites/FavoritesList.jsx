import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaClock, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import Navbar from "../Navbar/Navbar";
import Swal from "sweetalert2";
import "./FavoriteList.css";

const FavoritePage = () => {
  const navigate = useNavigate();
  const [decodedToken, setDecodedToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (storedToken) {
      try {
        setDecodedToken(jwtDecode(storedToken));
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

        setFavorites(response.data);
      } catch (error) {
        console.error("❌ ไม่สามารถดึงข้อมูลรายการโปรด:", error);
      }
    };

    fetchFavorites();
  }, [decodedToken]);

  const toggleFavorite = async (stadiumId) => {
    if (!decodedToken?.id) {
      Swal.fire({
        title: "กรุณาเข้าสู่ระบบ!",
        text: "กรุณาเข้าสู่ระบบก่อนเพิ่ม/ลบรายการโปรด",
        icon: "warning",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    try {
      const isFavorite = favorites.some(fav => fav.stadiumId === stadiumId);

      if (isFavorite) {
        await axios.delete(`http://localhost:4000/api/favoritearena/${stadiumId}?userId=${decodedToken.id}`);
        setFavorites(prev => prev.filter(item => item.stadiumId !== stadiumId));
      } else {
        await axios.post("http://localhost:4000/api/favoritearena", 
          { userId: decodedToken.id, stadiumId },
          { headers: { "Content-Type": "application/json" } }
        );
        setFavorites(prev => [...prev, { stadiumId, liked: true }]);
      }
    } catch (error) {
      Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถเพิ่ม/ลบ รายการโปรดได้", "error");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="favorite-container">
      <Navbar />
      <h1 className="favorite-title">สนามโปรดของคุณ</h1>
      
      <div className="favorite-grid">
        {favorites.length > 0 ? (
          favorites.map((favorite) => (
            <div className="favorite-card" key={favorite._id}>
              {/* 🔹 ไอคอนหัวใจ */}
              <FaHeart
                className={`favorite-heart-icon ${favorite.liked ? "liked" : ""}`}
                onClick={() => toggleFavorite(favorite.stadiumId)}
              />
  
              {/* 🔹 รูปสนาม */}
              <div className="favorite-image">
                <img 
                  src={favorite.stadiumImage || "https://via.placeholder.com/150"} 
                  alt={favorite.fieldName} 
                />
              </div>
  
              {/* 🔹 ข้อมูลสนาม */}
              <div className="favorite-info">
                <h2>{favorite.fieldName}</h2>
                <p><FaPhone className="icon" /> โทร: {favorite.phone || "ไม่มีข้อมูล"}</p>
                <p><FaClock className="icon" /> เวลาเปิด: {favorite.startTime || "ไม่ระบุ"} - {favorite.endTime || "ไม่ระบุ"}</p>
  
                {/* 🔹 ปุ่ม "จองอีกครั้ง" */}
                <button 
                  className="rebook-button"
                  onClick={() => navigate(`/BookingArena/${favorite.stadiumId}`)}
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
    </div>
  );
  
  
  
};

export default FavoritePage;
