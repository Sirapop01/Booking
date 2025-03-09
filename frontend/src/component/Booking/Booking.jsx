import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from '../Navbar/Navbar';
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
  }, [selectedSubStadiums]);

  // ดึงข้อมูลสนามที่มีเวลาเปิด-ปิด
  const fetchStadiumDetails = async (subStadiumId) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/substadiums/details/${subStadiumId}`);
      const { openingTime, closingTime, reservedSlots } = response.data;

      // สร้างช่วงเวลาทั้งหมด
      const availableTimes = generateTimeSlots(openingTime, closingTime, reservedSlots);

      setBookingData((prev) => ({
        ...prev,
        [subStadiumId]: { availableTimes, selectedTime: "", openingTime, closingTime },
      }));
    } catch (error) {
      console.error("❌ Error fetching stadium details:", error);
    }
  };

  // ฟังก์ชันสร้างช่วงเวลาตามเวลาเปิด-ปิด
  const generateTimeSlots = (openingTime, closingTime, reservedSlots) => {
    let times = [];
    let currentTime = new Date(`2000-01-01T${openingTime}`);
    let endTime = new Date(`2000-01-01T${closingTime}`);

    while (currentTime < endTime) {
      let nextTime = new Date(currentTime);
      nextTime.setHours(nextTime.getHours() + 1);

      let timeString = `${currentTime.toTimeString().substring(0, 5)}-${nextTime.toTimeString().substring(0, 5)}`;
      let isReserved = reservedSlots.includes(timeString);

      times.push({ time: timeString, reserved: isReserved });

      currentTime = nextTime;
    }

    return times;
  };

  const showAvailableTimes = (subStadiumId) => {
    const timeslots = bookingData[subStadiumId]?.availableTimes || [];

    Swal.fire({
      title: `เลือกเวลาที่ต้องการ`,
      html: timeslots
        .map(
          (slot) => `
          <button class="time-slot ${slot.reserved ? "reserved" : ""}" 
            data-time="${slot.time}" ${slot.reserved ? "disabled" : ""}>
            ${slot.time}
          </button>`
        )
        .join(""),
      showCancelButton: true,
      cancelButtonText: "ปิด",
      showConfirmButton: false,
      didOpen: () => {
        document.querySelectorAll(".time-slot").forEach((button) => {
          button.addEventListener("click", () => {
            const time = button.getAttribute("data-time");
            setBookingData((prev) => ({
              ...prev,
              [subStadiumId]: { ...prev[subStadiumId], selectedTime: time },
            }));
            Swal.close();
          });
        });
      },
    });
  };

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
