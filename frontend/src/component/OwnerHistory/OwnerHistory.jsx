import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Navbar from "../Navbar/Navbar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./OwnerHistory.css";

const OwnerHistory = () => {
    const [stadiums, setStadiums] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedStadium, setSelectedStadium] = useState("ทั้งหมด"); // ✅ ตัวเลือกสนาม Default เป็น "ทั้งหมด"
    const [ownerId, setOwnerId] = useState(null);
    const reportRef = useRef(null); // ✅ ใช้ Ref ครอบพื้นที่ต้องการบันทึก PDF

    // ✅ ดึง ownerId จาก Token
    useEffect(() => {
        const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken);
                setOwnerId(decoded.id);
            } catch (error) {
                console.error("❌ Error decoding token:", error);
            }
        }
    }, []);

    // ✅ ดึงรายการสนามที่เป็นของเจ้าของ
    useEffect(() => {
        if (!ownerId) return;
    
        axios
            .get(`http://localhost:4000/api/owner-history/owner-stadiums?ownerId=${ownerId}`) // ✅ เพิ่ม ownerId ใน query string
            .then((response) => {
                console.log("📌 สนามที่พบ:", response.data);
                setStadiums(response.data);
            })
            .catch((error) => {
                console.error("❌ Error fetching stadiums:", error.response?.data || error);
            });
    }, [ownerId]);

    // ✅ ดึง `bookinghistory` เมื่อได้สนามของเจ้าของแล้ว
    useEffect(() => {
        if (!ownerId) return;

        axios.get(`http://localhost:4000/api/owner-history/history?ownerId=${ownerId}`)
            .then((response) => {
                console.log("📌 ข้อมูล Booking ที่ดึงได้:", response.data);
                setBookings(response.data);
                setFilteredBookings(response.data);
            })
            .catch((error) => {
                console.error("❌ Error fetching booking history:", error.response?.data || error);
            });
    }, [stadiums.length > 0 || ownerId]);

    // ✅ ฟังก์ชันกรองข้อมูลตามเดือนและสนามที่เลือก
    useEffect(() => {
        let filtered = bookings;

        if (selectedMonth) {
            filtered = filtered.filter((booking) =>
                booking.details.some((detail) => detail.bookingDate.startsWith(selectedMonth))
            );
        }

        if (selectedStadium !== "ทั้งหมด") {
            filtered = filtered.filter((booking) => booking.fieldName === selectedStadium);
        }

        setFilteredBookings(filtered);
    }, [selectedMonth, selectedStadium, bookings]);

    // ✅ จัดกลุ่มข้อมูลสำหรับ Bar Chart
    const monthlyData = filteredBookings.reduce((acc, booking) => {
        const month = booking.details[0].bookingDate.substring(0, 7);
        acc[month] = (acc[month] || 0) + 1;
        return acc;
    }, {});

    const barChartData = Object.keys(monthlyData).map((month) => ({
        month,
        count: monthlyData[month],
    }));

    // ✅ จัดกลุ่มข้อมูลสำหรับ Pie Chart
    const stadiumData = filteredBookings.reduce((acc, booking) => {
        const stadium = booking.fieldName;
        acc[stadium] = (acc[stadium] || 0) + 1;
        return acc;
    }, {});

    const pieChartData = Object.keys(stadiumData).map((stadium) => ({
        name: stadium,
        value: stadiumData[stadium],
    }));

    const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#d45087"];

    // ✅ ฟังก์ชันบันทึกเป็น PDF
    const downloadPDF = () => {
        if (!reportRef.current) {
            console.error("❌ reportRef.current is null. PDF generation failed.");
            return;
        }

        setTimeout(() => {
            html2canvas(reportRef.current).then((canvas) => {
                const imgData = canvas.toDataURL("image/png");
                const pdf = new jsPDF("p", "mm", "a4");
                const imgWidth = 210;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
                pdf.save("owner-history-report.pdf");
            }).catch((error) => {
                console.error("❌ Error generating PDF:", error);
            });
        }, 500);
    };

    return (
        <>
            <Navbar />
            <div className="owner-history-container">
                <div ref={reportRef}> {/* ✅ ครอบเฉพาะพื้นที่ที่ต้องการบันทึก PDF */}
                    <h1 className="title">ภาพรวมการจองสนาม</h1>

                    {/* ✅ ตัวเลือกกรอง */}
                    <div className="filter-container">
                        <label htmlFor="month">เลือกเดือน:</label>
                        <input type="month" id="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} />

                        <label htmlFor="stadium">เลือกสนาม:</label>
                            <select id="stadium" value={selectedStadium} onChange={(e) => setSelectedStadium(e.target.value)}>
                                <option value="ทั้งหมด">ทั้งหมด</option>
                                {stadiums.length > 0 ? (
                                    stadiums.map((stadium) => (
                                        <option key={stadium._id} value={stadium.fieldName || "ไม่ระบุ"}>
                                            {stadium.fieldName || "ไม่ระบุ"}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>ไม่มีข้อมูลสนาม</option>
                                )}
                            </select>
                        </div>

                    {/* ✅ ตารางแสดงประวัติการจอง */}
                    <table className="booking-table">
                        <thead>
                            <tr>
                                <th>วันที่จอง</th>
                                <th>สนาม</th>
                                <th>ชื่อผู้จอง</th>
                                <th>เวลา</th>
                                <th>สถานะ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.length > 0 ? (
                                filteredBookings.map((booking, index) => (
                                    <tr key={index}>
                                        <td>{new Date(booking.details[0].bookingDate).toLocaleDateString()}</td>
                                        <td>{booking.fieldName || "ไม่ระบุ"}</td>
                                        <td>{booking.userId?.firstName} {booking.userId?.lastName}</td>
                                        <td>
                                            {`${booking.details[0].startTime} - ${booking.details[0].endTime}`}
                                        </td>
                                        <td className={`status ${booking.status}`}>{booking.status}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="no-data">ไม่มีข้อมูลการจอง</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* ✅ กราฟสถิติ */}
                    <div className="charts-container">
                        <div className="chart-box">
                            <h2>สถิติการจองรายเดือน</h2>
                            <BarChart width={500} height={300} data={barChartData}>
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#007bff" />
                            </BarChart>
                        </div>

                        <div className="chart-box">
                            <h2>การจองแยกตามสนาม</h2>
                            <PieChart width={400} height={300}>
                                <Pie data={pieChartData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value">
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </div>
                    </div>
                </div>

                {/* ✅ ปุ่มดาวน์โหลด PDF */}
                <div className="button-container">
                    <button onClick={downloadPDF} className="download-button">ดาวน์โหลด PDF</button>
                </div>
            </div>
        </>
    );
};

export default OwnerHistory;
