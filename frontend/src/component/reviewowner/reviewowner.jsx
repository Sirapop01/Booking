import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import { FaStar } from "react-icons/fa";
import "./reviewowner.css";
import Navbar from "../Navbar/Navbar";

const API_URL = "http://localhost:4000/api"; // ✅ URL Backend

const ReviewOwner = () => {
  const { ownerId } = useParams();
  const [reviews, setReviews] = useState({});
  const [filteredReviews, setFilteredReviews] = useState({});
  const [selectedRating, setSelectedRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const reviewRef = useRef(null);

  console.log("📌 ownerId:", ownerId);

  useEffect(() => {
    if (ownerId) {
      fetchOwnerReviews();
    }
  }, [ownerId]);

  useEffect(() => {
    if (!isLoading && reviewRef.current) {
      reviewRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isLoading]);

  const fetchOwnerReviews = async () => {
    try {
      setIsLoading(true);
      console.log("📡 Fetching owner reviews from:", `${API_URL}/reviews/owner/${ownerId}`);

      const response = await axios.get(`${API_URL}/reviews/owner/${ownerId}`);
      console.log("📌 Owner Reviews Data:", response.data);

      if (response.data.length > 0) {
        const groupedReviews = response.data.reduce((acc, review) => {
          const stadiumId = review.stadiumId?._id;
          const stadiumName = review.stadiumId?.fieldName || "";

          // ✅ ถ้าไม่มีชื่อสนาม ให้ข้ามไป
          if (!stadiumName.trim()) return acc;

          if (!acc[stadiumId]) {
            acc[stadiumId] = { stadiumName, reviews: [] };
          }
          acc[stadiumId].reviews.push(review);

          return acc;
        }, {});

        setReviews(groupedReviews);
        setFilteredReviews(groupedReviews);
      }
    } catch (error) {
      console.error("🚨 Error fetching owner reviews:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filterReviewsByRating = (rating) => {
    setSelectedRating(rating);

    if (rating === 0) {
      setFilteredReviews(reviews);
      return;
    }

    const newFilteredReviews = Object.keys(reviews).reduce((acc, stadiumId) => {
      const stadiumName = reviews[stadiumId].stadiumName;
      const filtered = reviews[stadiumId].reviews.filter((review) => review.rating === rating);

      if (filtered.length > 0) {
        acc[stadiumId] = { stadiumName, reviews: filtered };
      }

      return acc;
    }, {});

    setFilteredReviews(newFilteredReviews);
  };

  const reviewSliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
  };

  return (
    <div className="review-owner-container">
      <Navbar />
      <h1>🏟️ รีวิวสนามของฉัน</h1>

      <div className="review-filter">
        <button className={selectedRating === 0 ? "active" : ""} onClick={() => filterReviewsByRating(0)}>
           ทั้งหมด
        </button>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={selectedRating === star ? "active" : ""}
            onClick={() => filterReviewsByRating(star)}
          >
            {[...Array(star)].map((_, index) => (
              <FaStar key={index} className="star-filter" />
            ))}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p>⏳ กำลังโหลดข้อมูล...</p>
      ) : Object.keys(filteredReviews).length > 0 ? (
        <div>
          {Object.keys(filteredReviews).map((stadiumId) => {
            const { stadiumName, reviews: stadiumReviews } = filteredReviews[stadiumId];

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
        <p className="review-no-reviews">❌ ยังไม่ได้รับรีวิว</p>
      )}
    </div>
  );
};

export default ReviewOwner;
