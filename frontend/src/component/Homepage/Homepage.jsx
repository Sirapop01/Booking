import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import HomepageOpera from '../HomepageOper/Homepageopera';
import './Homepage.css';
import { jwtDecode } from 'jwt-decode';
import ListCard from '../ListCard/ListCard';
import axios from 'axios';

const Homepage = () => {
  const [decodedToken, setDecodedToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // ✅ แก้ `searchQuery` ไม่ถูกกำหนด
  const [arenas, setArenas] = useState([]); // ✅ แก้ `setArenas` ไม่ถูกกำหนด
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(true);

  useEffect(() => {
    fetchArenas(); // ✅ แก้ `fetchArenas` ไม่ถูกกำหนด
  }, []);

  const fetchArenas = async () => { // ✅ ประกาศฟังก์ชันให้ชัดเจน
    try {
      const res = await axios.get("http://localhost:4000/api/arenas/getArenas");
      setArenas(res.data);
      console.log("Arena Fetch", arenas)
    } catch (error) {
      console.error("❌ Error fetching arenas:", error);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        setDecodedToken(decoded);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    setLoading(false);
  }, []);

  const searchBySport = async (sportName) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:4000/api/sportscategories/searchBySport?sportName=${sportName}`);
      setArenas(res.data);
    } catch (error) {
      console.error("❌ Error searching by sport:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      let endpoint = "";

      if (searchQuery.trim() !== "") {
        // 🔹 ค้นหาสนามโดยใช้ชื่อ
        endpoint = `http://localhost:4000/api/arenas/searchArenasByFieldName?query=${searchQuery}`;
      } else if (selectedSport) {
        // 🔹 ค้นหาสนามโดยใช้ประเภทกีฬา
        endpoint = `http://localhost:4000/api/sportscategories/searchBySport?sportName=${selectedSport}`;
      } else {
        // 🔹 ถ้าไม่มีเงื่อนไข → โหลดข้อมูลทั้งหมด
        endpoint = "http://localhost:4000/api/arenas/getArenas";
      }

      const res = await axios.get(endpoint);
      let filteredArenas = res.data;

      // ✅ ตรวจสอบเงื่อนไขแสดง "สนามที่เปิด" หรือ "ทั้งหมด"
      if (showOnlyAvailable) {
        filteredArenas = filteredArenas.filter(arenas => arenas.status === "พร้อมใช้งาน");
        console.log(filteredArenas)
      }

      setArenas(filteredArenas);
    } catch (error) {
      console.error("❌ Error searching arenas:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!decodedToken || decodedToken.role === 'customer') {
    return (
      <div className="homepage-container">
        <Navbar />
        <div className="search-section-homepage">
          <input type="text"
            className='search-input-homepage'
            placeholder="ค้นหาสนามกีฬา..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="sports-icons">
          {[
            { icon: "⚽", name: "Football" },
            { icon: "🏀", name: "Basketball" },
            { icon: "🏸", name: "Badminton" },
            { icon: "🎾", name: "Tennis" },
            { icon: "🏐", name: "วอลเลย์บอล" },
            { icon: "🏓", name: "Table Tennis" },
            { icon: "🥊", name: "มวย" },
            { icon: "🎳", name: "โบว์ลิ่ง" },
            { icon: "⛳", name: "Golf" },
          ].map((sport) => (
            <button
              key={sport.name}
              className={`sport-btn ${selectedSport === sport.name ? "selected" : ""}`}
              onClick={() => searchBySport(sport.name)}
            >
              {sport.icon}
            </button>
          ))}
        </div>
        <div className="date-time-container">
          <div className="booking-status">
            <label>
              <input
                type="radio"
                name="booking"
                checked={showOnlyAvailable}
                onChange={() => setShowOnlyAvailable(true)}
              />
              จองได้
            </label>
            <label>
              <input
                type="radio"
                name="booking"
                checked={!showOnlyAvailable}
                onChange={() => setShowOnlyAvailable(false)}
              />
              แสดงทั้งหมด
            </label>
          </div>
          <button className="search-button-homepage" onClick={handleSearch}>ค้นหา</button>
        </div>

        {loading ? (
          <p>⏳ กำลังโหลดข้อมูล...</p>
        ) : (
          <ListCard stadiums={arenas} />  // ✅ ส่งข้อมูลที่ค้นหาไปยัง ListCard
        )}
      </div>
    );
  } else {
    return <HomepageOpera />;
  }
};

export default Homepage;
