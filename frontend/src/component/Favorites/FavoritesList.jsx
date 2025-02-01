import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import "./FavoriteList.css"; // Import CSS

export default function FavoriteList() {
  const [favorites, setFavorites] = useState([
    { id: 1, name: "สนามฟุตบอล Old Trafford", liked: false, details: true },
    { id: 2, name: "สนามแบดมินตัน Old Trafford", liked: false, details: false },
    { id: 3, name: "สนามแบดมินตัน Wichai", liked: false, details: false },
  ]);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  // ฟังก์ชันสำหรับกดปุ่มหัวใจ
  const toggleFavorite = (id) => {
    setFavorites((prevFavorites) =>
      prevFavorites.map((item) =>
        item.id === id ? { ...item, liked: !item.liked } : item
      )
    );
  };

  return (
    <div className="container">
      <div className="favorite-box">
        {/* เมนูไอคอนขวาบน */}
        <div className="menu-container">
          <FiMenu
            className="menu-icon"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          {dropdownOpen && (
            <div className="dropdown-menu">
              <ul>
                <li>โปรไฟล์</li>
                <li>การตั้งค่า</li>
                <li>ออกจากระบบ</li>
              </ul>
            </div>
          )}
        </div>

        {/* หัวข้อ */}
        <h2 className="title">รายการโปรด</h2>

        {/* รายการโปรด */}
        <div className="favorite-list">
          {favorites.map((item) => (
            <div key={item.id} className="favorite-item">
              <div className="left">
                <FaHeart
                  className={`heart-icon ${item.liked ? "liked" : ""}`}
                  onClick={() => toggleFavorite(item.id)}
                />
                <span>{item.name}</span>
              </div>
              {item.details && <button className="details-button">รายละเอียด</button>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
