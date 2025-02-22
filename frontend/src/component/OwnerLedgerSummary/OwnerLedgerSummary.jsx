import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./OwnerLedgerSummary.css";
import homeLogo from "../assets/logoalt.png";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// ✅ ลงทะเบียน Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const OwnerLedgerSummary = () => {
  const { stadiumId } = useParams();
  const [ledgerData, setLedgerData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear] = useState(new Date().getFullYear()); // ใช้ปีปัจจุบัน
  const [monthlySummary, setMonthlySummary] = useState({});

  useEffect(() => {
    const fetchLedgerData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/ledger/arena/${stadiumId}`);
        setLedgerData(response.data);
      } catch (error) {
        console.error("❌ Error fetching ledger data:", error);
      }
    };

    fetchLedgerData();
  }, [stadiumId]);

  useEffect(() => {
    const summary = {};

    ledgerData.forEach((entry) => {
      const date = new Date(entry.dateTime);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      if (year === selectedYear) {
        if (!summary[month]) {
          summary[month] = { totalAmount: 0, totalTax: 0 };
        }
        summary[month].totalAmount += entry.amount;
        summary[month].totalTax += entry.amount * 0.1;
      }
    });

    setMonthlySummary(summary);
  }, [ledgerData, selectedYear]);

  const totalAmount = monthlySummary[selectedMonth]?.totalAmount || 0;
  const totalTax = monthlySummary[selectedMonth]?.totalTax || 0;
  const netTotal = totalAmount - totalTax;

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "ยอดเงินทั้งหมด",
        data: Array.from({ length: 12 }, (_, i) => monthlySummary[i + 1]?.totalAmount || 0),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "ค่าธรรมเนียม 10%",
        data: Array.from({ length: 12 }, (_, i) => monthlySummary[i + 1]?.totalTax || 0),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  return (
    <div className="summary-page">
      <a href="/" className="summary-home-button">
        <img src={homeLogo} alt="Home Logo" className="summary-home-logo" />
      </a>

      <h1 className="summary-title">บัญชีรายการรับ</h1>

      <div className="summary-container">
        <div className="summary-header">
          <h2>รายละเอียด</h2>
        </div>

        {/* ✅ แสดงกราฟ */}
        <div className="summary-chart">
          <Bar data={chartData} />
        </div>

        {/* ✅ แสดงรายละเอียดเดือน */}
        <div className="summary-details">
          <label htmlFor="month">เดือนนี้:</label>
          <select
            id="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
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
            ].map((name, index) => (
              <option key={index + 1} value={index + 1}>
                {name}
              </option>
            ))}
          </select>

          <div className="summary-info">
            <p>ผลประกอบการ : {totalAmount.toFixed(2)} B</p>
            <p>ค่าธรรมเนียม 10% : {totalTax.toFixed(2)} B</p>
            <p>รวม - 10% = {netTotal.toFixed(2)} B</p>
          </div>

          <button className="summary-download">📄 ไฟล์เอกสารรายละเอียด</button>
        </div>
      </div>
    </div>
  );
};

export default OwnerLedgerSummary;
