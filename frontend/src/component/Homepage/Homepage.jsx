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

  const handleSportSelection = (sport) => {
    setSelectedSports((prevSports) => {
      if (prevSports.includes(sport)) {
        return prevSports.filter((s) => s !== sport);
      } else {
        return [...prevSports, sport];
      }
    });
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

      const queryString = queryParams.length ? `?${queryParams.join("&")}` : "";

      const res = await axios.get(`http://localhost:4000/api/arenas/filteredArenas${queryString}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // ✅ เรียงลำดับสนามตามระยะห่าง
      const sortedArenas = res.data.sort((a, b) => a.distance - b.distance);

      setArenas(sortedArenas);
    } catch (error) {
      console.error("❌ Error searching arenas:", error);
    }
  };

  // ✅ โหลดสนามทั้งหมดเมื่อหน้าเว็บโหลด
  useEffect(() => {
    handleSearch();
  }, []);


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
