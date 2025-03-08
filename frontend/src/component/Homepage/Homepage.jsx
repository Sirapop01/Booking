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
  const [selectedTimes, setSelectedTimes] = useState([]); // เปลี่ยนเป็น array
  const [searchQuery, setSearchQuery] = useState(""); // ✅ แก้ `searchQuery` ไม่ถูกกำหนด
  const [arenas, setArenas] = useState([]); // ✅ แก้ `setArenas` ไม่ถูกกำหนด

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

  const handleSearch = async () => {
    try {
      console.log("🔍 Searching for:", searchQuery); // ✅ เช็คค่าที่ถูกส่ง

      if (searchQuery.trim() === "") {
        console.log("🔄 No search query, fetching all arenas...");
        fetchArenas(); // โหลดข้อมูลสนามทั้งหมด ถ้าไม่มีการค้นหา
        return;
      }

      const res = await axios.get(`http://localhost:4000/api/arenas/searchArenasByFieldName?query=${encodeURIComponent(searchQuery)}`);

      console.log("✅ Search Results:", res.data); // ✅ ตรวจสอบค่าที่ได้กลับมา
      setArenas(res.data);
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
          <div className="date-time-container">
            <div className="booking-status">
              <label>
                <input type="radio" name="booking" defaultChecked />
                จองได้
              </label>
              <label>
                <input type="radio" name="booking" />
                แสดงทั้งหมด
              </label>
            </div>
            <button className="search-button-homepage" onClick={handleSearch}>ค้นหา</button>
          </div>
        </div>

        <div className="sports-icons">
          <button className="sport-btn">⚽</button>
          <button className="sport-btn">🏀</button>
          <button className="sport-btn">🏸</button>
          <button className="sport-btn">🎾</button>
          <button className="sport-btn">🏐</button>
          <button className="sport-btn">🏓</button>
          <button className="sport-btn">🥊</button>
          <button className="sport-btn">🎳</button>
          <button className="sport-btn">⛳</button>
          <button className="sport-btn">...</button>
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
