import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./verifyowners.css";
import Swal from "sweetalert2";


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
    
            // ✅ ใช้ SweetAlert2 แจ้งเตือนสำเร็จ
            Swal.fire({
                icon: "success",
                title: "อนุมัติคำร้องสำเร็จ!",
                text: "✅ เจ้าของสนามได้รับการอนุมัติแล้ว",
                confirmButtonColor: "#16A34A"
            });
    
        } catch (error) {
            console.error("🚨 Error approving request:", error);
    
            // ❌ ใช้ SweetAlert2 แจ้งเตือนข้อผิดพลาด
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด!",
                text: "❌ ไม่สามารถอนุมัติคำร้องได้ กรุณาลองใหม่",
                confirmButtonColor: "#DC2626"
            });
        }
    };
    // ✅ ฟังก์ชันปฏิเสธคำร้อง
    const handleReject = async () => {
        if (!rejectReason.trim()) {
            // ❗ แจ้งเตือนถ้าไม่ได้กรอกเหตุผล
            Swal.fire({
                icon: "warning",
                title: "กรุณากรอกเหตุผล!",
                text: "❗ จำเป็นต้องระบุเหตุผลในการปฏิเสธคำร้อง",
                confirmButtonColor: "#FACC15"
            });
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
    
            // 🚫 ใช้ SweetAlert2 แจ้งเตือนเมื่อปฏิเสธสำเร็จ
            Swal.fire({
                icon: "success",
                title: "ปฏิเสธคำร้องสำเร็จ!",
                text: `🚫 คำร้องถูกปฏิเสธเรียบร้อย`,
                confirmButtonColor: "#16A34A"
            });
    
        } catch (error) {
            console.error("🚨 Error rejecting request:", error);
    
            // ❌ ใช้ SweetAlert2 แจ้งเตือนเมื่อเกิดข้อผิดพลาด
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด!",
                text: "❌ ไม่สามารถปฏิเสธคำร้องได้ กรุณาลองใหม่",
                confirmButtonColor: "#DC2626"
            });
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
                        <p><strong>ชื่อบัญชี: </strong> {selectedOwner.accountName}</p>
                        <p><strong>ธนาคาร: </strong> {selectedOwner.bank}</p>
                        <p><strong>เลขบัญชี: </strong> {selectedOwner.accountNumber}</p>
                        <p><strong>เจ้าของสนาม: </strong> 
                            {selectedOwner.businessOwnerId
                                ? `${selectedOwner.businessOwnerId.firstName} ${selectedOwner.businessOwnerId.lastName}`
                                : "ไม่ระบุ"}
                        </p>
                        <p><strong>เลขบัตรประชาชน:</strong> {selectedOwner.businessOwnerId?.idCard || "ไม่มีข้อมูล"}</p>
                        <p><strong>Email:</strong> {selectedOwner.businessOwnerId?.email || "ไม่ระบุ"}</p>
                        <div>
                            <div className="verify-img-container">
                                
                                {/* รูปถ่ายหนังสือจดทะเบียน */}
                                {selectedOwner.images?.registration && (
                                    <div className="verify-img-box">
                                        <p><strong>รูปถ่ายหนังสือจดทะเบียน</strong></p>
                                        <a href={selectedOwner.images.registration} target="_blank" rel="noopener noreferrer">
                                            <img src={selectedOwner.images.registration} alt="Registration Document" />
                                        </a>
                                    </div>
                                )}

                                {/* รูปถ่ายบัตรประชาชน */}
                                {selectedOwner.images?.idCard && (
                                    <div className="verify-img-box">
                                        <p><strong>รูปถ่ายบัตรประชาชน</strong></p>
                                        <a href={selectedOwner.images.idCard} target="_blank" rel="noopener noreferrer">
                                            <img src={selectedOwner.images.idCard} alt="ID Card" />
                                        </a>
                                    </div>
                                )}

                                {/* รูปถ่ายของผู้ถือบัตรประชาชน */}
                                {selectedOwner.images?.idHolder && (
                                    <div className="verify-img-box">
                                        <p><strong>รูปถ่ายของผู้ถือบัตรประชาชน</strong></p>
                                        <a href={selectedOwner.images.idHolder} target="_blank" rel="noopener noreferrer">
                                            <img src={selectedOwner.images.idHolder} alt="Selfie with ID" />
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>




                        <div className="verify-button-group">
                            <button className="verify-button delete" onClick={() => setShowRejectPopup(true)}>ปฏิเสธ</button>
                            <button className="verify-button confirm" onClick={() => handleApprove(selectedOwner._id)}>ยืนยัน</button>
                        </div>

                    </div>
                ) : (
                    <p className="verify-empty">กรุณาเลือกเจ้าของสนามจากรายการทางซ้าย</p>
                )}
            </div>

            {showRejectPopup && (
                <div className="reject-popup-overlay">
                <div className="reject-popup-box">
                    <h3 className="reject-popup-title">กรุณาระบุเหตุผลในการปฏิเสธ</h3>
                    <textarea 
                        className="reject-popup-textarea" 
                        value={rejectReason} 
                        onChange={(e) => setRejectReason(e.target.value)} 
                        placeholder="กรอกเหตุผลที่นี่..."
                    />
                    <div className="reject-popup-buttons">
                        <button className="reject-popup-cancel" onClick={() => setShowRejectPopup(false)}>ยกเลิก</button>
                        <button className="reject-popup-confirm" onClick={handleReject}>ยืนยันปฏิเสธ</button>
                    </div>
                </div>
            </div>
            
            )}
        </div>
    );
};

export default VerifyOwnersPage;
