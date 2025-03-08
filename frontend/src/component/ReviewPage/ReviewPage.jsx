import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ReviewPage.css"; // ✅ ไฟล์ CSS

const API_URL = "http://localhost:4000/api"; // ✅ URL Backend

const ReviewPage = () => {
    const [stadiums, setStadiums] = useState([]); // ⛳ รายการสนามที่ลูกค้าเคยใช้
    const [selectedStadium, setSelectedStadium] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchStadiums();
    }, []);

    // ✅ ดึงรายการสนามที่ลูกค้าเคยใช้บริการ
    const fetchStadiums = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");
            const response = await axios.get(`${API_URL}/user/stadiums-used`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStadiums(response.data);
        } catch (error) {
            console.error("🚨 Error fetching stadiums:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ ฟังก์ชันส่งรีวิว
    const submitReview = async () => {
        if (!selectedStadium || rating === 0 || comment.trim() === "") {
            alert("❗ กรุณาเลือกสนาม, ให้คะแนน และพิมพ์ความคิดเห็นก่อนส่ง");
            return;
        }

        try {
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");
            const reviewData = { stadiumId: selectedStadium._id, rating, comment };

            await axios.post(`${API_URL}/reviews`, reviewData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage("✅ รีวิวถูกส่งเรียบร้อย!");
            setTimeout(() => setMessage(""), 3000); // ✅ ซ่อนข้อความหลัง 3 วินาที

            setSelectedStadium(null);
            setRating(0);
            setComment("");
        } catch (error) {
            console.error("🚨 Error submitting review:", error);
            alert("❌ ไม่สามารถส่งรีวิวได้");
        }
    };

    return (
        <div className="review-container">
            <h1>🏟️ รีวิวสนามที่เคยใช้บริการ</h1>

            {isLoading ? (
                <p>⏳ กำลังโหลดข้อมูล...</p>
            ) : (
                <div className="stadium-list">
                    {stadiums.length > 0 ? (
                        stadiums.map((stadium) => (
                            <button
                                key={stadium._id}
                                className={`stadium-item ${selectedStadium?._id === stadium._id ? "selected" : ""}`}
                                onClick={() => setSelectedStadium(stadium)}
                            >
                                {stadium.fieldName}
                            </button>
                        ))
                    ) : (
                        <p>⛔ คุณยังไม่เคยใช้บริการสนามใด</p>
                    )}
                </div>
            )}

            {selectedStadium && (
                <div className="review-form">
                    <h2>รีวิวสนาม: {selectedStadium.fieldName}</h2>

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
            )}

            {message && <div className="review-message">{message}</div>}
        </div>
    );
};

export default ReviewPage;
