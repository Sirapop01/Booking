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
    const [selectedStadium, setSelectedStadium] = useState("ทั้งหมด");
    const [ownerId, setOwnerId] = useState(null);
    const reportRef = useRef(null);

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

    useEffect(() => {
        if (!ownerId) return;
    
        axios
            .get(`http://localhost:4000/api/owner-history/owner-stadiums?ownerId=${ownerId}`)
            .then((response) => {
                setStadiums(response.data);
            })
            .catch((error) => {
                console.error("❌ Error fetching stadiums:", error.response?.data || error);
            });
    }, [ownerId]);

    useEffect(() => {
        if (!ownerId) return;

        axios.get(`http://localhost:4000/api/owner-history/history?ownerId=${ownerId}`)
            .then((response) => {
                setBookings(response.data);
                setFilteredBookings(response.data);
            })
            .catch((error) => {
                console.error("❌ Error fetching booking history:", error.response?.data || error);
            });
    }, [stadiums.length > 0 || ownerId]);

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

    // ✅ ฟังก์ชันดึงเดือนปัจจุบัน + 2 เดือนก่อนหน้า (แก้ไขให้ถูกต้อง)
const getLastTwoMonthsAndCurrent = () => {
    const today = new Date();
    return [...Array(3)].map((_, i) => {
        const date = new Date();
        date.setMonth(today.getMonth() - (2 - i)); // ✅ ใช้ setMonth แทน new Date() เพื่อลดข้อผิดพลาด
        return date.toISOString().slice(0, 7); // แสดงเป็นรูปแบบ YYYY-MM
    });
};

// ✅ กำหนดเดือนล่าสุดที่ต้องการแสดง
const recentMonths = getLastTwoMonthsAndCurrent();

// ✅ กำหนดข้อมูล Bar Chart โดยใช้ข้อมูลทั้งหมด `bookings`
const monthlyData = recentMonths.map((month) => ({
    month,
    count: bookings.filter((booking) => booking.details[0].bookingDate.startsWith(month)).length,
}));



    // ✅ สร้างข้อมูล Pie Chart และสุ่มสีแบบไดนามิก
    const stadiumData = filteredBookings.reduce((acc, booking) => {
        acc[booking.fieldName] = (acc[booking.fieldName] || 0) + 1;
        return acc;
    }, {});

    const pieChartData = Object.keys(stadiumData).map((stadium, index) => ({
        name: stadium,
        value: stadiumData[stadium],
        color: `hsl(${index * 60}, 70%, 50%)`, // ✅ สุ่มสีแบบไดนามิก
    }));

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
                <div ref={reportRef}>
                    <h1 className="title">ภาพรวมการจองสนาม</h1>

                    <div className="filter-container">
                        <label htmlFor="month">เลือกเดือน:</label>
                        <input type="month" id="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} />

                        <label htmlFor="stadium">เลือกสนาม:</label>
                        <select id="stadium" value={selectedStadium} onChange={(e) => setSelectedStadium(e.target.value)}>
                            <option value="ทั้งหมด">ทั้งหมด</option>
                            {stadiums.map((stadium) => (
                                <option key={stadium._id} value={stadium.fieldName}>
                                    {stadium.fieldName}
                                </option>
                            ))}
                        </select>
                    </div>

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
                                        <td>{booking.fieldName}</td>
                                        <td>{booking.userId?.firstName} {booking.userId?.lastName}</td>
                                        <td>{`${booking.details[0].startTime} - ${booking.details[0].endTime}`}</td>
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

                    <div className="charts-container">
                        {/* ✅ Bar Chart: จำนวนการจองแต่ละเดือน */}
                        <div className="chart-box">
                            <h2>สถิติการจองรายเดือน</h2>
                            <BarChart width={500} height={300} data={monthlyData}>
                                <XAxis dataKey="month" />
                                <YAxis tickCount={6} allowDecimals={false} />
                                <Tooltip />
                                <Legend />
                                <Bar 
                                    dataKey="count" 
                                    fill="#007bff"
                                    isAnimationActive={true}  // ✅ เปิดใช้ Animation
                                    animationDuration={1200}  // ⏳ ปรับความเร็ว Animation (1.2 วินาที)
                                />
                            </BarChart>
                        </div>

                        {/* ✅ Pie Chart: แสดงข้อมูลสนาม */}
                        <div className="chart-box">
                            <h2>การจองแยกตามสนาม</h2>
                            <PieChart width={400} height={300}>
                                <Pie 
                                    data={pieChartData} 
                                    cx="50%" 
                                    cy="50%" 
                                    outerRadius={100} 
                                    dataKey="value"
                                    isAnimationActive={true} // ✅ เปิดใช้ Animation
                                    animationDuration={1500} // ⏳ Animation ใช้เวลา 1.5 วินาที
                                >
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Legend />
                                <Tooltip />
                            </PieChart>
                        </div>
                    </div>
                </div>

                <button onClick={downloadPDF} className="download-button">ดาวน์โหลด PDF</button>
            </div>
        </>
    );
};

export default OwnerHistory;
