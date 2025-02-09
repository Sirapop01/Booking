import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminOwnersLedger.css";

const AdminOwnersLedger = () => {
  const [owners, setOwners] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch stadium owners from API
    axios.get("http://localhost:4000/api/business-owners")
      .then(response => {
        setOwners(response.data);
      })
      .catch(error => {
        console.error("Error fetching stadium owners:", error);
      });
  }, []);

  const filteredOwners = owners.filter(owner =>
    owner.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-stadium-container">
      <h1 className="page-title">ตรวจสอบรายการบัญชี</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 ค้นหาบัญชีเจ้าของสนาม"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        <div className="table-header">รายการบัญชีเจ้าของสนาม</div>
        {filteredOwners.length > 0 ? (
          filteredOwners.map((owner, index) => (
            <div key={index} className="table-row">
              <span className="owner-name">{owner.name}</span>
              <button className="check-button">ตรวจสอบ</button>
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
