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
  const [searchQuery, setSearchQuery] = useState(""); // ✅ แก้ `searchQuery` ไม่ถูกกำหนด
  const [arenas, setArenas] = useState([]); // ✅ แก้ `setArenas` ไม่ถูกกำหนด
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(true);
  const [selectedSports, setSelectedSports] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("แสดงทั้งหมด");
  const [selectedSport, setSelectedSport] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        setDecodedToken(decoded);
        handleSearch();
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      fetchArenas();
    }
    setLoading(false);
  }, []);
  
  const fetchArenas = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/arenas/arenasWithRatings");
      setArenas(res.data);
    } catch (error) {
      console.error("❌ Error fetching arenas:", error);
    }
  };
  

  const handleSportClick = (sportName) => {
    let updatedSports = [...selectedSports];

    if (updatedSports.includes(sportName)) {
      updatedSports = updatedSports.filter(sport => sport !== sportName);
    } else {
      updatedSports.push(sportName);
    }

    setSelectedSports(updatedSports);
  };

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        console.error("❌ ไม่มี Token, ไม่สามารถค้นหาได้");
        return;
      }

      let queryParams = [];
      if (searchQuery) queryParams.push(`query=${encodeURIComponent(searchQuery)}`);
      if (selectedSports.length > 0) queryParams.push(`sport=${selectedSports.join(",")}`);
      if (selectedStatus === "จองได้") queryParams.push("status=เปิด");
      if (startTime) queryParams.push(`startTime=${startTime}`);
      if (endTime) queryParams.push(`endTime=${endTime}`);

      const queryString = queryParams.length ? `?${queryParams.join("&")}` : "";

      const res = await axios.get(`http://localhost:4000/api/arenas/filteredArenas${queryString}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const sortedArenas = res.data.sort((a, b) => a.distance - b.distance);
      setArenas(sortedArenas);

      console.log("📢 Arenas Data:", sortedArenas); // ✅ Debugging
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
            { icon: "🏐", name: "Volleyball" },
            { icon: "🏓", name: "Table Tennis" },
            { icon: "🥊", name: "Boxing" },
            { icon: "🎳", name: "Bowling" },
            { icon: "⛳", name: "Golf" },
          ].map((sport) => (
            <button
              key={sport.name}
              className={`sport-btn ${selectedSports.includes(sport.name) ? "active" : ""}`}
              onClick={() => handleSportClick(sport.name)}
            >
              {sport.icon}
            </button>
          ))}
        </div>

        <div className="date-time-container">
          <div className="time-picker">
            <label>เวลาเปิด</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          <div className="time-picker">
            <label>เวลาปิด</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>

          <div className="booking-status">
            <label>
              <input
                type="radio"
                name="booking"
                value="available"
                checked={selectedStatus === "จองได้"}
                onChange={() => setSelectedStatus("จองได้")}
              />
              จองได้
            </label>
            <label>
              <input
                type="radio"
                name="booking"
                value="all"
                checked={selectedStatus === "แสดงทั้งหมด"}
                onChange={() => setSelectedStatus("แสดงทั้งหมด")}
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
