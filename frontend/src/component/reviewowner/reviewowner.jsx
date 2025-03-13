import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import { FaStar } from "react-icons/fa";
import Swal from "sweetalert2";
import "./reviewowner.css";

const API_URL = "http://localhost:4000/api"; // ✅ URL Backend

const ReviewOwner = () => {
  const { ownerId } = useParams(); // ✅ ดึง ownerId จาก URL
  const [reviews, setReviews] = useState([]); // ✅ เก็บข้อมูลรีวิว
  const [stadiumName, setStadiumName] = useState(""); // ✅ เก็บชื่อสนาม
  const [isLoading, setIsLoading] = useState(true);
  const reviewRef = useRef(null); // ✅ ใช้ Ref เพื่อเลื่อนลงไปที่กล่องรีวิวอัตโนมัติ

  console.log("📌 ownerId:", ownerId);

  useEffect(() => {
    if (ownerId) {
      fetchOwnerReviews();
    }
  }, [ownerId]);

  useEffect(() => {
    if (!isLoading && reviewRef.current) {
      reviewRef.current.scrollIntoView({ behavior: "smooth" }); // ✅ เลื่อนลงไปที่กล่องรีวิวอัตโนมัติ
    }
  }, [isLoading]);

  // ✅ ดึงข้อมูลรีวิวของเจ้าของสนาม
  const fetchOwnerReviews = async () => {
    try {
      setIsLoading(true);
      console.log("📡 Fetching owner reviews from:", `${API_URL}/reviews/owner/${ownerId}`);
  
      const response = await axios.get(`${API_URL}/reviews/owner/${ownerId}`);
      console.log("📌 Owner Reviews Data:", response.data);
  
      if (response.data.length > 0) {
        // ✅ จัดกลุ่มรีวิวตามสนาม
        const groupedReviews = response.data.reduce((acc, review) => {
          const stadiumId = review.stadiumId?._id;
          const stadiumName = review.stadiumId?.fieldName || "ไม่ทราบชื่อสนาม";
          
          if (!acc[stadiumId]) {
            acc[stadiumId] = { stadiumName, reviews: [] };
          }
          acc[stadiumId].reviews.push(review);
  
          return acc;
        }, {});
  
        setReviews(groupedReviews);
      }
    } catch (error) {
      console.error("🚨 Error fetching owner reviews:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  

  const reviewSliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
  };

  return (
    <div className="review-owner-container">
      <h1>🏟️ รีวิวสนามของฉัน</h1>
  
      {isLoading ? (
        <p>⏳ กำลังโหลดข้อมูล...</p>
      ) : Object.keys(reviews).length > 0 ? (
        <div>
          {Object.keys(reviews).map((stadiumId) => {
            const { stadiumName, reviews: stadiumReviews } = reviews[stadiumId];
  
            return (
              <div key={stadiumId} className="review-section">
                <h2 className="review-stadium-title">🏟️ {stadiumName}</h2>
                <Slider {...reviewSliderSettings} className="review-slider">
                  {stadiumReviews.map((review) => (
                    <div key={review._id} className="review-slide">
                      <p className="reviewowner-user">
                        <strong>{review.userId?.firstName || "ไม่ทราบชื่อ"} {review.userId?.lastName || ""}</strong>
                      </p>
                      <div className="review-owner-rating">
                        {[...Array(review.rating)].map((_, index) => (
                          <FaStar key={index} className="review-owner-star" />
                        ))}
                      </div>
                      <p className="review-comment">{review.comment}</p>
                      <span className="review-owner-date">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </Slider>
              </div>
            );
          })}
        </div>
      ) : (
        <p>❌ ยังไม่มีรีวิวสำหรับสนามของคุณ</p>
      )}
    </div>
  );
  
};

export default ReviewOwner;
