import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import "./Booking.css";
import { nanoid } from "nanoid";

const Booking = () => {
  const location = useLocation();
  const selectedSubStadiums = location.state?.selectedSubStadiums || [];
  const [bookingData, setBookingData] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  
  console.log("📌 ข้อมูลที่ได้รับจากหน้าจอง:", selectedSubStadiums);
  const formatDateForAPI = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  
  useEffect(() => {
    if (!selectedDate) {
      console.warn("⚠ กรุณาเลือกวันที่ก่อน");
      return;
    }

    console.log(`📅 วันที่ที่เลือก: ${selectedDate}`);

    const formattedDate = formatDateForAPI(selectedDate);

    selectedSubStadiums.forEach((stadium) => {
      fetchStadiumDetails(stadium._id, formattedDate);
    });
  }, [selectedSubStadiums, selectedDate]);

  const fetchStadiumDetails = async (subStadiumId, selectedDate) => {
    try {
      console.log(`🔍 กำลังดึงข้อมูลสนาม: ${subStadiumId}, วันที่: ${selectedDate}`);

      const response = await axios.get(
        `http://localhost:4000/api/substadiums/details/${subStadiumId}?date=${selectedDate}`
      );

      const { openTime, closeTime, reservedSlots = [] } = response.data;
      console.log(`🕒 เวลาทำการ: ${openTime} - ${closeTime}`);
      console.log(`⛔ เวลาที่ถูกจอง: ${reservedSlots}`);

      const availableTimes = generateTimeSlots(openTime, closeTime, reservedSlots);

      setBookingData((prev) => ({
        ...prev,
        [subStadiumId]: { availableTimes, selectedTime: "", openTime, closeTime },
      }));
    } catch (error) {
      console.error("❌ Error fetching stadium details:", error);
    }
  };

  const generateTimeSlots = (openTime, closeTime, reservedSlots = []) => {
    let times = [];
    let startHour = parseInt(openTime.split(":")[0]);
    let endHour = parseInt(closeTime.split(":")[0]);
    let currentHour = startHour;
    let isCrossDay = endHour < startHour;

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

    return times;
  };

  const showAvailableTimes = (subStadiumId) => {
    if (!selectedDate) {
      console.warn("⚠ กรุณาเลือกวันที่ก่อนเลือกเวลา");
      Swal.fire("⚠ กรุณาเลือกวันที่ก่อน", "", "warning");
      return;
    }
  
    const timeslots = bookingData[subStadiumId]?.availableTimes || [];
  
    if (timeslots.length === 0) {
      console.warn("❌ ไม่มีช่วงเวลาว่าง กรุณาเลือกวันอื่น");
      Swal.fire("⚠ ไม่มีช่วงเวลาว่าง", "กรุณาลองเลือกวันอื่น", "warning");
      return;
    }
  
    console.log(`🕒 แสดงช่วงเวลาที่เลือกสำหรับสนาม ${subStadiumId}`);
  
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
            console.warn("⚠ ยังไม่ได้เลือกช่วงเวลา");
            return;
          }
  
          // ✅ เรียงเวลาให้เป็นช่วงต่อเนื่อง
          selectedTimes.sort((a, b) => {
            const hourA = parseInt(a.split(":")[0], 10);
            const hourB = parseInt(b.split(":")[0], 10);
            return hourA - hourB;
          });
  
          // ✅ รวมช่วงเวลาให้ดูเข้าใจง่าย
          const firstSlot = selectedTimes[0].split(" - ")[0];
          const lastSlot = selectedTimes[selectedTimes.length - 1].split(" - ")[1];
          const displayTime = `${firstSlot} - ${lastSlot}`;
  
          console.log(`✅ ช่วงเวลาที่เลือก: ${displayTime}`);
  
          setBookingData((prev) => ({
            ...prev,
            [subStadiumId]: { ...prev[subStadiumId], selectedTime: displayTime },
          }));
  
          Swal.close();
        });
      },
    });
  };
  
  const handleConfirmBooking = async () => {
    try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
            Swal.fire("⚠ กรุณาเข้าสู่ระบบก่อนทำการจอง", "", "warning");
            return;
        }

        let userId = null;
        try {
            const decodedToken = JSON.parse(atob(token.split(".")[1]));
            console.log("✅ Decoded Token in Booking:", decodedToken);
            userId = decodedToken?.id;
        } catch (err) {
            console.error("🚨 Error decoding JWT:", err);
            Swal.fire("❌ Token ไม่ถูกต้อง กรุณาเข้าสู่ระบบใหม่", "", "error");
            return;
        }

        if (!userId) {
            Swal.fire("⚠ ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่", "", "warning");
            return;
        }

        if (!selectedDate) {
            Swal.fire("⚠ กรุณาเลือกวันที่ก่อน", "", "warning");
            return;
        }

        let totalPrice = 0;
        let details = [];

        selectedSubStadiums.forEach((sub) => {
            const selectedTimeSlots = bookingData[sub._id]?.selectedTime?.split(", ") || [];

            if (selectedTimeSlots.length > 0) {
                const startTime = selectedTimeSlots[0].split(" - ")[0]; 
                const endTime = selectedTimeSlots[selectedTimeSlots.length - 1].split(" - ")[1];

                // ✅ คำนวณ duration เป็นจำนวนชั่วโมงที่ถูกต้อง
                const startHour = parseInt(startTime.split(":")[0]);
                const endHour = parseInt(endTime.split(":")[0]);
                const duration = endHour - startHour;

                const pricePerHour = parseFloat(sub.price) || 0;
                const price = pricePerHour * duration;

                totalPrice += price; // ✅ รวมราคาทั้งหมด

                details.push({
                    bookingDate: formatDateForAPI(selectedDate),  // ✅ เพิ่มวันที่จองลงใน details
                    subStadiumId: sub._id,
                    sportName: sub.sportName,
                    startTime: startTime,
                    endTime: endTime,
                    duration: duration, // ✅ แสดงจำนวนชั่วโมงที่ถูกต้อง
                    pricePerHour: pricePerHour,
                    price: price, // ✅ ราคาต่อสนาม
                });
            }
        });

        if (details.length === 0) {
            Swal.fire("⚠ กรุณาเลือกเวลาอย่างน้อย 1 ช่วง", "", "warning");
            return;
        }

        // ✅ ส่ง `totalPrice` อยู่นอก `details`
        const bookingPayload = {
            sessionId: nanoid(10),
            userId,
            stadiumId: selectedSubStadiums[0].arenaId, // ใช้สนามแรกที่เลือก
            ownerId: selectedSubStadiums[0].ownerId,
            bookingDate: formatDateForAPI(selectedDate),
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // หมดอายุใน 10 นาที
            totalPrice,
            details,
        };

        console.log("📌 ข้อมูลที่ส่งไปยัง Backend:", bookingPayload);

        const response = await axios.post(
            "http://localhost:4000/api/bookinghistories/confirm-booking",
            bookingPayload,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 201) {
            Swal.fire("✅ ยืนยันการจองสำเร็จ!", "ระบบได้บันทึกการจองของคุณแล้ว", "success");
        }
    } catch (error) {
        console.error("🚨 Error confirming booking:", error);
        Swal.fire("❌ เกิดข้อผิดพลาด", "ไม่สามารถยืนยันการจองได้ กรุณาลองใหม่", "error");
    }
};


  return (
    <div className="booking-container">
      <Navbar />
      <div className="booking-content">
        {selectedSubStadiums.map((sub) => (
          <form key={sub._id} className="booking-card">
            <div className="booking-left">
              <img src={sub.images?.[0] || "https://via.placeholder.com/400"} alt="Stadium" className="booking-image" />
            </div>
            <div className="booking-right">
              <h2 className="booking-title">{sub.name}</h2>
              <label>วันที่จอง</label>
              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} required />
              <label>ช่วงเวลา</label>
              <input type="text" value={bookingData[sub._id]?.selectedTime || ""} readOnly onClick={() => showAvailableTimes(sub._id)} required />
              <p className="booking-price">ราคา: ฿ {sub.price || "ไม่ระบุ"} / ชั่วโมง</p>
            </div>
          </form>
        ))}
      </div>
      <button className="confirm-button" onClick={handleConfirmBooking}>ยืนยันการจอง</button>
    </div>
  );
};

export default Booking;