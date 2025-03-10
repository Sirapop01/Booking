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
  const [selectedDate, setSelectedDate] = useState("");

  // ✅ ตรวจสอบและแปลง format ของวันที่เลือกก่อนส่งไป backend
  const formatDateForAPI = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // แปลงเป็น YYYY-MM-DD
  };

  useEffect(() => {
    if (!selectedDate) {
      console.warn("⚠ กรุณาเลือกวันที่ก่อน");
      return;
    }

    const formattedDate = formatDateForAPI(selectedDate);

    selectedSubStadiums.forEach((stadium) => {
      fetchStadiumDetails(stadium._id, formattedDate);
    });
  }, [selectedSubStadiums, selectedDate]);

  // 📌 ฟังก์ชันดึงข้อมูลสนามและเวลาที่ถูกจองแล้ว
  const fetchStadiumDetails = async (subStadiumId, selectedDate) => {
    try {
      console.log(`🔍 ดึงข้อมูลสนาม: ${subStadiumId} วันที่: ${selectedDate}`);

      // ✅ ดึงเวลาเปิด-ปิดของสนาม พร้อมแนบ `date`
      const response = await axios.get(
        `http://localhost:4000/api/substadiums/details/${subStadiumId}?date=${selectedDate}`
      );

      const { openTime, closeTime, reservedSlots = [] } = response.data;

      const availableTimes = generateTimeSlots(openTime, closeTime, reservedSlots);

      console.log("⏳ Available Time Slots:", availableTimes);

      setBookingData((prev) => ({
        ...prev,
        [subStadiumId]: { availableTimes, selectedTime: "", openTime, closeTime },
      }));
    } catch (error) {
      console.error("❌ Error fetching stadium details:", error);
    }
  };

  // ✅ ฟังก์ชันสร้างช่วงเวลาเปิด-ปิด (รวมเวลาที่ถูกจองไปแล้ว)
  const generateTimeSlots = (openTime, closeTime, reservedSlots = []) => {
    console.log("⚡ กำลังสร้าง Time Slots:", openTime, "ถึง", closeTime);
    console.log("❌ เวลาที่ถูกจอง:", reservedSlots);

    let times = [];
    let startHour = parseInt(openTime.split(":")[0]);
    let endHour = parseInt(closeTime.split(":")[0]);
    let currentHour = startHour;
    let isCrossDay = endHour < startHour;

    // ✅ แปลง `reservedSlots` ให้เป็น Set เพื่อค้นหาได้เร็วขึ้น
    const reservedSet = new Set(reservedSlots.map((slot) => slot.trim()));

    while (true) {
      let nextHour = (currentHour + 1) % 24;
      let timeSlot = `${currentHour.toString().padStart(2, "0")}:00 - ${nextHour.toString().padStart(2, "0")}:00`;

      let isReserved = reservedSet.has(timeSlot);
      times.push({ time: timeSlot, reserved: isReserved });

      currentHour = nextHour;
      if (!isCrossDay && currentHour >= endHour) break;
      if (isCrossDay && currentHour === endHour) break;
    }

    console.log("✅ ช่วงเวลาที่พร้อมให้จอง:", times);
    return times;
  };

  // ✅ แสดง Popup เลือกเวลา
  const showAvailableTimes = (subStadiumId) => {
    const timeslots = bookingData[subStadiumId]?.availableTimes || [];

    console.log("🕒 Available Time Slots:", timeslots);

    if (timeslots.length === 0) {
      Swal.fire("⚠ ไม่มีช่วงเวลาว่าง", "กรุณาลองเลือกวันอื่น", "warning");
      return;
    }

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
        let selectedTimes = [];
        document.querySelectorAll(".time-slot").forEach((button) => {
          button.addEventListener("click", () => {
            const index = button.getAttribute("data-index");
            const time = timeslots[index].time;

            if (selectedTimes.includes(time)) {
              selectedTimes = selectedTimes.filter((t) => t !== time);
              button.classList.remove("selected");
            } else {
              selectedTimes.push(time);
              button.classList.add("selected");
            }
          });
        });

        Swal.getConfirmButton().addEventListener("click", () => {
          if (selectedTimes.length === 0) {
            Swal.fire("⚠ กรุณาเลือกช่วงเวลาก่อนกดยืนยัน", "", "warning");
            return;
          }
          setBookingData((prev) => ({
            ...prev,
            [subStadiumId]: { ...prev[subStadiumId], selectedTime: selectedTimes.join(", ") },
          }));
          Swal.close();
        });
      },
    });
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
                  <input
                    type="date"
                    className="input-field"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                  />

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
        </div>
      </div>
    </div>
  );
};

export default Booking;
