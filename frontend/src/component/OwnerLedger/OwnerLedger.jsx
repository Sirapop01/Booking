import React, { useState } from "react";
import "./OwnerLedger.css";
import homeLogo from "../assets/logoalt.png";

const OwnerLedger = () => {
  const [selectedStadium, setSelectedStadium] = useState("Wichai Arena");
  const [ledgerData, setLedgerData] = useState([
    { date: "xx/xx/xxxx | xx:xx", sport: "BasketBall", location: "Arena1", amount: 240 },
    { date: "xx/xx/xxxx | xx:xx", sport: "Badminton", location: "Court x2", amount: 160 },
    { date: "xx/xx/xxxx | xx:xx", sport: "Badminton", location: "Court1", amount: 80 },
  ]);

  const handleDelete = () => {
    setLedgerData([]);
  };

  return (
    <div className="ledger-container">
      {/* ✅ ปุ่มกลับไปยังหน้า Home */}
      <a href="/" className="home-button">
          <img src={homeLogo} alt="Home Logo" className="home-logo" />
      </a>
  
      <div className="stadium-list">
        <h2>สนาม</h2>
        <ul>
          <li className={selectedStadium === "Wichai Arena" ? "selected" : ""} onClick={() => setSelectedStadium("Wichai Arena")}>
            Wichai Arena
          </li>
          <li className={selectedStadium === "Sophia Arena" ? "selected" : ""} onClick={() => setSelectedStadium("Sophia Arena")}>
            Sophia Arena
          </li>
        </ul>
      </div>
      <div className="ledger-details">
        <h2>บัญชีรายการรับ</h2>
        <table>
          <thead>
            <tr>
              <th>วัน/เวลา</th>
              <th>ลิสต์ (ล่าสุด)</th>
              <th>ยอดเงิน</th>
              <th>เรียกเก็บ 10%</th>
              <th>รวม</th>
            </tr>
          </thead>
          <tbody>
            {ledgerData.map((entry, index) => (
              <tr key={index}>
                <td>{entry.date}</td>
                <td>{entry.sport} - {entry.location}</td>
                <td>{entry.amount} $</td>
                <td>{(entry.amount * 0.1).toFixed(2)} $</td>
                <td>{(entry.amount * 0.9).toFixed(2)} $</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="ledger-actions">
          <button className="delete-button" onClick={handleDelete}>ลบที่เลือก</button>
          <button className="add-button">เพิ่ม</button>
          <div className="total-box">Total: {ledgerData.reduce((acc, entry) => acc + entry.amount * 0.9, 0).toFixed(2)} $</div>
          <button className="manage-button">การจัดการ</button>
        </div>
      </div>
    </div>
  );
};

export default OwnerLedger;
