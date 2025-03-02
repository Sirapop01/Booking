import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./OwnerLedgerDetails.css";
import NavbarOwnerLedgerDetails from "../NavbarOwnerLedgerDetails/NavbarOwnerLedgerDetails";
import filterIcon from "../assets/icons/filter.png";

function OwnerLedgerDetails() {
  const { ownerId } = useParams();
  const [selectedStadium, setSelectedStadium] = useState(null);
  const [stadiums, setStadiums] = useState([]);
  const [ledgerData, setLedgerData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [loading, setLoading] = useState(true);
  const pdfRef = useRef(); // สำหรับสร้าง PDF

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
      } finally {
        setLoading(false);
      }
    };
    fetchStadiums();
  }, [ownerId]);

  useEffect(() => {
    const fetchLedgerData = async () => {
      if (!selectedStadium) return;
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/api/ledger/arena/${selectedStadium}`);
        setLedgerData(response.data);
      } catch (error) {
        console.error("❌ Error fetching ledger data:", error);
        setLedgerData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLedgerData();
  }, [selectedStadium]);

  const getMonthFromDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isNaN(date) ? "" : (date.getMonth() + 1).toString().padStart(2, "0");
  };

  const months = [
    { value: "", label: "ล่าสุด" },
    { value: "01", label: "มกราคม" },
    { value: "02", label: "กุมภาพันธ์" },
    { value: "03", label: "มีนาคม" },
    { value: "04", label: "เมษายน" },
    { value: "05", label: "พฤษภาคม" },
    { value: "06", label: "มิถุนายน" },
    { value: "07", label: "กรกฎาคม" },
    { value: "08", label: "สิงหาคม" },
    { value: "09", label: "กันยายน" },
    { value: "10", label: "ตุลาคม" },
    { value: "11", label: "พฤศจิกายน" },
    { value: "12", label: "ธันวาคม" },
  ];

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
    <div className="details-page">
      <NavbarOwnerLedgerDetails />
      <div className="details-container">
        {loading ? (
          <p className="loading-text">กำลังโหลดข้อมูล...</p>
        ) : (
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
                  <button
                    className="details-filter-button"
                    onClick={() => setShowDropdown(!showDropdown)}
                    aria-label="Filter Transactions"
                  >
                    <img src={filterIcon} alt="Filter" className="details-filter-icon" />
                  </button>

                  {showDropdown && (
                    <div className="details-dropdown-menu">
                      {months.map((month) => (
                        <div
                          key={month.value}
                          className="details-dropdown-item"
                          onClick={() => {
                            setSelectedMonth(month.value);
                            setShowDropdown(false);
                          }}
                        >
                          {month.label}
                        </div>
                      ))}
                    </div>
                  )}
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
                  <button className="details-pdf-button" onClick={generatePDF}>ไฟล์เอกสารรายละเอียด</button>
                </div>
              ) : (
                <table className="ledger-table">
                  <thead>
                    <tr>
                      <th>วัน/เวลา</th>
                      <th>รายการ</th>
                      <th>จำนวน</th>
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
                        <td>{entry.quantity || "1"}</td>
                        <td>{entry.amount.toFixed(2)} B</td>
                        <td>{(entry.amount * 0.1).toFixed(2)} B</td>
                        <td>{(entry.amount * 0.9).toFixed(2)} B</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

                        <div className="details-total-boxs">
                          <p><strong>รวมทั้งหมด:</strong> {totalAmount} B</p>
                        </div>

              <button className="details-manage-button" onClick={() => setShowChart(!showChart)}>
                {showChart ? "กลับไปยังตาราง" : "การจัดการ"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OwnerLedgerDetails;