import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ReviewPage.css";
import Slider from "react-slick";
import Swal from "sweetalert2";

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
    if (!rating) { // ตรวจสอบว่าผู้ใช้ต้องให้คะแนนก่อน
        Swal.fire({
            title: "แจ้งเตือน",
            text: "กรุณาให้คะแนนก่อนส่งรีวิว",
            icon: "warning",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "ตกลง"
        });
        return;
    }

    try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
            Swal.fire({
                title: "แจ้งเตือน",
                text: "กรุณาเข้าสู่ระบบก่อนส่งรีวิว",
                icon: "error",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "ตกลง"
            });
            return;
        }

        const reviewData = { 
            stadiumId, 
            rating, 
            comment: comment.trim() || "" // ส่งค่า comment เป็น "" หากผู้ใช้ไม่พิมพ์อะไร
        };

        await axios.post(`${API_URL}/reviews`, reviewData, {
            headers: { Authorization: `Bearer ${token}` }
        });

        Swal.fire({
            title: "สำเร็จ",
            text: "รีวิวของคุณถูกส่งเรียบร้อย!",
            icon: "success",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "ตกลง"
        });

        // ✅ รีเซ็ตฟอร์ม
        setRating(0);
        setComment("");

        // ✅ โหลดรีวิวใหม่หลังจากรีวิวสำเร็จ
        fetchStadiumReviews();
    } catch (error) {
        console.error("🚨 Error submitting review:", error);
        Swal.fire({
            title: "เกิดข้อผิดพลาด",
            text: error.response?.data?.message || "❌ ไม่สามารถส่งรีวิวได้",
            icon: "error",
            confirmButtonColor: "#d33",
            confirmButtonText: "ตกลง"
        });
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
        <div className="review-page-container">
            <h1>🏟️ รีวิวสนาม</h1>

            {isLoading ? (
                <p>⏳ กำลังโหลดข้อมูล...</p>
            ) : stadium ? (
                <div>
                    {/* ✅ แสดงรูปภาพสนาม */}
                    <div className="review-stadium-image-container">
                        <img 
                            src={stadium.images?.length > 0 ? stadium.images[0] : "https://via.placeholder.com/300"}
                            alt={stadium.fieldName}
                            className="review-stadium-image"
                        />
                    </div>

                    <h2>{stadium.fieldName}</h2> 
                    <p><strong>เปิด:</strong> {stadium.startTime} - {stadium.endTime}</p>

                    <div ref={reviewRef}></div>

                    {/* ✅ Slider แสดงรีวิว */}
                    <h3 className="review-title">รีวิวจากลูกค้า</h3>
                    {reviews.length > 0 ? (
                        <Slider {...reviewSliderSettings} className="review-slider">
                            {reviews.map((review) => (
                                <div key={review._id} className="review-slide">
                                    <p className="review-user">
                                        <strong>{review.userId?.firstName || "ไม่ทราบชื่อ"} {review.userId?.lastName || ""}</strong>
                                    </p>
                                    <p className="review-rating">⭐ {review.rating}</p>
                                    <p className="review-comment">{review.comment}</p>
                                </div>
                            ))}
                        </Slider>
                    ) : (
                        <p>❌ ยังไม่มีรีวิว</p>
                    )}

                    {/* ✅ กล่องรีวิว */}
                    <div className="review-rating-section">
                        <p>⭐ ให้คะแนน:</p>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`review-star ${star <= rating ? "active" : ""}`}
                                onClick={() => setRating(star)}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <div className="review-form-container">
                    <textarea
                        className="review-textarea"
                        placeholder="กรอกความคิดเห็นของคุณ..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    ></textarea>

                    <button className="review-submit-button" onClick={submitReview}>
                        ส่งรีวิว
                    </button>
                    </div>
                </div>
            ) : (
                <p>❌ ไม่พบข้อมูลสนาม</p>
            )}

            {message && <div className="review-message">{message}</div>}
        </div>
    );
};

export default ReviewPage;
