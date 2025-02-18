import React, { useState } from 'react';
import './OwnerLedgerDetails.css';
import homeLogo from '../assets/logoalt.png';
import filterIcon from '../assets/icons/filter.png';

function OwnerLedgerDetails() {
  const [selectedStadium, setSelectedStadium] = useState("Wichai Arena");
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const stadiums = ["Wichai Arena", "Sophia Arena"];

  const ledgerData = [
    { date: '01/01/2024 | 10:00', sport: 'BasketBall', quantity: 'Arena1', amount: 240 },
    { date: '15/02/2024 | 14:00', sport: 'Badminton', quantity: 'Court x2', amount: 160 },
    { date: '20/02/2024 | 16:30', sport: 'Badminton', quantity: 'Court1', amount: 80 },
  ];

  const getMonthFromDate = (date) => date.split("/")[1];

  const filteredData = selectedMonth
    ? ledgerData.filter((entry) => getMonthFromDate(entry.date) === selectedMonth)
    : ledgerData;

  return (
    <div className="details-page">
      <a href="/" className="details-home-button">
        <img src={homeLogo} alt="Home Logo" className="details-home-logo" />
      </a>

      <h1 className="details-title">บัญชีรายการรับ ของเจ้าของสนาม</h1>

      <div className="details-container">
        <div className="details-content-container">
          <div className="details-stadium-list">
            <h2>สนาม</h2>
            <ul>
              {stadiums.map((stadium, index) => (
                <li
                  key={index}
                  className={selectedStadium === stadium ? 'selected' : ''}
                  onClick={() => setSelectedStadium(stadium)}
                >
                  {stadium}
                </li>
              ))}
            </ul>
          </div>

          <div className="details-ledger">
            <div className="details-table-header">
              <h2>รายละเอียด</h2>
              <div className="details-filter-container">
                <button className="details-filter-button" onClick={() => setShowDropdown(!showDropdown)}>
                  <img src={filterIcon} alt="Filter" className="details-filter-icon" />
                </button>

                {showDropdown && (
                  <div className="details-dropdown-menu">
                    <div className="details-dropdown-item" onClick={() => setSelectedMonth("")}>
                      ล่าสุด
                    </div>
                    {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map((month, index) => (
                      <div
                        key={month}
                        className="details-dropdown-item"
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

            <div className="details-table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>วัน/เวลา</th>
                    <th>ลิสต์ (ล่าสุด)</th>
                    <th>จำนวน</th>
                    <th>ยอดเงิน</th>
                    <th>เรียกเก็บ 10%</th>
                    <th>รวม</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((entry, index) => (
                    <tr
                      key={index}
                      className={selectedRow === index ? "details-selected-row" : ""}
                      onClick={() => setSelectedRow(index)}
                    >
                      <td>{entry.date}</td>
                      <td>{entry.sport}</td>
                      <td>{entry.quantity}</td>
                      <td>{entry.amount.toFixed(2)} B</td>
                      <td>{(entry.amount * 0.1).toFixed(2)} B</td>
                      <td>{(entry.amount * 0.9).toFixed(2)} B</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="details-actions">
              <div className="details-total-box">
                รวมทั้งหมด:{" "}
                {filteredData
                  .reduce((acc, entry) => acc + entry.amount * 0.1, 0)
                  .toFixed(2)}{" "}
                B
              </div>
              <button className="details-manage-button">การจัดการ</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OwnerLedgerDetails;
