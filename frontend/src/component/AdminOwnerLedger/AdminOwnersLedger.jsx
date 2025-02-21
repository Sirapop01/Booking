import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // ✅ ใช้สำหรับเปลี่ยนหน้า
import "./AdminOwnersLedger.css";
import homeLogo from "../assets/logoalt.png";

const AdminOwnersLedger = () => {
  const [owners, setOwners] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();  // ✅ ใช้สำหรับเปลี่ยนหน้า

  useEffect(() => {
    axios.get("http://localhost:4000/api/business-owners")
      .then(response => {
        console.log("Fetched Data:", response.data);
        setOwners(response.data);
      })
      .catch(error => {
        console.error("Error fetching business owners:", error);
      });
  }, []);

  const handleCheckLedger = (ownerId) => {
    navigate(`/OwnerLedgerDetail/${ownerId}`); // ✅ ส่ง ownerId ไปหน้า OwnerLedgerDetail
  };

  const filteredOwners = owners.filter(owner =>
    `${owner.firstName || ""} ${owner.lastName || ""}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-stadium-container">
      {/* 🔙 Home Button */}
      <a href="/" className="home-button">
        <img src={homeLogo} alt="Home Logo" className="home-logo" />
      </a>

      <h1 className="page-title">ตรวจสอบรายการบัญชี</h1>

      {/* 🔎 ค้นหาบัญชีเจ้าของสนาม */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 ค้นหาบัญชีเจ้าของสนาม"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 📋 รายการบัญชี */}
      <div className="table-container">
        <div className="table-header">รายการบัญชีเจ้าของสนาม</div>
        {filteredOwners.length > 0 ? (
          filteredOwners.map((owner) => (
            <div key={owner._id} className="table-row">
              <span className="owner-name">
                {owner.firstName && owner.lastName
                  ? `${owner.firstName} ${owner.lastName}`
                  : "ไม่มีข้อมูลชื่อ"}
              </span>
              <button className="check-button" onClick={() => handleCheckLedger(owner._id)}>
                ตรวจสอบ
              </button>
            </div>
          ))
        ) : (
          <div className="no-results">ไม่พบข้อมูล</div>
        )}
      </div>
    </div>
  );
};

export default AdminOwnersLedger;
