import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./OwnerLedgerDetails.css";
import homeLogo from "../assets/logoalt.png";
import filterIcon from "../assets/icons/filter.png";

function OwnerLedgerDetails() {
  const { ownerId } = useParams();
  const [selectedStadium, setSelectedStadium] = useState(null);
  const [stadiums, setStadiums] = useState([]);
  const [ledgerData, setLedgerData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/ledger/arenas/owner/${ownerId}`);
        setStadiums(response.data);
        if (response.data.length > 0) {
          setSelectedStadium(response.data[0]._id);
        }
      } catch (error) {
        console.error("❌ Error fetching stadiums:", error);
      }
    };

    fetchStadiums();
  }, [ownerId]);

  useEffect(() => {
    const fetchLedgerData = async () => {
      if (!selectedStadium) return;
      try {
        const response = await axios.get(`http://localhost:4000/api/ledger/arena/${selectedStadium}`);
        setLedgerData(response.data);
      } catch (error) {
        console.error("❌ Error fetching ledger data:", error);
        setLedgerData([]);
      }
    };

    fetchLedgerData();
  }, [selectedStadium]);

  const getMonthFromDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return "";
    return (date.getMonth() + 1).toString().padStart(2, "0");
  };

  const filteredData = selectedMonth
    ? ledgerData.filter((entry) => getMonthFromDate(entry.dateTime) === selectedMonth)
    : ledgerData;

  const totalTaxAmount = filteredData.reduce((acc, entry) => acc + entry.amount * 0.1, 0).toFixed(2);

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
              {stadiums.map((stadium) => (
                <li
                  key={stadium._id}
                  className={selectedStadium === stadium._id ? "selected" : ""}
                  onClick={() => setSelectedStadium(stadium._id)}
                >
                  {stadium.fieldName}
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

            {filteredData.length === 0 ? (
              <p className="no-data-message">❌ ไม่มีรายการ</p>
            ) : (
              <>
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
                          key={entry._id}
                          className={selectedRow === index ? "details-selected-row" : ""}
                          onClick={() => setSelectedRow(index)}
                        >
                          <td>{new Date(entry.dateTime).toLocaleString()}</td>
                          <td>{entry.item}</td>
                          <td>{entry.quantity || "1"}</td>
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
                    รวมทั้งหมด: {totalTaxAmount} B
                  </div>
                  <button className="details-manage-button">การจัดการ</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OwnerLedgerDetails;
