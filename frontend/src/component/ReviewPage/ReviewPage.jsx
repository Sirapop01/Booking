import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ReviewPage.css";

const API_URL = "http://localhost:4000/api"; // ✅ URL Backend

const ReviewPage = () => {
    const { stadiumId } = useParams(); // ✅ ดึง stadiumId จาก URL
    const [stadium, setStadium] = useState(null);
    const [reviews, setReviews] = useState([]); // ✅ เก็บข้อมูลรีวิว
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState("");
    const reviewRef = useRef(null); // ✅ ใช้ Ref เพื่อเลื่อนลงไปที่กล่องรีวิวอัตโนมัติ

    console.log("📌 stadiumId:", stadiumId);

    useEffect(() => {
        if (stadiumId) {
            fetchStadiumReviews();
        }
    }, [stadiumId]);

    useEffect(() => {
        if (!isLoading && reviewRef.current) {
            reviewRef.current.scrollIntoView({ behavior: "smooth" }); // ✅ เลื่อนลงไปที่กล่องรีวิวอัตโนมัติ
        }
    }, [isLoading]);

    // ✅ ดึงข้อมูลสนามและรีวิว
    const fetchStadiumReviews = async () => {
        try {
            setIsLoading(true);
            console.log("📡 Fetching stadium & reviews from:", `${API_URL}/reviews/${stadiumId}`);

            const response = await axios.get(`${API_URL}/reviews/${stadiumId}`);
            console.log("📌 Stadium & Reviews Data:", response.data);

            setStadium(response.data.stadium); // ✅ ดึงข้อมูลสนาม
            setReviews(response.data.reviews || []); // ✅ ดึงข้อมูลรีวิว
        } catch (error) {
            console.error("🚨 Error fetching stadium & reviews:", error.response?.data || error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const submitReview = async () => {
        if (!stadium || rating === 0 || comment.trim() === "") {
            alert("❗ กรุณาให้คะแนนและพิมพ์ความคิดเห็นก่อนส่ง");
            return;
        }
    
        try {
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");
            if (!token) {
                alert("❌ กรุณาเข้าสู่ระบบก่อนส่งรีวิว");
                return;
            }
    
            const reviewData = { stadiumId, rating, comment };
    
            await axios.post(`${API_URL}/reviews`, reviewData, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            setMessage("✅ รีวิวถูกส่งเรียบร้อย!");
            setTimeout(() => setMessage(""), 3000);
    
            // ✅ รีเซ็ตฟอร์ม
            setRating(0);
            setComment("");
    
            // ✅ โหลดรีวิวใหม่หลังจากรีวิวสำเร็จ
            fetchStadiumReviews();
        } catch (error) {
            console.error("🚨 Error submitting review:", error);
            alert(error.response?.data?.message || "❌ ไม่สามารถส่งรีวิวได้");
        }
    };
    
    

    return (
        <div className="review-container">
            <h1>🏟️ รีวิวสนาม</h1>
    
            {isLoading ? (
                <p>⏳ กำลังโหลดข้อมูล...</p>
            ) : stadium ? (
                <div>
                    {/* ✅ แสดงรูปภาพสนาม */}
                    <div className="stadium-image-container">
                        <img 
                            src={stadium.images?.length > 0 ? stadium.images[0] : "https://via.placeholder.com/300"}
                            alt={stadium.fieldName}
                            className="stadium-image"
                        />
                    </div>
    
                    <h2>{stadium.fieldName}</h2> {/* ✅ แสดงชื่อสนาม */}
                    <p><strong>เปิด:</strong> {stadium.startTime} - {stadium.endTime}</p> {/* ✅ เวลาเปิด-ปิด */}
    
                    {/* ✅ ใช้ Ref ตรงนี้เพื่อเลื่อนลงไปที่กล่องรีวิว */}
                    <div ref={reviewRef}></div>
    
                    <h3>รีวิวจากลูกค้า</h3>
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div key={review._id} className="review-item">
                                <p><strong>{review.userId?.firstName || "ไม่ทราบชื่อ"} {review.userId?.lastName || ""}</strong></p>
                                <p>⭐ {review.rating}</p>
                                <p>{review.comment}</p>
                            </div>
                        ))
                    ) : (
                        <p>❌ ยังไม่มีรีวิว</p>
                    )}
    
                    <div className="rating-section">
                        <p>⭐ ให้คะแนน:</p>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`star ${star <= rating ? "active" : ""}`}
                                onClick={() => setRating(star)}
                            >
                                ★
                            </span>
                        ))}
                    </div>
    
                    <textarea
                        placeholder="กรอกความคิดเห็นของคุณ..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    ></textarea>
    
                    <button className="submit-button" onClick={submitReview}>
                        ส่งรีวิว
                    </button>
                </div>
            ) : (
                <p>❌ ไม่พบข้อมูลสนาม</p>
            )}
    
            {message && <div className="review-message">{message}</div>}
        </div>
    );
    
};

export default ReviewPage;
