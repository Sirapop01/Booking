import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./verifyowners.css";

const API_URL = "http://localhost:4000/api/business-info-requests";

const VerifyOwnersPage = () => {
    const navigate = useNavigate();
    const [ownersData, setOwnersData] = useState([]);
    const [selectedOwner, setSelectedOwner] = useState(null);
    const [showRejectPopup, setShowRejectPopup] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    // ✅ ตรวจสอบสิทธิ์ Admin ก่อนโหลดข้อมูล
    useEffect(() => {
        const checkAdmin = () => {
            try {
                const token = localStorage.getItem("token") || sessionStorage.getItem("token");
                if (!token) throw new Error("❌ No Token Found");

                const decoded = jwtDecode(token);
                console.log("🔑 Decoded Token:", decoded);

                if (decoded.role === "admin" || decoded.role === "superadmin") {
                    setIsAdmin(true);
                } else {
                    throw new Error("❌ ไม่ใช่ Admin");
                }
            } catch (error) {
                console.error("🚨 Access Denied:", error.message);
                alert("❌ คุณไม่มีสิทธิ์เข้าถึงหน้านี้!");
                navigate("/");
            }
        };

        checkAdmin();
    }, [navigate]);

    // ✅ โหลดข้อมูลเมื่อเป็น Admin เท่านั้น
    useEffect(() => {
        if (!isAdmin) return;

        const fetchOwners = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem("token") || sessionStorage.getItem("token");

                const response = await fetch(`${API_URL}/pending`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!response.ok) throw new Error("Failed to fetch data");
                const data = await response.json();
                console.log("📡 ข้อมูลจาก API:", data); // ✅ Debug Data

                setOwnersData(data);
            } catch (error) {
                console.error("🚨 Error fetching business owners:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOwners();
    }, [isAdmin]);

    // ✅ ฟังก์ชันยืนยัน (อนุมัติ)
    const handleApprove = async (id) => {
        try {
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");

            const response = await fetch(`${API_URL}/approve/${id}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Failed to approve request");

            setOwnersData(prevData => prevData.filter(owner => owner._id !== id));
            setSelectedOwner(null);
            alert("✅ อนุมัติคำร้องสำเร็จ!");
        } catch (error) {
            console.error("🚨 Error approving request:", error);
            alert("❌ เกิดข้อผิดพลาดในการอนุมัติ");
        }
    };

    // ✅ ฟังก์ชันปฏิเสธคำร้อง
    const handleReject = async () => {
        if (!rejectReason.trim()) {
            alert("❗ กรุณากรอกเหตุผลในการปฏิเสธ");
            return;
        }

        try {
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");

            const response = await fetch(`${API_URL}/reject/${selectedOwner._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ reason: rejectReason })
            });

            if (!response.ok) throw new Error("Failed to reject request");

            setOwnersData(prevData => prevData.filter(owner => owner._id !== selectedOwner._id));
            setSelectedOwner(null);
            setShowRejectPopup(false);
            alert("🚫 ปฏิเสธคำร้องสำเร็จ!");
        } catch (error) {
            console.error("🚨 Error rejecting request:", error);
            alert("❌ เกิดข้อผิดพลาดในการปฏิเสธคำร้อง");
        }
    };

    if (!isAdmin) return null;

    return (
        <div className="verify-container">
            <div className="verify-sidebar">
                <h2 className="verify-sidebar-title">บัญชีเจ้าของสนาม</h2>
                {isLoading ? (
                    <p>กำลังโหลดข้อมูล...</p>
                ) : ownersData.length > 0 ? (
                    <ul className="verify-list">
                        {ownersData.map((owner) => (
                            <li
                                key={owner._id}
                                onClick={() => setSelectedOwner(owner)}
                                className={`verify-list-item ${selectedOwner?._id === owner._id ? "active" : ""}`}
                            >
                                {owner.accountName}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="verify-empty">ไม่มีคำร้องขอในขณะนี้</p>
                )}
            </div>

            <div className="verify-content">
                <h2 className="verify-content-title">รายละเอียด</h2>
                {selectedOwner ? (
                    <div className="verify-details">
                        <p><strong>ชื่อบัญชี:</strong> {selectedOwner.accountName}</p>
                        <p><strong>ธนาคาร:</strong> {selectedOwner.bank}</p>
                        <p><strong>เลขบัญชี:</strong> {selectedOwner.accountNumber}</p>
                        <p><strong>เจ้าของสนาม:</strong> 
                            {selectedOwner.businessOwnerId
                                ? `${selectedOwner.businessOwnerId.firstName} ${selectedOwner.businessOwnerId.lastName}`
                                : "ไม่ระบุ"}
                        </p>
                        <p><strong>เลขบัตรประชาชน:</strong> {selectedOwner.businessOwnerId?.idCard || "ไม่มีข้อมูล"}</p>
                        <p><strong>Email:</strong> {selectedOwner.businessOwnerId?.email || "ไม่ระบุ"}</p>
                        <div>
                          <p><strong>หนังสือจดทะเบียน:</strong></p>
                          <div className="verify-doc-box">
                            {selectedOwner.images?.registration ? (
                              <a href={selectedOwner.images.registration} target="_blank" rel="noopener noreferrer">
                                <img src={selectedOwner.images.registration} alt="Registration Document" />
                              </a>
                            ) : (
                              <p>ไม่มีเอกสาร</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <p><strong>บัตรประชาชน:</strong></p>
                          <div className="verify-img-box">
                            {selectedOwner.images?.idCard ? (
                              <a href={selectedOwner.images.idCard} target="_blank" rel="noopener noreferrer">
                              <img src={selectedOwner.images.idCard} alt="ID Card" />
                              </a>
                            ) : (
                              <p>ไม่มีรูปบัตรประชาชน</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <p><strong>รูปถ่ายคู่กับบัตรประชาชน:</strong></p>
                          <div className="verify-img-box">
                            {selectedOwner.images?.idHolder ? (
                              <a href={selectedOwner.images.idHolder} target="_blank" rel="noopener noreferrer">
                              <img src={selectedOwner.images.idHolder} alt="Selfie with ID" />
                              </a>
                            ) : (
                              <p>ไม่มีรูปถ่ายคู่กับบัตรประชาชน</p>
                            )}
                          </div>
                        </div>

                        <button className="verify-button delete" onClick={() => setShowRejectPopup(true)}>ปฏิเสธ</button>
                        <button className="verify-button confirm" onClick={() => handleApprove(selectedOwner._id)}>ยืนยัน</button>
                    </div>
                ) : (
                    <p className="verify-empty">กรุณาเลือกเจ้าของสนามจากรายการทางซ้าย</p>
                )}
            </div>

            {showRejectPopup && (
                <div className="verify-popup-overlay">
                    <div className="verify-popup-box">
                        <h3>กรุณาระบุเหตุผลในการปฏิเสธ</h3>
                        <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="กรอกเหตุผลที่นี่..." />
                        <button onClick={() => setShowRejectPopup(false)}>ยกเลิก</button>
                        <button onClick={handleReject}>ยืนยันปฏิเสธ</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VerifyOwnersPage;
