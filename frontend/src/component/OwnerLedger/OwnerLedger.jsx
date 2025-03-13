import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./OwnerLedger.css";
import filterIcon from "../assets/icons/filter.png";
import NavbarOwnerLedgerDetails from "../NavbarOwnerLedgerDetails/NavbarOwnerLedgerDetails";

const OwnerLedger = () => {
  const [stadiums, setStadiums] = useState([]);
  const [selectedStadium, setSelectedStadium] = useState(null);
  const [ledgerData, setLedgerData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const pdfRef = useRef();

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
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
    console.log("📌 Selected Stadium ID:", selectedStadium);
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
  const totalAmountAfterTax = filteredData.reduce((acc, entry) => {
    const taxAmount = entry.amount * 0.1; // คำนวณภาษี 10%
    return acc + (entry.amount - taxAmount); // บวกยอดหลังหักภาษี
  }, 0).toFixed(2);

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
    <div className="admin-stadium-container"> 
      <NavbarOwnerLedgerDetails />

      <div className="owner-ledger-container">
        <div className="owner-ledger-content">
          <div className="owner-ledger-stadium-list">
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

          <div className="owner-ledger-details">
            <div className="owner-ledger-table-header">
              <h2>รายละเอียด</h2>
              <div className="owner-ledger-filter-container">
                <button className="owner-ledger-filter-button" onClick={() => setShowDropdown(!showDropdown)}>
                  <img src={filterIcon} alt="Filter" className="owner-ledger-filter-icon" />
                </button>

                {showDropdown && (
                  <div className="owner-ledger-dropdown-menu">
                    {months.map((month) => (
                      <div
                        key={month.value}
                        className="owner-ledger-dropdown-item"
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
            
                            <div className="details-summary">
                              <p>ผลประกอบการ: {totalAmount} B</p>
                              <p>ค่าธรรมเนียม 10%: {totalTaxAmount} B</p>
                              <p>รวม - 10%: {netAmount} B</p>
                              <button className="details-pdf-button" onClick={generatePDF}>ไฟล์เอกสารรายละเอียด</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="details-table-wrapper">
                              <table>
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
                                  {filteredData.map((entry) => {
                                    const detail = entry.details?.[0]; // ✅ ดึงข้อมูลจาก details array ตัวแรก
                                    return (
                                      <tr key={entry._id}>
                                        <td>
                                          {detail?.bookingDate
                                            ? new Date(detail.bookingDate).toLocaleDateString("th-TH")
                                            : "ไม่ระบุ"}
                                        </td>
                                        <td>{detail?.sportName || "ไม่ระบุ"}</td>
                                        <td>{entry.quantity || "1"}</td>
                                        <td>{entry.amount.toFixed(2)} B</td>
                                        <td>{(entry.amount * 0.1).toFixed(2)} B</td>
                                        <td>{(entry.amount * 0.9).toFixed(2)} B</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
            
                            {/* ✅ Total Box ✅ */}
                            <div className="details-total-box">
                              <p><strong>ค่าธรรมเนียม 10%:</strong> {totalTaxAmount} B</p>
                                <p><strong>รวมทั้งหมด:</strong> {totalAmountAfterTax} B</p>
                              </div>
                          </>
                        )}
            <button className="owner-ledger-manage-button" onClick={() => setShowChart(!showChart)}>
              {showChart ? "กลับไปยังตาราง" : "การจัดการ"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerLedger;