import React, { useState, useEffect } from "react";
import "./verifyowners.css"; // ✅ นำเข้า CSS

const API_URL = "http://localhost:4000/api/business-info-requests"; // ✅ API URL

const VerifyOwnersPage = () => {
  const [ownersData, setOwnersData] = useState([]); // ✅ เก็บข้อมูลจาก MongoDB
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // ✅ โหลดข้อมูลจาก API เมื่อ component โหลดเสร็จ
  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setOwnersData(data);
      } catch (error) {
        console.error("🚨 Error fetching business owners:", error);
      }
    };

    fetchOwners();
  }, []);

  // ✅ ฟังก์ชันยืนยัน (อนุมัติ)
  const handleApprove = async (id) => {
    try {
      const response = await fetch(`${API_URL}/approve/${id}`, { method: "PUT" });
      if (!response.ok) throw new Error("Failed to approve request");

      setOwnersData(prevData => prevData.filter(owner => owner._id !== id));
      setSelectedOwner(null);
      alert("✅ อนุมัติคำร้องสำเร็จ!");
    } catch (error) {
      console.error("🚨 Error approving request:", error);
      alert("❌ เกิดข้อผิดพลาดในการอนุมัติ");
    }
  };

  // ✅ ฟังก์ชันเปิด Popup เพื่อให้ Admin กรอกเหตุผล
  const openRejectPopup = () => {
    setRejectReason(""); // ✅ รีเซ็ตค่าเมื่อเปิด Popup
    setShowRejectPopup(true);
  };

  // ✅ ฟังก์ชันปิด Popup
  const closeRejectPopup = () => {
    setShowRejectPopup(false);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
        alert("❗ กรุณากรอกเหตุผลในการปฏิเสธ");
        return;
    }

    try {
        console.log("📡 Sending Reject API Request:", selectedOwner._id, rejectReason); // ✅ Log ก่อนส่ง API

        const response = await fetch(`${API_URL}/reject/${selectedOwner._id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reason: rejectReason }), // ✅ ส่งเหตุผลไปที่ Backend
        });

        console.log("✅ API Response:", await response.json()); // ✅ Log Response จาก API

        if (!response.ok) throw new Error("Failed to reject request");

        setOwnersData(prevData => prevData.filter(owner => owner._id !== selectedOwner._id));
        setSelectedOwner(null);
        closeRejectPopup();
        alert("🚫 ปฏิเสธคำร้องสำเร็จ! เหตุผลถูกส่งไปยังเจ้าของสนาม");
    } catch (error) {
        console.error("🚨 Error rejecting request:", error);
        alert("❌ เกิดข้อผิดพลาดในการปฏิเสธคำร้อง");
    }
};


  return (
    <div className="verify-container">
      {/* Sidebar */}
      <div className="verify-sidebar">
        <h2 className="verify-sidebar-title">บัญชีเจ้าของสนาม</h2>
        {ownersData.length > 0 ? (
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

      {/* Main Content */}
      <div className="verify-content">
        <h2 className="verify-content-title">รายละเอียด</h2>
        {selectedOwner ? (
          <div className="verify-details">
            <p><strong>ชื่อบัญชี:</strong> {selectedOwner.accountName}</p>
            <p><strong>ธนาคาร:</strong> {selectedOwner.bank}</p>
            <p><strong>เลขบัญชี:</strong> {selectedOwner.accountNumber}</p>
            <p><strong>เจ้าของสนาม:</strong> {selectedOwner.businessOwnerId?.name || "ไม่ระบุ"}</p>

            {/* เอกสารและรูปภาพ */}
            <div>
              <p><strong>หนังสือจดทะเบียน:</strong></p>
              <div className="verify-doc-box">
                <a href={selectedOwner.images?.registration} target="_blank" rel="noopener noreferrer">
                  เปิดเอกสาร
                </a>
              </div>
            </div>

            <div>
              <p><strong>บัตรประชาชน:</strong></p>
              <div className="verify-img-box">
                <img src={selectedOwner.images?.idCard} alt="ID Card" />
              </div>
            </div>

            <div>
              <p><strong>รูปถ่ายคู่กับบัตรประชาชน:</strong></p>
              <div className="verify-img-box">
                <img src={selectedOwner.images?.idHolder} alt="Selfie with ID" />
              </div>
            </div>

            {/* ปุ่ม */}
            <div className="verify-button-group">
              <button className="verify-button delete" onClick={openRejectPopup}>ปฏิเสธ</button>
              <button className="verify-button confirm" onClick={() => handleApprove(selectedOwner._id)}>ยืนยัน</button>
            </div>
          </div>
        ) : (
          <p className="verify-empty">กรุณาเลือกเจ้าของสนามจากรายการทางซ้าย</p>
        )}
      </div>

      {/* Popup สำหรับกรอกเหตุผลปฏิเสธ */}
      {showRejectPopup && (
        <div className="verify-popup-overlay">
          <div className="verify-popup-box">
            <h3>กรุณาระบุเหตุผลในการปฏิเสธ</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="กรอกเหตุผลที่นี่..."
              className="verify-popup-textarea"
            />
            <div className="verify-popup-buttons">
              <button className="verify-popup-cancel" onClick={closeRejectPopup}>ยกเลิก</button>
              <button className="verify-popup-confirm" onClick={handleReject}>ยืนยันปฏิเสธ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyOwnersPage;
