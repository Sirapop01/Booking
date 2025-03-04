import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useParams, useNavigate } from "react-router-dom"; // ✅ เพิ่ม useParams
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import Navbar from "../Navbar/Navbar";
import "./FavoriteList.css";

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
      alert("กรุณาเข้าสู่ระบบก่อนลบรายการโปรด");
      return;
    }

    if (!stadiumId) {
      console.error("❌ stadiumId is undefined!");
      return;
    }

    console.log("📌 Toggling favorite for stadiumId:", stadiumId);

    try {
      await axios.delete(`http://localhost:4000/api/favoritearena/${stadiumId}?userId=${decodedToken.id}`);

      setFavorites(prevFavorites => prevFavorites.filter(item => item.stadiumId !== stadiumId));

      // ✅ หากสนามที่ถูกลบคือสนามที่กำลังดู ให้ล้าง `selectedFavorite`
      if (selectedFavorite?.stadiumId === stadiumId) {
        setSelectedFavorite(null);
        navigate("/FavoritesList"); // ✅ กลับไปที่รายการทั้งหมด
      }
    } catch (error) {
      console.error("❌ ไม่สามารถลบรายการโปรด:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="favorite-page">
      <Navbar />
      <h1 className="favorite-title">รายการโปรด</h1>

      {/* ✅ ถ้ามี stadiumId ให้แสดงรายละเอียดสนามนั้น */}
      {selectedFavorite ? (
        <div className="favorite-details-page">
          <button onClick={() => navigate("/FavoritesList")}>🔙 กลับไปหน้ารายการโปรด</button>
          <h2>{selectedFavorite.fieldName}</h2>
          <img src={selectedFavorite.stadiumImage || "https://via.placeholder.com/150"} alt={selectedFavorite.fieldName} />
          <p>วันที่เพิ่ม: {new Date(selectedFavorite.createdAt).toLocaleDateString()}</p>
          <FaHeart 
            className={`heart-icon ${selectedFavorite.liked ? "liked" : ""}`} 
            onClick={() => toggleFavorite(selectedFavorite.stadiumId)}
          />
        </div>
      ) : (
        <div className="favorite-list-container">
          {favorites.length > 0 ? (
            favorites.map((favorite) => (
              <div 
                className="favorite-card" 
                key={favorite._id} 
                onClick={() => navigate(`/FavoritesList/${favorite.stadiumId}`)}
              >
                <div className="favorite-details">
                  <div className="left">
                    <FaHeart
                      className={`heart-icon ${favorite.liked ? "liked" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation(); // ✅ กันการกดหัวใจแล้วเปิดหน้าใหม่
                        toggleFavorite(favorite.stadiumId);
                      }}
                    />
                    <h2>{favorite.fieldName}</h2>
                  </div>
                  <div className="favorite-image">
                    <img src={favorite.stadiumImage || "https://via.placeholder.com/150"} alt={favorite.fieldName} />
                  </div>
                  <p><strong>วันที่เพิ่ม:</strong> {new Date(favorite.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-favorites">ไม่มีรายการโปรดในขณะนี้</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FavoritePage;
