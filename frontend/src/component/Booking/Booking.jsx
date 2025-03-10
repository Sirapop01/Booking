import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import "./Booking.css";

const Booking = () => {
  const location = useLocation();
  const selectedSubStadiums = location.state?.selectedSubStadiums || [];
  const [bookingData, setBookingData] = useState({});

  useEffect(() => {
    selectedSubStadiums.forEach((stadium) => {
        fetchStadiumDetails(stadium._id);
    });
}, [selectedSubStadiums]);  // ✅ ใช้ selectedSubStadiums เป็น dependencies


  // ดึงข้อมูลสนามจาก API
  const fetchStadiumDetails = async (subStadiumId) => {
    try {
        const response = await axios.get(`http://localhost:4000/api/substadiums/details/${subStadiumId}`);
        console.log("📌 API Response:", response.data);  // ✅ Debug Response

        const { openTime, closeTime, reservedSlots = [] } = response.data; // ✅ ตั้งค่า default []

        // สร้างช่วงเวลาทั้งหมด
        const availableTimes = generateTimeSlots(openTime, closeTime, reservedSlots);

        setBookingData((prev) => ({
            ...prev,
            [subStadiumId]: { availableTimes, selectedTime: "", openTime, closeTime },
        }));
    } catch (error) {
        console.error("❌ Error fetching stadium details:", error);
    }
};

  // ฟังก์ชันสร้างช่วงเวลาตามเวลาเปิด-ปิด
  const generateTimeSlots = (openTime, closeTime, reservedSlots = []) => {
    let times = [];
    let startHour = parseInt(openTime.split(":")[0]);  // ดึงค่า ชั่วโมงเปิด
    let endHour = parseInt(closeTime.split(":")[0]);   // ดึงค่า ชั่วโมงปิด

    let currentHour = startHour;
    let isCrossDay = endHour < startHour;  // ✅ เช็คว่าข้ามวันหรือไม่

    while (currentHour !== endHour) {
        let nextHour = (currentHour + 1) % 24; // ✅ รองรับเวลาเกิน 24:00 ไปเป็น 00:00
        let timeSlot = `${currentHour.toString().padStart(2, "0")}:00 - ${nextHour.toString().padStart(2, "0")}:00`;

        let isReserved = Array.isArray(reservedSlots) && reservedSlots.includes(timeSlot);
        times.push({ time: timeSlot, reserved: isReserved });

        currentHour = nextHour;

        // ✅ หยุดลูปเมื่อครบช่วงเวลาเปิด-ปิด
        if (!isCrossDay && currentHour >= endHour) break;
        if (isCrossDay && currentHour === endHour) break;
    }

    return times;
};



  // แสดงเวลาให้เลือกใน Popup
  const showAvailableTimes = (subStadiumId) => {
    const timeslots = bookingData[subStadiumId]?.availableTimes || [];

    Swal.fire({
        title: "เลือกเวลาที่ต้องการ",
        html: `
            <div class="time-slot-container">
                ${timeslots
                    .map(
                        (slot, index) => `
                        <button class="time-slot ${slot.reserved ? "reserved" : ""}" 
                            data-index="${index}" 
                            ${slot.reserved ? "disabled" : ""}>
                            ${slot.time}
                        </button>`
                    )
                    .join("")}
            </div>`,
        showCancelButton: true,
        cancelButtonText: "ปิด",
        showConfirmButton: true,
        confirmButtonText: "ยืนยัน",
        didOpen: () => {
            let selectedTimes = []; // เก็บเวลาที่เลือก
            document.querySelectorAll(".time-slot").forEach((button) => {
                button.addEventListener("click", () => {
                    const index = button.getAttribute("data-index");
                    const time = timeslots[index].time;

                    if (selectedTimes.includes(time)) {
                        // ลบออกถ้ากดซ้ำ
                        selectedTimes = selectedTimes.filter((t) => t !== time);
                        button.classList.remove("selected");
                    } else {
                        // เพิ่มช่วงเวลา
                        selectedTimes.push(time);
                        button.classList.add("selected");
                    }
                });
            });

            // ✅ เมื่อกดปุ่ม "ยืนยัน" ให้บันทึกค่าที่เลือก
            Swal.getConfirmButton().addEventListener("click", () => {
                setBookingData((prev) => ({
                    ...prev,
                    [subStadiumId]: { ...prev[subStadiumId], selectedTime: selectedTimes.join(", ") },
                }));
                Swal.close();
            });
        },
    });
};


  // ยืนยันการจอง
  const handleBookingConfirmation = () => {
    console.log("✅ ข้อมูลการจอง:", bookingData);
    Swal.fire("✅ ยืนยันการจอง", "ระบบได้รับข้อมูลของคุณแล้ว", "success");
  };

  return (
    <div className="booking-container">
      <Navbar />
      <div className="booking-content">
        <div className="booking-left">
          <img src={selectedSubStadiums[0]?.images?.[0] || "https://via.placeholder.com/400"} alt="Stadium" className="booking-image" />
        </div>

        <div className="booking-right">
          {selectedSubStadiums.length > 0 ? (
            selectedSubStadiums.map((sub) => (
              <div key={sub._id} className="booking-form">
                <h2 className="booking-title">{sub.name}</h2>

                <div className="booking-info">
                  <label>วันที่จอง</label>
                  <input type="date" className="input-field" required />

                  <label>ช่วงเวลา</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={bookingData[sub._id]?.selectedTime || ""} 
                    readOnly 
                    onClick={() => showAvailableTimes(sub._id)} 
                    placeholder="คลิกเพื่อเลือกเวลา" 
                  />

                  <p className="booking-price">ราคา: ฿ {sub.price || "ไม่ระบุ"} / ชั่วโมง</p>
                </div>
              </div>
            ))
          ) : (
            <p>ไม่มีสนามที่เลือก</p>
          )}

          <div className="booking-footer">
            <button className="booking-button" onClick={handleBookingConfirmation}>ยืนยันการจอง</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
