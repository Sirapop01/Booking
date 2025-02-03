import React, { useState } from "react";
import "./OwnerLedger.css";
import homeLogo from "../assets/logoalt.png";
import filterIcon from "../assets/icons/filter.png"; // ✅ ใช้ไอคอน Filter

const OwnerLedger = () => {
  const [selectedStadium, setSelectedStadium] = useState("Wichai Arena");
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(""); // ✅ เก็บค่าของเดือนที่เลือก
  const [showDropdown, setShowDropdown] = useState(false); // ✅ ควบคุมการแสดง Dropdown

  const [ledgerData, setLedgerData] = useState([
    { date: "01/01/2024 | 12:30", sport: "BasketBall", location: "Arena1", amount: 240 },
    { date: "15/02/2024 | 14:00", sport: "Badminton", location: "Court x2", amount: 160 },
    { date: "10/03/2024 | 16:15", sport: "Badminton", location: "Court1", amount: 80 },
  ]);

  // ✅ แยกเดือนออกจากวันที่
  const getMonthFromDate = (date) => date.split("/")[1];

  // ✅ กรองข้อมูลตามเดือนที่เลือก
  const filteredData = selectedMonth
    ? ledgerData.filter((entry) => getMonthFromDate(entry.date) === selectedMonth)
    : ledgerData;

  return (
    <div className="ledger-page">
      {/* ✅ ปุ่มกลับไปยังหน้า Home */}
      <a href="/" className="home-button">
        <img src={homeLogo} alt="Home Logo" className="home-logo" />
      </a>

      <h1 className="ledger-title">บัญชีรายการรับ</h1>

      <div className="ledger-container">
        <div className="content-container2">
          <div className="stadium-list2">
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
            <div className="table-header">
              <h2>รายละเอียด</h2>

              {/* ✅ ปุ่ม Filter */}
              <div className="filter-container">
                <button className="filter-button" onClick={() => setShowDropdown(!showDropdown)}>
                  <img src={filterIcon} alt="Filter" className="filter-icon" />
                </button>

                {/* ✅ Drop-down รายชื่อเดือน */}
                {showDropdown && (
                  <div className="dropdown-menu">
                    <div className="dropdown-item" onClick={() => setSelectedMonth("")}>
                      ล่าสุด
                    </div>
                    {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map((month, index) => (
                      <div
                        key={month}
                        className="dropdown-item"
                        onClick={() => {
                          setSelectedMonth(month);
                          setShowDropdown(false);
                        }}
                      >
                        {["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", 
                          "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"][index]}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

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
                {filteredData.map((entry, index) => (
                  <tr 
                    key={index} 
                    className={selectedRow === index ? "selected-row" : ""}
                    onClick={() => setSelectedRow(index)}
                  >
                    <td>{entry.date}</td>
                    <td>{entry.sport} - {entry.location}</td>
                    <td>{entry.amount} B</td>
                    <td>{(entry.amount * 0.1).toFixed(2)} B</td>
                    <td>{(entry.amount * 0.9).toFixed(2)} B</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="ledger-actions">
              <button className="delete-button1">ขอยกเลิก</button>
              <button className="add-button1">เพิ่ม</button>
              <div className="total-box">
                รวมทั้งหมด: {filteredData.reduce((acc, entry) => acc + entry.amount * 0.9, 0).toFixed(2)} B
              </div>
              <button className="manage-button">การจัดการ</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerLedger;
