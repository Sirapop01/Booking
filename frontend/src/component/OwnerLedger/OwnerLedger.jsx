import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./OwnerLedger.css";
import homeLogo from "../assets/logoalt.png";
import filterIcon from "../assets/icons/filter.png";

const OwnerLedger = () => {
  const [stadiums, setStadiums] = useState([]);
  const [selectedStadium, setSelectedStadium] = useState(null);
  const [ledgerData, setLedgerData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoadingStadium, setIsLoadingStadium] = useState(true);
  const [isLoadingLedger, setIsLoadingLedger] = useState(false);

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const businessOwnerId = decoded.id;

  useEffect(() => {
    const fetchStadiums = async () => {
      setIsLoadingStadium(true);
      try {
        const response = await axios.get(
          `http://localhost:4000/api/ledger/arenas/owner/${businessOwnerId}`
        );
        setStadiums(response.data);
        if (response.data.length > 0) {
          setSelectedStadium(response.data[0]._id);
        }
      } catch (error) {
        console.error("❌ Error fetching stadiums:", error);
      } finally {
        setIsLoadingStadium(false);
      }
    };

    fetchStadiums();
  }, [businessOwnerId]);

  useEffect(() => {
    const fetchLedgerData = async () => {
      if (!selectedStadium) return;
      setIsLoadingLedger(true);
      try {
        const response = await axios.get(
          `http://localhost:4000/api/ledger/arena/${selectedStadium}`
        );
        setLedgerData(response.data);
      } catch (error) {
        console.error("❌ Error fetching ledger data:", error);
        setLedgerData([]);
      } finally {
        setIsLoadingLedger(false);
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
    ? ledgerData.filter(
        (entry) => getMonthFromDate(entry.dateTime) === selectedMonth
      )
    : ledgerData;

  const totalAmount = filteredData.reduce((acc, entry) => acc + entry.total, 0);

  return (
    <div className="ledger-page">
      <a href="/" className="home-button">
        <img src={homeLogo} alt="Home Logo" className="home-logo" />
      </a>

      <h1 className="ledger-title">บัญชีรายการรับ</h1>

      <div className="ledger-container">
        <div className="content-container2">
          <div className="stadium-list2">
            <h2>สนาม</h2>
            {isLoadingStadium ? (
              <p>กำลังโหลดสนาม...</p>
            ) : (
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
            )}
          </div>

          <div className="ledger-details">
            <div className="table-header">
              <h2>รายละเอียด</h2>

              <div className="filter-container">
                <button
                  className="filter-button"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <img src={filterIcon} alt="Filter" className="filter-icon" />
                </button>

                {showDropdown && (
                  <div className="dropdown-menu">
                    <div
                      className="dropdown-item"
                      onClick={() => {
                        setSelectedMonth("");
                        setShowDropdown(false);
                      }}
                    >
                      ล่าสุด
                    </div>
                    {[
                      "01",
                      "02",
                      "03",
                      "04",
                      "05",
                      "06",
                      "07",
                      "08",
                      "09",
                      "10",
                      "11",
                      "12",
                    ].map((month, index) => (
                      <div
                        key={month}
                        className="dropdown-item"
                        onClick={() => {
                          setSelectedMonth(month);
                          setShowDropdown(false);
                        }}
                      >
                        {[
                          "มกราคม",
                          "กุมภาพันธ์",
                          "มีนาคม",
                          "เมษายน",
                          "พฤษภาคม",
                          "มิถุนายน",
                          "กรกฎาคม",
                          "สิงหาคม",
                          "กันยายน",
                          "ตุลาคม",
                          "พฤศจิกายน",
                          "ธันวาคม",
                        ][index]}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {isLoadingLedger ? (
              <p>กำลังโหลดข้อมูล...</p>
            ) : filteredData.length === 0 ? (
              <p>ไม่พบข้อมูล Payment</p>
            ) : (
              <>
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
                        key={entry._id}
                        className={selectedRow === index ? "selected-row" : ""}
                        onClick={() => setSelectedRow(index)}
                      >
                        <td>{new Date(entry.dateTime).toLocaleString()}</td>
                        <td>{entry.item}</td>
                        <td>{entry.amount.toFixed(2)} B</td>
                        <td>{entry.tax.toFixed(2)} B</td>
                        <td>{entry.total.toFixed(2)} B</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Total Box + ปุ่มการจัดการ */}
                <div className="ledger-footer">
                  <div className="total-text">
                    รวมทั้งหมด: {totalAmount.toFixed(2)} B
                  </div>
                  <button className="manage-button6">การจัดการ</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerLedger;
