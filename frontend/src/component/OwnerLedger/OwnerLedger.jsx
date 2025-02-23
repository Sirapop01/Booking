import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./OwnerLedger.css";
import homeLogo from "../assets/logoalt.png";
import filterIcon from "../assets/icons/filter.png";

const OwnerLedger = () => {
  const [stadiums, setStadiums] = useState([]);
  const [selectedStadium, setSelectedStadium] = useState(null);
  const [ledgerData, setLedgerData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const pdfRef = useRef();

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const businessOwnerId = decoded.id;

  useEffect(() => {
    const fetchStadiums = async () => {
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
      }
    };
    fetchStadiums();
  }, [businessOwnerId]);

  useEffect(() => {
    const fetchLedgerData = async () => {
      if (!selectedStadium) return;
      try {
        const response = await axios.get(
          `http://localhost:4000/api/ledger/arena/${selectedStadium}`
        );
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

  const totalAmount = filteredData.reduce((acc, entry) => acc + entry.amount, 0).toFixed(2);
  const totalTaxAmount = filteredData.reduce((acc, entry) => acc + entry.amount * 0.1, 0).toFixed(2);
  const netAmount = (totalAmount - totalTaxAmount).toFixed(2);

  const chartData = filteredData.map((entry) => ({
    date: new Date(entry.dateTime).toLocaleDateString(),
    amount: entry.amount,
    tax: (entry.amount * 0.1).toFixed(2),
  }));

  // ✅ ฟังก์ชันสร้าง PDF
  const generatePDF = () => {
    const input = pdfRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save("รายละเอียดบัญชี.pdf");
    });
  };

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

          <div className="ledger-details">
            <div className="table-header">
              <h2>รายละเอียด</h2>
              <div className="filter-container">
                <button className="filter-button" onClick={() => setShowDropdown(!showDropdown)}>
                  <img src={filterIcon} alt="Filter" className="filter-icon" />
                </button>
              </div>
            </div>

            {showChart ? (
              <div ref={pdfRef}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="amount" fill="#2196F3" name="ยอดเงิน" />
                    <Bar dataKey="tax" fill="#FF5733" name="เรียกเก็บ 10%" />
                  </BarChart>
                </ResponsiveContainer>

                {/* ✅ แสดงข้อมูลด้านล่างเฉพาะโหมดกราฟ */}
                <div className="ledger-summary">
                  <p>ผลประกอบการ: {totalAmount} B</p>
                  <p>ค่าธรรมเนียม 10%: {totalTaxAmount} B</p>
                  <p>รวม - 10%: {netAmount} B</p>
                  <button className="ledger-pdf-button" onClick={generatePDF}>
                    ไฟล์เอกสารรายละเอียด
                  </button>
                </div>
              </div>
            ) : (
              <div className="table-wrapper">
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
                    {filteredData.map((entry) => (
                      <tr key={entry._id}>
                        <td>{new Date(entry.dateTime).toLocaleString()}</td>
                        <td>{entry.item}</td>
                        <td>{entry.amount.toFixed(2)} B</td>
                        <td>{(entry.amount * 0.1).toFixed(2)} B</td>
                        <td>{(entry.amount * 0.9).toFixed(2)} B</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <button className="manage-button6" onClick={() => setShowChart(!showChart)}>
              {showChart ? "กลับไปยังตาราง" : "การจัดการ"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerLedger;
