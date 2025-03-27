# 🏟️ Booking System

ระบบจองสนามกีฬาออนไลน์ที่รองรับการลงทะเบียนผู้ใช้ การจองสนาม การอัปโหลดหลักฐานการชำระเงิน การยืนยันสถานะโดยผู้ดูแลระบบ และแสดงประวัติการจองพร้อมฟังก์ชันสมุดรายรับรายจ่ายสำหรับเจ้าของสนาม

---

## 📌 Overview

โปรเจกต์นี้ประกอบด้วย 2 ส่วนหลัก:

- **Frontend**: React.js (with Axios, SweetAlert2, JWT)
- **Backend**: Express.js + Node.js + MongoDB

ออกแบบมาให้ใช้งานง่าย มีระบบยืนยันตัวตน การจองแบบมีเวลาเลือก และการจัดการโดย admin ที่ชัดเจน

---

## ✨ Features

- 👥 ลงทะเบียน / เข้าสู่ระบบ
- 📅 เลือกสนาม / วันที่ / เวลาที่ต้องการจอง
- 💳 อัปโหลดหลักฐานการชำระเงินภายใน 10 นาที
- 🛠️ Admin ยืนยัน / ปฏิเสธการจอง พร้อมเหตุผล
- 🧾 ประวัติการจองของผู้ใช้
- 📊 ระบบ Ledger แสดงรายรับเจ้าของสนาม พร้อมกราฟ & PDF Report
- 💬 ระบบแชทแบบ Real-time (Socket.io)

---

## 🛠 Installation

### 1. Clone Repo

```bash
git clone https://github.com/Sirapop01/Booking.git
cd Booking
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

สร้างไฟล์ `.env` และใส่ค่าต่อไปนี้:

```
PORT=5000
MONGODB_URI=mongodb+srv://<your_mongo_uri>
JWT_SECRET=your_secret
```

รันเซิร์ฟเวอร์:

```bash
npm run dev
```

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

ระบบจะเปิดที่: `http://localhost:3000`

---

## 🧭 Usage

### 1. 👤 การลงทะเบียน / เข้าสู่ระบบ
- `/register`: สมัครบัญชีผู้ใช้
- `/login`: เข้าสู่ระบบ รับ JWT token

### 2. 📅 การจองสนาม
- `/booking`: เลือกสนาม → วันที่ → เวลา
- กด “จอง” ระบบสร้าง booking (status: `pending`) และพาไปหน้า `payment`

### 3. 💳 อัปโหลดสลิปการชำระเงิน
- `/payment`: อัปโหลดรูปสลิปภายใน 10 นาที
- ส่ง POST `/api/payments` พร้อม bookingId
- รอการตรวจสอบโดย admin

### 4. 🛠 Admin Panel
- `/admin/confirm-booking`:
  - ✅ ยืนยัน → `status: confirm`
  - ❌ ปฏิเสธ → `status: rejected` พร้อมเหตุผล

### 5. 🧾 ประวัติการจอง
- `/history`: แสดงทุก booking ของผู้ใช้ (ชื่อสนาม, วันที่, เวลา, สถานะ)

### 6. 📊 Ledger เจ้าของสนาม
- `/owner/ledger`:
  - รายรับทั้งหมดจาก booking ที่ “confirm”
  - กรองตามเดือน
  - กราฟรายเดือน (Recharts)
  - ปุ่ม Export PDF (html2canvas + jsPDF)

### 7. 💬 แชทกับแอดมิน
- Popup แชทแบบ real-time ด้วย Socket.io
- รองรับข้อความใหม่, การอ่าน, ลบ, ประวัติ

---

## 🖼 Screenshots

```md
### 🔐 Login
![Login](public/screenshots/login.png)

### 📅 Booking Page
![Booking](public/screenshots/booking.png)

### 💳 Payment Upload
![Payment](public/screenshots/payment.png)

### 🛠 Admin Panel
![Admin](public/screenshots/admin.png)

### 📊 Owner Ledger
![Ledger](public/screenshots/ledger.png)
```

---

## 📂 Folder Structure

```
Booking/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── App.js
    └── public/
```

---

## ✅ Tech Stack

- Frontend: React.js, Axios, SweetAlert2, Tailwind (optional)
- Backend: Express.js, MongoDB, JWT, Multer
- Real-time: Socket.io
- Charts: Recharts
- PDF Export: jsPDF + html2canvas

---
