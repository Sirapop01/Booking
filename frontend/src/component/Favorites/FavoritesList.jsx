import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useParams, useNavigate } from "react-router-dom"; // ✅ เพิ่ม useParams
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import Navbar from "../Navbar/Navbar";
import "./FavoriteList.css";
import Swal from "sweetalert2";

const FavoritePage = () => {
  const { id } = useParams(); // ✅ รับ stadiumId จาก URL
  const navigate = useNavigate();
  const [decodedToken, setDecodedToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [selectedFavorite, setSelectedFavorite] = useState(null); // ✅ เก็บรายการโปรดที่ถูกเลือก

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

        const updatedFavorites = response.data.map((favorite) => ({
          ...favorite,
          liked: true,
        }));

        setFavorites(updatedFavorites);

        // ✅ หากมี stadiumId ใน URL ให้เลือกข้อมูลที่ตรงกัน
        if (id) {
          const foundFavorite = updatedFavorites.find(fav => fav.stadiumId === id);
          setSelectedFavorite(foundFavorite);
        }
      } catch (error) {
        console.error("❌ ไม่สามารถดึงข้อมูลรายการโปรด:", error);
      }
    };

    fetchFavorites();
  }, [decodedToken, id]); // ✅ อัปเดตตาม `id`

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
  
    if (!stadiumId) {
      console.error("❌ stadiumId is undefined!");
      return;
    }
  
    console.log("📌 Toggling favorite for stadiumId:", stadiumId);
  
    try {
      const isFavorite = favorites.some(fav => fav.stadiumId === stadiumId);
  
      if (isFavorite) {
        // 🔽 ลบออกจากรายการโปรด
        await axios.delete(`http://localhost:4000/api/favoritearena/${stadiumId}?userId=${decodedToken.id}`);
  
        setFavorites(prevFavorites => prevFavorites.filter(item => item.stadiumId !== stadiumId));
  
        Swal.fire({
          title: "ลบรายการโปรดสำเร็จ!",
          text: "คุณได้ลบสนามออกจากรายการโปรดแล้ว",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "ตกลง",
        });
  
        if (selectedFavorite?.stadiumId === stadiumId) {
          setSelectedFavorite(null);
          navigate("/FavoritesList"); // ✅ กลับไปที่รายการทั้งหมด
        }
      } else {
        // 🔽 เพิ่มเข้าในรายการโปรด
        await axios.post("http://localhost:4000/api/favoritearena", 
          { userId: decodedToken.id, stadiumId },
          { headers: { "Content-Type": "application/json" } }
        );
  
        setFavorites(prevFavorites => [...prevFavorites, { stadiumId, liked: true }]);
  
        Swal.fire({
          title: "เพิ่มลงรายการโปรดสำเร็จ!",
          text: "สนามถูกเพิ่มลงในรายการโปรดของคุณแล้ว",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "ตกลง",
        });
      }
    } catch (error) {
      console.error("❌ Error toggling favorite:", error.response ? error.response.data : error);
  
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถเพิ่ม/ลบ รายการโปรดได้",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "ตกลง",
      });
    }
  };
  

  if (loading) return <div>Loading...</div>;

  return (
    <div className="favorite-page">
      <Navbar />
      <h1 className="favorite-title">รายการโปรด</h1>
  
      {/* ✅ เพิ่ม container เพื่อจัดเรียงเนื้อหาให้ดูเป็นระเบียบ */}
      <div className="favorite-container">
        <div className="favorite-list-container">
          {favorites.length > 0 ? (
            favorites.map((favorite) => (
              <div 
                className="favorite-card" 
                key={favorite._id} 
                onClick={() => navigate(`/BookingArena/${favorite.stadiumId}`)}
              >
                <div className="favorite-details">
                  <div className="left">
                    <FaHeart
                      className={`heart-icon ${favorite.liked ? "liked" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation(); // ✅ ป้องกันการกดแล้วเปิดหน้าใหม่
                        toggleFavorite(favorite.stadiumId);
                      }}
                    />
                    <h2>{favorite.fieldName}</h2>
                  </div>
                  <div className="favorite-image">
                    <img src={favorite.stadiumImage || "https://via.placeholder.com/150"} alt={favorite.fieldName} />
                  </div>
                  <p><strong>วันที่เพิ่ม:</strong> {new Date(favorite.createdAt).toLocaleDateString()}  (กดเพื่อจองอีกครั้ง)</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-favorites">ไม่มีรายการโปรดในขณะนี้</p>
          )}
        </div>
      </div>
    </div>
  );
  
};

export default FavoritePage;
