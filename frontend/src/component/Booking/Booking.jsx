import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import "./Booking.css";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";

const Booking = () => {
  const location = useLocation();
  const selectedSubStadiums = location.state?.selectedSubStadiums || [];
  const [bookingData, setBookingData] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const navigate = useNavigate();
  const fieldName = location.state?.fieldName || "ไม่พบชื่อสนาม"; // ✅ ดึง fieldName
  const stadiumImage = location.state?.stadiumImage || "https://via.placeholder.com/150"; // ✅ ดึง stadiumImage
  const [selectedDates, setSelectedDates] = useState({}); // ✅ ใช้ object เก็บวันที่ของแต่ละสนามย่อย
  const [loadingSlots, setLoadingSlots] = useState(false); // ✅ ตัวแปรเช็คว่ากำลังโหลดข้อมูล
  
  console.log("📌 ข้อมูลที่ได้รับจาก BookingArena:", { selectedSubStadiums, fieldName, stadiumImage });
  const formatDateForAPI = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  
  useEffect(() => {
    Object.keys(selectedDates).forEach((subStadiumId) => {
        fetchStadiumDetails(subStadiumId, selectedDates[subStadiumId]);
    });
  }, [selectedDates]);

  const fetchStadiumDetails = async (subStadiumId, selectedDate) => {
    try {
        console.log(`🔍 กำลังดึงข้อมูลสนาม: ${subStadiumId}, วันที่: ${selectedDate}`);

        const response = await axios.get(
            `http://localhost:4000/api/substadiums/details/${subStadiumId}?date=${selectedDate}`
        );

        const { openTime, closeTime, reservedSlots = [], pendingSlots = [], canceledSlots = [] } = response.data;

        console.log(`🕒 เวลาทำการ: ${openTime} - ${closeTime}`);
        console.log(`⛔ เวลาที่ถูกจอง: ${reservedSlots}`);
        console.log(`⏳ เวลาที่อยู่ระหว่างรอชำระเงิน: ${pendingSlots}`);
        console.log(`🟢 เวลาที่ยกเลิกแล้ว (จองได้): ${canceledSlots}`);

        const availableTimes = generateTimeSlots(openTime, closeTime, reservedSlots, pendingSlots, canceledSlots);

        setBookingData((prev) => ({
            ...prev,
            [subStadiumId]: { availableTimes, selectedTime: "", openTime, closeTime },
        }));
    } catch (error) {
        console.error("❌ Error fetching stadium details:", error);
    }
};



const generateTimeSlots = (openTime, closeTime, reservedSlots = [], pendingSlots = [], canceledSlots = []) => {
  let times = [];
  let startHour = parseInt(openTime.split(":")[0]);
  let endHour = parseInt(closeTime.split(":")[0]);
  let currentHour = startHour;
  let isCrossDay = endHour < startHour;

  const reservedSet = new Set(reservedSlots);
  const pendingSet = new Set(pendingSlots);
  const canceledSet = new Set(canceledSlots);

  while (true) {
      let nextHour = (currentHour + 1) % 24;
      let timeSlot = `${currentHour.toString().padStart(2, "0")}:00 - ${nextHour.toString().padStart(2, "0")}:00`;

      let isReserved = reservedSet.has(timeSlot);
      let isPending = pendingSet.has(timeSlot);
      let isCanceled = canceledSet.has(timeSlot);

      times.push({
          time: timeSlot,
          reserved: isReserved,
          pending: isPending,
          canceled: isCanceled,
      });

      currentHour = nextHour;
      if (!isCrossDay && currentHour >= endHour) break;
      if (isCrossDay && currentHour === endHour) break;
  }

  return times;
};


const showAvailableTimes = async (subStadiumId) => {
  const selectedDate = selectedDates[subStadiumId];

  if (!selectedDate) {
      Swal.fire("⚠ กรุณาเลือกวันที่ก่อน", "", "warning");
      return;
  }

  setLoadingSlots(true); // ✅ เริ่มโหลดข้อมูล

  await fetchStadiumDetails(subStadiumId, selectedDate); // ✅ ดึงข้อมูลใหม่

  setLoadingSlots(false); // ✅ เสร็จสิ้นการโหลด

  const timeslots = bookingData[subStadiumId]?.availableTimes || [];

  if (!loadingSlots && timeslots.length === 0) {
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
                  <button class="time-slot ${slot.reserved ? "reserved" : slot.pending ? "pending" : ""}" 
                      data-index="${index}" 
                      ${slot.reserved || slot.pending ? "disabled" : ""}>
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

              selectedTimes.sort((a, b) => {
                  const hourA = parseInt(a.split(":")[0], 10);
                  const hourB = parseInt(b.split(":")[0], 10);
                  return hourA - hourB;
              });

              const firstSlot = selectedTimes[0].split(" - ")[0];
              const lastSlot = selectedTimes[selectedTimes.length - 1].split(" - ")[1];
              const displayTime = `${firstSlot} - ${lastSlot}`;

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

        if (!userId || Object.keys(selectedDates).length === 0) {
            Swal.fire("⚠ กรุณาเลือกวันที่ก่อน", "", "warning");
            return;
        }

        let totalPrice = 0;
        let details = [];

        selectedSubStadiums.forEach((sub) => {
            const selectedBookingDate = selectedDates[sub._id];
            const selectedTimeSlots = bookingData[sub._id]?.selectedTime?.split(", ") || [];
            if (!selectedBookingDate) {
                console.warn(`❌ ไม่พบวันที่ของสนาม ${sub.name}`);
                return;
            }

            if (selectedTimeSlots.length > 0) {
                const startTime = selectedTimeSlots[0].split(" - ")[0];
                const endTime = selectedTimeSlots[selectedTimeSlots.length - 1].split(" - ")[1];

                const startHour = parseInt(startTime.split(":")[0]);
                const endHour = parseInt(endTime.split(":")[0]);
                let duration = endHour >= startHour ? endHour - startHour : (24 - startHour) + endHour;
                if (duration < 0) duration = 0;

                const pricePerHour = parseFloat(sub.price) || 0;
                const price = pricePerHour * duration;
                totalPrice += price;

                details.push({
                    bookingDate: formatDateForAPI(selectedBookingDate),
                    subStadiumId: sub._id,
                    sportName: sub.sportName,
                    name: sub.name || "ไม่พบชื่อสนามย่อย",
                    startTime,
                    endTime,
                    duration,
                    pricePerHour,
                    price,
                });
            }
        });

        if (details.length === 0) {
            Swal.fire("⚠ กรุณาเลือกเวลาอย่างน้อย 1 ช่วง", "", "warning");
            return;
        }

        const sessionId = nanoid(10);
        const bookingPayload = {
            sessionId,
            userId,
            stadiumId: selectedSubStadiums[0].arenaId,
            ownerId: selectedSubStadiums[0].ownerId,
            fieldName,
            stadiumImage,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000), // ✅ หมดอายุใน 10 นาที
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
            Swal.fire({
                icon: "success",
                title: "✅ ยืนยันการจองสำเร็จ!",
                text: "ระบบได้บันทึกการจองของคุณแล้ว",
                confirmButtonText: "ไปที่หน้าชำระเงิน",
            }).then(() => {
              navigate("/payment", { state: { bookingData: bookingPayload } });
            });

            // ✅ ตั้งเวลายกเลิกอัตโนมัติใน 10 วินาที
            setTimeout(async () => {
                try {
                    await axios.post(
                        "http://localhost:4000/api/bookinghistories/cancel-expired",
                        { sessionId },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    console.log("🚨 คำสั่งจองหมดอายุและถูกยกเลิกแล้ว:", sessionId);
                } catch (error) {
                    console.error("❌ ไม่สามารถยกเลิกการจองอัตโนมัติ:", error);
                }
            }, 5 * 60 * 1000);
        }
    } catch (error) {
        console.error("🚨 Error confirming booking:", error);
        Swal.fire("❌ เกิดข้อผิดพลาด", "ไม่สามารถยืนยันการจองได้ กรุณาลองใหม่", "error");
    }
};


const handleDateChange = async (subStadiumId, date) => {
  setSelectedDates((prev) => ({
    ...prev,
    [subStadiumId]: date, // ✅ อัปเดตวันที่ของแต่ละสนาม
  }));

  try {
    await fetchStadiumDetails(subStadiumId, date);

    // ✅ เคลียร์ช่วงเวลาที่เลือกเมื่อเปลี่ยนวันที่
    setBookingData((prev) => ({
      ...prev,
      [subStadiumId]: { ...prev[subStadiumId], selectedTime: "" },
    }));
  } catch (error) {
    console.error("❌ ไม่สามารถดึงข้อมูลสนาม:", error);
    Swal.fire("❌ เกิดข้อผิดพลาด", "ไม่สามารถโหลดเวลาว่างของสนามได้", "error");
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
            <input
                type="date"
                min={new Date().toLocaleDateString("sv-SE")} // ✅ ใช้ให้รองรับ Timezone
                value={selectedDates[sub._id] || ""}
                onChange={(e) => handleDateChange(sub._id, e.target.value)}
                required
                onClick={(e) => e.target.showPicker()} // ✅ ให้เด้ง DatePicker อัตโนมัติ
            />
            <label>ช่วงเวลา</label>
            <input
              type="text"
              value={bookingData[sub._id]?.selectedTime || ""}
              readOnly
              onClick={() => showAvailableTimes(sub._id)}
              required
            />
            <p className="booking-price">ราคา: ฿ {sub.price || "ไม่ระบุ"} / ชั่วโมง</p>
          </div>
        </form>
      ))}
    </div>
    
    {/* ปุ่มยืนยันการจอง */}
    <button className="confirm-button" onClick={handleConfirmBooking}>ยืนยันการจอง</button>

    {/* 🔻 Legend อธิบายสีของช่วงเวลา */}
    <div className="time-slot-legend">
      <div className="legend-item">
        <span className="legend-box pending"></span> <span>สถานะการดำเนินการจ่ายตัง</span>
      </div>
      <div className="legend-item">
        <span className="legend-box reserved"></span> <span>ติดจอง</span>
      </div>
    </div>
  </div>
);
};

export default Booking;