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

[![Watch the demo video](https://img.youtube.com/vi/byr-z6YT-XI/hqdefault.jpg)](https://youtu.be/byr-z6YT-XI)

## 🧭 Usage

### 1. 👤 ผู้ใช้ทั่วไป

#### ✅ การลงทะเบียน / เข้าสู่ระบบ
- `/register` ลงทะเบียนบัญชีใหม่
- `/login` เข้าสู่ระบบและรับ JWT token

#### 🔍 ค้นหาสนาม
- `/`
- ผู้ใช้สามารถค้นหาสนามด้วยชื่อ หรือ ประเภทกีฬา และ จากบริเวณที่สนใจ

#### 📅 การจองสนาม
- `/booking`
- เลือกสนาม → วันที่ → เวลา → กด “จอง”
- ระบบจะสร้าง booking (status: `pending`) และนำไปยังหน้าชำระเงิน

#### 💳 อัปโหลดสลิปการชำระเงิน
- `/payment`
- อัปโหลดหลักฐานการโอนภายใน 10 นาที
- ระบบจะบันทึกและรอ admin ตรวจสอบ

#### ❤️ สนามที่ถูกใจ
- `/favorites`
- แสดงรายชื่อสนามที่ผู้ใช้กด "หัวใจ" ไว้
- สามารถลบหรือไปจองได้จากหน้านี้

#### 👤 โปรไฟล์ผู้ใช้
- `/profile`
- แสดงข้อมูลส่วนตัว (ชื่อ, อีเมล, เบอร์โทร, ฯลฯ)
- สามารถแก้ไขข้อมูลส่วนตัวได้

#### 📖 ประวัติการจอง
- `/history`
- รายการการจองทั้งหมด (ชื่อสนาม, วันที่, เวลา, สถานะ, รีวิว)

---

### 2. 🧑‍💼 เจ้าของสนาม

#### 👤 โปรไฟล์เจ้าของ
- `/profile`
- แสดงข้อมูลส่วนตัว แก้ไขโปรไฟล์ได้

#### 🏟️ สนามของฉัน
- `/owner/stadiums`
- แสดงสนามที่เจ้าของมีสิทธิ์จัดการ
- สามารถเพิ่ม / ลบ / แก้ไข / ตั้งค่าเปิด-ปิดสนาม

#### 📈 สถิติการจอง
- `/owner/ledger`
- ดูรายรับย้อนหลัง, ดูยอดเงิน, กรองรายเดือน
- กราฟ (Recharts) และ PDF Report

#### 🎁 โปรโมชั่น
- `/owner/promotions`
- เพิ่ม/ลบโปรโมชั่นส่วนลดให้กับสนามของตนเอง

---

### 3. 🛡️ แอดมินระบบ

#### 📊 Dashboard
- `/admin/dashboard`
- รวมทางลัดเข้าฟีเจอร์สำคัญ เช่น ยืนยันบัญชี, จัดการผู้ใช้ ฯลฯ

#### 🧾 ยืนยันผู้ประกอบการ
- `/admin/verify-owners`
- ตรวจสอบและอนุมัติ / ปฏิเสธเจ้าของสนามที่สมัครเข้ามา

#### 👥 จัดการบัญชีผู้ใช้
- `/admin/users`
- ดู / ลบ / แก้ไขผู้ใช้ทั่วไปและเจ้าของสนาม

#### 💬 ศูนย์ช่วยเหลือ (แชท)
- `/admin/chat-support`
- ตอบกลับคำถามจากผู้ใช้และเจ้าของสนามแบบ real-time

#### 📑 ตรวจสอบรายการบัญชี
- `/admin/owner-ledger`
- เข้าดูรายรับของเจ้าของสนามแต่ละคน เพื่อการตรวจสอบ

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

## ✍ Author

- GitHub: [Sirapop01](https://github.com/Sirapop01)

---
