import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BookingArena.css";
import { FaHeart } from "react-icons/fa"; // ✅ เพิ่มไอคอนหัวใจ
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import Navbar from '../Navbar/Navbar';
import Slider from "react-slick";

const BookingArena = () => {
  const { id } = useParams(); // รับ arenaId จาก URL
  const navigate = useNavigate();
  const [arena, setArena] = useState(null);
  const [sports, setSports] = useState([]);
  const [subStadiums, setSubStadiums] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedSubStadiums, setSelectedSubStadiums] = useState([]); // เก็บสนามย่อยที่ถูกเลือก
  const [isFavorite, setIsFavorite] = useState(false); // ✅ เช็คว่าสนามเป็นรายการโปรดหรือไม่
  const [userId, setUserId] = useState(null); // ✅ กำหนดค่า userId
  const [reviews, setReviews] = useState([]);
  const imageCount = arena?.images?.length || 0;
  const API_URL = "http://localhost:4000/api";

  const settings = {
    dots: true, // Show navigation dots
    infinite: true, // Infinite scroll
    speed: 500,
    slidesToShow: 1, // Show 1 image at a time
    slidesToScroll: 1, // Scroll 1 image at a time
    autoplay: true, // Auto slide images
    autoplaySpeed: 2000, 
  };

  const reviewSettings = {
    dots: true,            // ✅ แสดงจุดนำทาง
    infinite: true,        // ✅ เลื่อนไปเรื่อย ๆ
    speed: 500,            // ✅ ความเร็วในการเลื่อน
    slidesToShow: 2,       // ✅ แสดง 2 รีวิวต่อครั้ง (ปรับได้)
    slidesToScroll: 1,     // ✅ เลื่อนทีละ 1 รีวิว
    autoplay: true,        // ✅ เลื่อนอัตโนมัติ
    autoplaySpeed: 3000,   // ✅ ความเร็วการเปลี่ยนรีวิว (3 วินาที)
    adaptiveHeight: true,  // ✅ ปรับความสูงตามเนื้อหา
  };
  


  useEffect(() => {
    const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (storedToken) {
        try {
            const decoded = jwtDecode(storedToken);
            console.log("✅ Token Decoded:", decoded); // 🔍 ตรวจสอบค่า Token
            setUserId(decoded.id); // 🔥 เปลี่ยนจาก `userId` เป็น `id`
        } catch (error) {
            console.error("⚠️ Error decoding token:", error);
        }
    }
}, []);

useEffect(() => {
  axios.get(`${API_URL}/arenas/getArenaById/${id}`)
      .then((response) => {
          setArena(response.data);
          setLoading(false);
      })
      .catch((error) => {
          console.error("Error fetching arena data:", error);
          setLoading(false);
      });

  // ✅ ดึงรีวิวของสนาม
  axios.get(`${API_URL}/reviews/${id}`)
      .then((response) => {
          setReviews(response.data.reviews || []);
      })
      .catch((error) => console.error("Error fetching reviews:", error));
}, [id]);

useEffect(() => {
  const fetchReviews = async () => {
    try {
      setReviews([]); // ✅ เคลียร์รีวิวก่อนโหลดใหม่
      const response = await axios.get(`${API_URL}/reviews/${id}`);
      console.log("📌 Reviews Loaded:", response.data.reviews); // ✅ ตรวจสอบ API Response

      // ✅ กรองข้อมูลไม่ให้ซ้ำ
      const uniqueReviews = response.data.reviews.filter((v, i, a) => 
        a.findIndex(t => (t._id === v._id)) === i
      );

      setReviews(uniqueReviews || []);
    } catch (error) {
      console.error("🚨 Error fetching reviews:", error);
    }
  };

  fetchReviews();
}, [id]); 




useEffect(() => {
  axios.get(`http://localhost:4000/api/arenas/getArenaById/${id}`)
      .then((response) => {
          console.log("✅ Loaded arena data:", response.data);
          setArena(response.data);
      })
      .catch((error) => console.error("Error fetching arena data:", error));
}, [id]);


  useEffect(() => {
    axios.get(`http://localhost:4000/api/sports/${id}`)
      .then((response) => setSports(response.data))
      .catch((error) => console.error("Error fetching sports categories:", error));
  }, [id]);

  useEffect(() => {
    if (sports.length > 0) {
      const fetchSubStadiums = async () => {
        let groupedSubStadiums = {};
        for (const sport of sports) {
          try {
            const response = await axios.get(`http://localhost:4000/api/substadiums/${id}/${sport._id}`);
            groupedSubStadiums[sport.sportName] = response.data;
          } catch (error) {
            console.error(`Error fetching sub-stadiums for sport ${sport.sportName}:`, error);
          }
        }
        setSubStadiums(groupedSubStadiums);
        setLoading(false);
      };
      fetchSubStadiums();
    } else {
      setLoading(false);
    }
  }, [sports, id]);

  useEffect(() => {
    if (userId) {
        axios.get(`http://localhost:4000/api/favoritearena/check/${id}?userId=${userId}`)
            .then((response) => {
                setIsFavorite(response.data.isFavorite);
            })
            .catch((error) => console.error("❌ Error checking favorite status:", error));
    }
}, [userId, id]);



const toggleFavorite = async () => {
  try {
    if (!userId) {
      Swal.fire({
        title: "กรุณาเข้าสู่ระบบ!",
        text: "กรุณาเข้าสู่ระบบก่อนเพิ่มหรือยกเลิกรายการโปรด",
        icon: "warning",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    console.log("📌 Sending data:", { userId, stadiumId: id });

    if (isFavorite) {
      // 🔽 ลบออกจากรายการโปรด
      await axios.delete(`http://localhost:4000/api/favoritearena/${id}`, {
        data: { userId },
      });

      setIsFavorite(false);

      // ✅ แจ้งเตือนเมื่อ "ลบรายการโปรด" สำเร็จ
      Swal.fire({
        title: "ลบรายการโปรดสำเร็จ!",
        text: "คุณได้ลบสนามออกจากรายการโปรดแล้ว",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "ตกลง",
      });
    } else {
      // 🔽 เพิ่มเข้าในรายการโปรด
      await axios.post("http://localhost:4000/api/favoritearena", 
        { userId, stadiumId: id },
        { headers: { "Content-Type": "application/json" } }
      );

      setIsFavorite(true);

      // ✅ แจ้งเตือนเมื่อ "เพิ่มในรายการโปรด" สำเร็จ
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

    // ✅ แจ้งเตือนเมื่อเกิดข้อผิดพลาด
    Swal.fire({
      title: "เกิดข้อผิดพลาด!",
      text: "ไม่สามารถเพิ่ม/ลบ รายการโปรดได้",
      icon: "error",
      confirmButtonColor: "#d33",
      confirmButtonText: "ตกลง",
    });
  }
};



const toggleSubStadiumSelection = (subStadiumId) => {
  setSelectedSubStadiums((prev) => {
      const isSelected = prev.some((sub) => sub._id === subStadiumId);

      if (isSelected) {
          return prev.filter((sub) => sub._id !== subStadiumId);
      } else {
          const sportKey = Object.keys(subStadiums).find((sport) =>
              subStadiums[sport].some((sub) => sub._id === subStadiumId)
          );
          const subStadium = subStadiums[sportKey]?.find((sub) => sub._id === subStadiumId);

          if (!subStadium) return prev;

          console.log("📌 ข้อมูลสนามย่อยที่เลือก:", subStadium); // Debug เช็คค่าที่ดึงมา

          return [
              ...prev,
              {
                  _id: subStadium._id,
                  name: subStadium.name || "ไม่มีชื่อ",
                  arenaId: subStadium.arenaId || "ไม่พบข้อมูล",
                  ownerId: subStadium.owner_id || "ไม่พบข้อมูล",
                  sportName: sportKey || "ไม่ระบุ",
                  images: subStadium.images || [],
                  price: subStadium.price || "ไม่มีราคา",
              },
          ];
      }
  });
};





const handleBooking = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  if (!token) {
      Swal.fire("⚠ กรุณาเข้าสู่ระบบก่อนทำการจอง", "", "warning");
      return;
  }

  try {
      const decodedToken = JSON.parse(atob(token.split(".")[1])); 
      const userId = decodedToken?.id; 

      if (!userId) {
          Swal.fire("⚠ ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่", "", "warning");
          return;
      }

      if (selectedSubStadiums.length > 0) {
          console.log("📌 ข้อมูลที่จะส่งไปหน้า Booking:", selectedSubStadiums); // Debug

          // ✅ ตรวจสอบว่าทุกสนามย่อยมี name และ price
          const hasInvalidData = selectedSubStadiums.some(sub => !sub.name || !sub.price);
          if (hasInvalidData) {
              Swal.fire("⚠ ข้อมูลสนามไม่สมบูรณ์", "บางสนามไม่มีชื่อหรือราคา กรุณาเลือกใหม่", "warning");
              return;
          }

          navigate(`/booking`, { state: { selectedSubStadiums, userId } });
      } else {
          Swal.fire({
              title: "กรุณาเลือกสนาม!",
              text: "เลือกสนามก่อนทำการจอง",
              icon: "warning",
              confirmButtonText: "ตกลง",
          });
      }
  } catch (error) {
      console.error("❌ Error decoding token:", error);
      Swal.fire("❌ Token ไม่ถูกต้อง กรุณาเข้าสู่ระบบใหม่", "", "error");
  }
};



  if (loading) return <div className="loading-text">กำลังโหลดข้อมูล...</div>;
  if (!arena) return <div className="loading-text">ไม่พบข้อมูลสนามกีฬา</div>;

  return (
    <>
      {/* ✅ เพิ่ม Navbar */}
      <Navbar />

      <div className="booking-arena-container">
        <div className="arena-card">
          <div className="main-image-container">
            {imageCount > 1 ? ( // ตรวจสอบจำนวนรูป
              <Slider {...settings}>
                {arena.images.map((image, index) => (
                  <div key={index}>
                    <img
                      src={image}
                      alt={arena.fieldName}
                      className="main-image"
                    />
                  </div>
                ))}
              </Slider>
            ) : (
              <img
                src={arena.images[0] || "https://via.placeholder.com/400"}
                alt={arena.fieldName}
                className="main-image"
              />
            )}
          </div>

          <div className="arena-info-container">
            <div className="arena-left-section">
              {/* ✅ เพิ่มสถานะของสนามข้างๆชื่อสนาม */}
              <h2 className="arena-title">
                {arena.fieldName} 
                <span className={`status-badge ${arena.open ? "open" : "closed"}`}>
                  {arena.open ? "✅ เปิดให้จอง" : "❌ ปิดชั่วคราว"}
                </span>
                <div className="favorite-container78">
                  <FaHeart
                    className={`heart-icon ${isFavorite ? "liked" : ""}`}
                    onClick={toggleFavorite} 
                    style={{ color: isFavorite ? "red" : "gray", cursor: "pointer" }}
                  />
                  <span className="favorite-text78">
                    {isFavorite ? "เพิ่มลงรายการโปรดแล้ว" : "เพิ่มในรายการโปรด"}
                  </span>
                </div>
              </h2>
               {/* ✅ ส่วนแสดงรีวิวของลูกค้า */}
            {/* ✅ ส่วนแสดงรีวิวของลูกค้าแบบเลื่อนอัตโนมัติ */}
            <h3>รีวิวจากลูกค้า</h3>
{reviews.length > 0 ? (
  <Slider {...reviewSettings}>  {/* ✅ ใช้ Slider */}
    {reviews.map((review) => (
      <div key={review._id} className="review-item">
        <p><strong>{review.userId?.firstName || "ไม่ทราบชื่อ"} {review.userId?.lastName || ""}</strong></p>
        <p>⭐ {review.rating}</p>
        <p>{review.comment}</p>
      </div>
    ))}
  </Slider>
) : (
  <p>❌ ยังไม่มีรีวิว</p>
)}


              <div className="google-map-box">
                {arena.location?.coordinates?.length === 2 && (
                  <iframe
                    src={`https://www.google.com/maps?q=${arena.location.coordinates[1]},${arena.location.coordinates[0]}&z=14&output=embed`}
                    title="Google Maps"
                    className="google-map"
                    allowFullScreen
                    loading="lazy"
                  />
                )}
              </div>

              <div className="amenities-section">
                <h3>สิ่งอำนวยความสะดวก</h3>
                <div className="amenities-list">
                  {arena.amenities.map((item, index) => (
                    <span key={index} className="amenity-item">✅ {item}</span>
                  ))}
                </div>
              </div>

              <div className="booking-conditions">
                <h3>เงื่อนไขการจอง</h3>
                <p>เวลาเปิดทำการ: {arena.startTime} - {arena.endTime}</p>
                <p>{arena.additionalInfo}</p>
              </div>
            </div>

            {/* กลุ่มของสนามย่อย */}
            <div className="grouped-sub-stadiums">
              {Object.entries(subStadiums).length > 0 ? (
                Object.entries(subStadiums).map(([sportName, stadiums]) => (
                  <div key={sportName} className="sport-group">
                    <h3 className="sport-title">{sportName}</h3>
                    <div className="sub-stadium-row">
                      {stadiums.map((sub) => (
                        <button
                        key={sub._id}
                        className={`sub-stadium-button ${selectedSubStadiums.some(s => s._id === sub._id) ? "selected" : ""}`}
                        onClick={() => toggleSubStadiumSelection(sub._id)}
                      >
                        {/* รูปภาพของสนามย่อย */}
                        <img src={sub.images.length > 0 ? sub.images[0] : "https://via.placeholder.com/150"} alt={sub.name} />
                      
                        {/* ชื่อสนามย่อย */}
                        <p>{sub.name}</p>
                      
                        {/* เอฟเฟกต์เส้นขอบ */}
                        <svg viewBox="0 0 180 140">
                          <polyline points="1,1 179,1 179,139 1,139 1,1"/>
                        </svg>
                      </button>
                      
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p>ไม่มีสนามย่อยให้เลือก</p>
              )}
            </div>
          </div>

        {/* ปุ่มจอง */}
        <button className="booking101-button" onClick={handleBooking}>
          จองสนาม ({selectedSubStadiums.length})
        </button>
      </div>
      </div>
    </>
  );
};

export default BookingArena;
